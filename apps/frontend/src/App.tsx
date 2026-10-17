import { Navigate, Route, Routes, useParams } from "react-router";
import "./App.css";
import { useEffect, useState } from "react";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Toaster } from "./components/ui/toast";
import { GuestRoute } from "./components/GuestRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Spinner } from "./components/ui/spinner";
import { authClient } from "./lib/auth-client";
import { MainLayout } from "./layout/MainLayout";
import { Organizations } from "./pages/Organization";
import { NotFound } from "./pages/NotFound";
import { Profile } from "./pages/Profile";

function App() {
  const { isPending } = authClient.useSession();

  if (isPending) {
    return <Spinner />;
  }

  return (
    <div className="w-full h-screen">
      <div className="w-full flex justify-center">
        <Toaster />
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/organizations" replace />} />

        {/* Only unauthenticated users */}
        <Route element={<GuestRoute />}>
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
        </Route>

        {/* Only authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/boards/:boardID" element={<Board />} />
          </Route>
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
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
