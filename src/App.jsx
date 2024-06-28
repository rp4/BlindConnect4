import React, { useState } from "react";
import "./App.css";

const initializeBoard = () => {
    return Array(6)
        .fill(null)
        .map(() => Array(7).fill(0));
};

const checkWinner = (state, player) => {
    const directions = [
        { x: 1, y: 0 }, // Horizontal
        { x: 0, y: 1 }, // Vertical
        { x: 1, y: 1 }, // Diagonal down-right
        { x: 1, y: -1 }, // Diagonal down-left
    ];

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            if (state[row][col] !== player) continue;

            for (let { x, y } of directions) {
                let count = 0;
                let r = row,
                    c = col;
                while (
                    r >= 0 &&
                    r < 6 &&
                    c >= 0 &&
                    c < 7 &&
                    state[r] &&
                    state[r][c] === player
                ) {
                    count++;
                    if (count === 4) return true;
                    r += y;
                    c += x;
                }
            }
        }
    }
    return false;
};

const isBoardFull = (state) => {
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            if (state[row][col] === 0) {
                return false;
            }
        }
    }
    return true;
};

const App = () => {
    const [state, setState] = useState(initializeBoard());
    const [player, setPlayer] = useState(1);
    const [message, setMessage] = useState("");
    const [showBoard, setShowBoard] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const handleMove = (column) => {
        if (gameOver) return;

        console.log(
            `Player ${player} is attempting to move in column ${column + 1}`,
        );
        const newState = state.map((row) => [...row]);
        let validMove = false;

        for (let row = 5; row >= 0; row--) {
            console.log(`Checking row ${row} for column ${column}`);
            if (newState[row][column] === 0) {
                console.log(`Found empty spot at row ${row}, column ${column}`);
                newState[row][column] = player;
                validMove = true;
                if (checkWinner(newState, player)) {
                    setState(newState);
                    setMessage(`Player ${player} wins!`);
                    setGameOver(true);
                    setShowBoard(true); // Show board when game is won
                    return;
                }
                if (isBoardFull(newState)) {
                    setState(newState);
                    setMessage("Tie Game");
                    setGameOver(true);
                    setShowBoard(true); // Show board when game is tied
                    return;
                }
                setState(newState);
                setPlayer(player === 1 ? 2 : 1);
                break;
            }
        }

        if (!validMove) {
            console.log(`Column ${column + 1} is full.`);
            setMessage("Column is full. Please pick a different column.");
        } else {
            setMessage("");
        }
    };

    const handleNewGame = () => {
        console.log("Starting a new game");
        setState(initializeBoard());
        setPlayer(1);
        setMessage("");
        setShowBoard(false); // Hide board when starting a new game
        setGameOver(false);
    };

    const handleToggleBoard = () => {
        setShowBoard(!showBoard);
    };

    return (
        <div className="app">
            <h1>Blind Connect Four</h1>
            <div className="button-group">
                <button onClick={handleNewGame}>New Game</button>
                <button onClick={handleToggleBoard}>
                    {showBoard ? "Hide Board" : "Show Board"}
                </button>
            </div>
            {!gameOver && (
                <div className="columns">
                    {[...Array(7)].map((_, index) => (
                        <button key={index} onClick={() => handleMove(index)}>
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
            {message && <div className="message">{message}</div>}
            {!gameOver && <div className="turn">Player {player}'s turn</div>}
            {showBoard && (
                <div className="board">
                    {state.map((row, rowIndex) => (
                        <React.Fragment key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`cell player${cell}`}
                                    style={{
                                        gridRow: rowIndex + 1,
                                        gridColumn: colIndex + 1,
                                    }}
                                >
                                    <div className="circle">
                                        {cell !== 0 ? cell : ""}
                                    </div>
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default App;
