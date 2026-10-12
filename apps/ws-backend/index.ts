import { prisma } from "db/client";
import { createLogger } from "logger";
import { WebSocketServer, WebSocket } from "ws";

const server = new WebSocketServer({ port: Number(process.env.PORT) });

const logger = createLogger("ws-backend");
const ROOMS: Record<string, { socket: WebSocket; userID: string }[]> = {};

server.on("connection", (socket, request) => {
  console.log(request);
  socket.on("message", async (data) => {
    // Parsing data after receiving a message from the client
    const parsedID = JSON.parse(data.toString());

    // Join boardsocket
    if (parsedID.type === "join") {
      const boardID = parsedID.boardID;
      // Get user ID from headers or cookies
      const userID = parsedID.userID;

      const user = await prisma.user.findUnique({
        where: {
          id: userID,
        },
      });

      // If the board doesn't exist, create it
      if (!ROOMS[boardID]) {
        ROOMS[boardID] = [];
      }

      // Add the user to the board
      ROOMS[boardID].push({ socket, userID });

      // Send notification to other users on the board
      ROOMS[boardID]
        .filter((user) => user.userID !== userID)
        .forEach((user) =>
          user.socket.send(
            JSON.stringify({
              type: "join",
              userID: userID,
            }),
          ),
        );

      socket.send(
        JSON.stringify({
          type: "initial_state",
          users: ROOMS[boardID]
            .filter((user) => user.userID !== userID)
            .map((user) => ({ id: user.userID })),
        }),
      );
    }
  });

  // Send leave notification when the socket closes or user leaves
  socket.on("close", () => {
    Object.entries(ROOMS).forEach(([boardID, users]) => {
      const userExists = users.find((user) => user.socket === socket);
      if (userExists) {
        ROOMS[boardID] = ROOMS[boardID]!.filter(
          (user) => user.socket !== socket,
        );
        users.forEach((user) =>
          user.socket.send(
            JSON.stringify({
              type: "leave",
              userID: userExists.userID,
            }),
          ),
        );
      }
    });
  });
});
