import { prisma } from "db/client";
import { createLogger } from "logger";
import { WebSocketServer, WebSocket } from "ws";

const server = new WebSocketServer({ port: Number(process.env.PORT) });

const logger = createLogger("ws-backend");
const USERS: Record<string, { socket: WebSocket; userID: string }[]> = {};

server.on("connection", (socket, request) => {
  console.log(request);
  socket.on("message", async (data) => {
    // Parsing data after receiving a message from the client
    const parsedID = JSON.parse(data.toString());

    // Join board
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
      if (!USERS[boardID]) {
        USERS[boardID] = [];
      }

      // Add the user to the board
      USERS[boardID].push({ socket, userID });

      // Send notification to other users on the board
      USERS[boardID].forEach((user) =>
        user.socket.send(
          JSON.stringify({
            type: "join",
            userID: userID,
          }),
        ),
      );
    }
  });
});
