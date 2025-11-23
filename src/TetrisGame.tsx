import React, { useState, useEffect, useMemo } from "react";
import "./Tetris.css";

const ROWS = 20;
const COLS = 10;

type ShapeMatrix = number[][];
type TetrominoKey = "I" | "J" | "L" | "O" | "S" | "T" | "Z";
type Cell = 0 | TetrominoKey;

interface TetrominoDef {
  shape: ShapeMatrix;
}

interface Position {
  x: number;
  y: number;
}

interface ActivePiece {
  type: TetrominoKey;
  shape: ShapeMatrix;
  pos: Position;
}

const TETROMINOES: Record<TetrominoKey, TetrominoDef> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
  },
};

const TETROMINO_KEYS = Object.keys(TETROMINOES) as TetrominoKey[];

function createEmptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(0));
}

function rotateMatrix(matrix: ShapeMatrix): ShapeMatrix {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result: ShapeMatrix = Array.from({ length: cols }, () =>
    Array(rows).fill(0)
  );

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      result[x][rows - 1 - y] = matrix[y][x];
    }
  }
  return result;
}

function checkCollision(
  shape: ShapeMatrix,
  pos: Position,
  board: Cell[][]
): boolean {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (!shape[y][x]) continue;

      const boardX = pos.x + x;
      const boardY = pos.y + y;

      if (boardX < 0 || boardX >= COLS) return true;
      if (boardY >= ROWS) return true;
      if (boardY < 0) continue;

      if (board[boardY][boardX] !== 0) return true;
    }
  }
  return false;
}

function mergePieceToBoard(
  shape: ShapeMatrix,
  pos: Position,
  board: Cell[][],
  type: TetrominoKey
): Cell[][] {
  const newBoard: Cell[][] = board.map((row) => row.slice());
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (!shape[y][x]) continue;

      const boardX = pos.x + x;
      const boardY = pos.y + y;

      if (
        boardY >= 0 &&
        boardY < ROWS &&
        boardX >= 0 &&
        boardX < COLS
      ) {
        newBoard[boardY][boardX] = type;
      }
    }
  }
  return newBoard;
}

function clearLines(board: Cell[][]): { board: Cell[][]; cleared: number } {
  const newBoard: Cell[][] = [];
  let cleared = 0;

  for (let y = 0; y < ROWS; y++) {
    if (board[y].every((cell) => cell !== 0)) {
      cleared++;
    } else {
      newBoard.push(board[y]);
    }
  }

  while (newBoard.length < ROWS) {
    newBoard.unshift(Array<Cell>(COLS).fill(0));
  }

  return { board: newBoard, cleared };
}

function randomTetromino(): ActivePiece {
  const key =
    TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)];
  const shape = TETROMINOES[key].shape.map((row) => row.slice());
  const startX = Math.floor(COLS / 2) - Math.ceil(shape[0].length / 2);

  return {
    type: key,
    shape,
    pos: { x: startX, y: -1 },
  };
}

function getCellColor(cell: Cell): string {
  switch (cell) {
    case "I":
      return "#22d3ee";
    case "J":
      return "#3b82f6";
    case "L":
      return "#f97316";
    case "O":
      return "#eab308";
    case "S":
      return "#22c55e";
    case "T":
      return "#a855f7";
    case "Z":
      return "#ef4444";
    case 0:
    default:
      return "#111827";
  }
}

const TetrisGame: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>(() => createEmptyBoard());
  const [current, setCurrent] = useState<ActivePiece | null>(null);
  const [nextPiece, setNextPiece] = useState<ActivePiece>(() =>
    randomTetromino()
  );
  const [score, setScore] = useState<number>(0);
  const [lines, setLines] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [dropTime, setDropTime] = useState<number>(800);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Load high score from localStorage on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("tetrisHighScore");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!Number.isNaN(parsed)) setHighScore(parsed);
      }
    } catch {
      // ignore if localStorage not available
    }
  }, []);

  // Persist high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      try {
        window.localStorage.setItem("tetrisHighScore", score.toString());
      } catch {
        // ignore
      }
    }
  }, [score, highScore]);

  const spawnPiece = () => {
    const newPiece = nextPiece;
    const freshNext = randomTetromino();

    if (checkCollision(newPiece.shape, newPiece.pos, board)) {
      setIsRunning(false);
      setGameOver(true);
      return;
    }

    setCurrent(newPiece);
    setNextPiece(freshNext);
  };

  const startGame = () => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLines(0);
    setGameOver(false);
    setIsRunning(true);
    setHasStarted(true);
    const first = randomTetromino();
    const second = randomTetromino();
    setCurrent(first);
    setNextPiece(second);
    setDropTime(800);
  };

  const movePiece = (dx: number) => {
    if (!current || !isRunning) return;
    const newPos: Position = { ...current.pos, x: current.pos.x + dx };
    if (!checkCollision(current.shape, newPos, board)) {
      setCurrent({ ...current, pos: newPos });
    }
  };

  const softDrop = () => {
    if (!current || !isRunning) return;
    const newPos: Position = { ...current.pos, y: current.pos.y + 1 };

    if (!checkCollision(current.shape, newPos, board)) {
      setCurrent({ ...current, pos: newPos });
      setScore((s) => s + 1);
    } else {
      const merged = mergePieceToBoard(
        current.shape,
        current.pos,
        board,
        current.type
      );
      const { board: clearedBoard, cleared } = clearLines(merged);

      if (cleared > 0) {
        setScore((s) => s + cleared * 100);
        setLines((l) => l + cleared);
        setDropTime((t) => Math.max(150, t - cleared * 10));
      }

      setBoard(clearedBoard);
      spawnPiece();
    }
  };

  const hardDrop = () => {
    if (!current || !isRunning) return;

    let dropPos: Position = { ...current.pos };
    while (
      !checkCollision(
        current.shape,
        { ...dropPos, y: dropPos.y + 1 },
        board
      )
    ) {
      dropPos = { ...dropPos, y: dropPos.y + 1 };
      setScore((s) => s + 2);
    }

    const merged = mergePieceToBoard(
      current.shape,
      dropPos,
      board,
      current.type
    );
    const { board: clearedBoard, cleared } = clearLines(merged);
    if (cleared > 0) {
      setScore((s) => s + cleared * 100);
      setLines((l) => l + cleared);
      setDropTime((t) => Math.max(150, t - cleared * 10));
    }
    setBoard(clearedBoard);
    spawnPiece();
  };

  const rotatePiece = () => {
    if (!current || !isRunning) return;
    const rotated = rotateMatrix(current.shape);

    const kicks = [0, -1, 1, -2, 2];
    for (let i = 0; i < kicks.length; i++) {
      const newPos: Position = {
        x: current.pos.x + kicks[i],
        y: current.pos.y,
      };
      if (!checkCollision(rotated, newPos, board)) {
        setCurrent({ ...current, shape: rotated, pos: newPos });
        return;
      }
    }
  };

  // Auto fall
  useEffect(() => {
    if (!isRunning || !current || gameOver) return;

    const intervalId = window.setInterval(() => {
      softDrop();
    }, dropTime);

    return () => window.clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, current, dropTime, gameOver, board]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isRunning) {
        startGame();
        return;
      }

      if (!isRunning || !current || gameOver) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          movePiece(-1);
          break;
        case "ArrowRight":
          e.preventDefault();
          movePiece(1);
          break;
        case "ArrowDown":
          e.preventDefault();
          softDrop();
          break;
        case "ArrowUp":
        case "x":
        case "X":
          e.preventDefault();
          rotatePiece();
          break;
        case " ":
          e.preventDefault();
          hardDrop();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, current, gameOver, board]);

  // Ghost piece coordinates
  const ghostCoords = useMemo(() => {
    const coords = new Set<string>();
    if (!current) return coords;

    let dropPos: Position = { ...current.pos };
    while (
      !checkCollision(
        current.shape,
        { ...dropPos, y: dropPos.y + 1 },
        board
      )
    ) {
      dropPos = { ...dropPos, y: dropPos.y + 1 };
    }

    const { shape } = current;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (!shape[y][x]) continue;
        const boardX = dropPos.x + x;
        const boardY = dropPos.y + y;
        if (
          boardY >= 0 &&
          boardY < ROWS &&
          boardX >= 0 &&
          boardX < COLS
        ) {
          coords.add(`${boardY},${boardX}`);
        }
      }
    }

    return coords;
  }, [current, board]);

  // Board with current piece overlaid
  const displayBoard: Cell[][] = useMemo(() => {
    const copy: Cell[][] = board.map((row) => row.slice());
    if (current) {
      const { shape, pos, type } = current;
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (!shape[y][x]) continue;
          const boardX = pos.x + x;
          const boardY = pos.y + y;
          if (
            boardY >= 0 &&
            boardY < ROWS &&
            boardX >= 0 &&
            boardX < COLS
          ) {
            copy[boardY][boardX] = type;
          }
        }
      }
    }
    return copy;
  }, [board, current]);

  const showStartOverlay = !hasStarted && !isRunning && !gameOver;

  return (
    <div className="tetris-root">
      <div className="tetris-container">
        <div className="tetris-header">
          <h1 className="tetris-title">React Tetris</h1>
          <div className="tetris-stats">
            <div>Score: {score}</div>
            <div>Lines: {lines}</div>
            <div>High: {highScore}</div>
          </div>
        </div>

        <div className="tetris-main">
          <div className="tetris-board">
            {displayBoard.map((row, y) => (
              <div className="tetris-row" key={y}>
                {row.map((cell, x) => {
                  const key = `${y},${x}`;
                  const isGhost =
                    ghostCoords.has(key) && cell === 0 && current;
                  const backgroundColor = isGhost
                    ? "rgba(148, 163, 184, 0.18)"
                    : getCellColor(cell);
                  return (
                    <div
                      key={x}
                      className={`tetris-cell ${
                        isGhost ? "ghost-cell" : ""
                      }`}
                      style={{ backgroundColor }}
                    />
                  );
                })}
              </div>
            ))}

            {/* Start overlay */}
            {showStartOverlay && (
              <div className="tetris-start-overlay">
                <div className="start-card">
                  <div className="start-title">React Tetris</div>
                  <div className="start-subtitle">Nintendo-style clone</div>
                  <div className="start-instructions">
                    <p>Press <span>Enter</span> to start</p>
                    <p>or click the button below.</p>
                    <ul>
                      <li>← → : Move</li>
                      <li>↑ / X : Rotate</li>
                      <li>↓ : Soft drop</li>
                      <li>Space : Hard drop</li>
                    </ul>
                  </div>
                  <button
                    className="tetris-button start-button"
                    onClick={startGame}
                  >
                    Start Game
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="tetris-sidebar">
            <div className="sidebar-section">
              <h2>Next</h2>
              <div className="next-preview">
                {nextPiece &&
                  nextPiece.shape.map((row, y) => (
                    <div className="tetris-row" key={y}>
                      {row.map((v, x) => (
                        <div
                          key={x}
                          className="tetris-cell next-cell"
                          style={{
                            backgroundColor: v
                              ? getCellColor(nextPiece.type)
                              : "#020617",
                          }}
                        />
                      ))}
                    </div>
                  ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h2>Controls</h2>
              <ul className="controls-list">
                <li>← → : Move</li>
                <li>↑ / X : Rotate</li>
                <li>↓ : Soft drop</li>
                <li>Space : Hard drop</li>
                <li>Enter : Start / restart</li>
              </ul>
            </div>

            <div className="sidebar-section">
              {!isRunning && !gameOver && hasStarted && (
                <button className="tetris-button" onClick={startGame}>
                  Start Game
                </button>
              )}
              {gameOver && (
                <>
                  <div className="game-over">Game Over</div>
                  <button className="tetris-button" onClick={startGame}>
                    Play Again
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;
