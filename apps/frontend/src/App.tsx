import { Route, Routes, useParams } from "react-router";
import "./App.css";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/boards/:boardID" element={<Board />} />
      </Routes>
    </div>
  );
}

function Board() {
  const { boardID } = useParams();
  return (
    <div>
      <h1 className="text-3xl font-bold underline text-red-600">
        Board - {boardID}
      </h1>
    </div>
  );
}

export default App;
