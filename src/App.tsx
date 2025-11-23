import { Routes, Route } from "react-router-dom";
import TetrisGame from "./TetrisGame";

export default function App() {
  return (
    <Routes>
      {/* main game at /tetris/ */}
      <Route path="/" element={<TetrisGame />} />
      {/* example extra route if you want one later */}
      {/* <Route path="/about" element={<div>About this Tetris clone</div>} /> */}
    </Routes>
  );
}
