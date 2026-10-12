import { Route, Routes, useParams } from "react-router";
import "./App.css";
import { useEffect, useState } from "react";
import { Login } from "./pages/login";
import { SignUp } from "./pages/sign-up";

function App() {
  return (
    <div className="w-full h-screen">
      <Routes>
        <Route path="/boards/:boardID" element={<Board />} />
        <Route
          path="/sign-up"
          element={
            <div className="flex w-full h-screen justify-center items-center">
              <SignUp />
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div className="flex w-full h-screen justify-center items-center">
              <Login />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

function Board() {
  const { boardID } = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/boards/${boardID}`);
    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "initial_state") {
        setUsers(data.users);
      }
      if (data.type === "join") {
        setUsers([...users, { id: data.userID }]);
      }
      if (data.type === "leave") {
        setUsers(users.filter((user) => user.id !== data.userID));
      }
    };

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          boardID,
        }),
      );
    };
  }, [boardID, users]);

  return (
    <div>
      <h1 className="text-3xl font-bold underline text-red-600">
        Board - {boardID}
      </h1>
      <h3 className="font-bold">
        Currently connected users: {JSON.stringify(users)}
      </h3>
    </div>
  );
}

export default App;
