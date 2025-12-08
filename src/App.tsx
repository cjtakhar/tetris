import { Routes, Route } from "react-router-dom";
import TetrisGame from "./TetrisGame";

export default function App() {
  return (
    <Routes>
      <Route path="/tetris" element={<TetrisGame />} />
    </Routes>
  );
}
