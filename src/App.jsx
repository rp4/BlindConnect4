import React, { useState, useEffect } from "react";
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
    const [moveHistory, setMoveHistory] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);

    // Sound effects
    useEffect(() => {
        // This would be where we'd initialize sound effects if we had them
    }, []);

    const handleMove = (column) => {
        if (gameOver) return;

        const newState = state.map((row) => [...row]);
        let validMove = false;
        let rowPlaced = -1;

        for (let row = 5; row >= 0; row--) {
            if (newState[row][column] === 0) {
                newState[row][column] = player;
                validMove = true;
                rowPlaced = row;
                
                // Add to move history
                setMoveHistory([
                    ...moveHistory,
                    {
                        player,
                        column: column + 1,
                        row: 6 - row,
                    },
                ]);
                
                if (!gameStarted) {
                    setGameStarted(true);
                }
                
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
            setMessage("Column is full. Please pick a different column.");
        } else {
            setMessage("");
        }
    };

    const handleNewGame = () => {
        setState(initializeBoard());
        setPlayer(1);
        setMessage("");
        setShowBoard(false); // Hide board when starting a new game
        setGameOver(false);
        setMoveHistory([]);
        setGameStarted(false);
    };

    const handleToggleBoard = () => {
        setShowBoard(!showBoard);
    };

    return (
        <div className="app">
            <h1>Blind Connect 4</h1>
            
            <div className="game-info">
                {!gameStarted && !gameOver && (
                    <div className="instructions">
                        <p>Play Connect 4 without seeing the board!</p>
                        <p>Select a column (1-7) to drop your piece.</p>
                    </div>
                )}
                
                {!gameOver && gameStarted && (
                    <div className="turn">
                        Player <span className={`player${player}-text`}>{player}</span>'s turn
                    </div>
                )}
                
                {message && <div className="message">{message}</div>}
            </div>
            
            <div className="button-group">
                <button onClick={handleNewGame}>New Game</button>
                <button onClick={handleToggleBoard}>
                    {showBoard ? "Hide Board" : "Show Board"}
                </button>
            </div>
            
            {!gameOver && (
                <div className="game-controls">
                    <div className="columns">
                        {[...Array(7)].map((_, index) => (
                            <button 
                                key={index} 
                                onClick={() => handleMove(index)}
                                aria-label={`Drop piece in column ${index + 1}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {showBoard && (
                <div className="board-container">
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
                    
                    <div className="column-labels">
                        {[...Array(7)].map((_, index) => (
                            <div key={index} className="column-label">
                                {index + 1}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {moveHistory.length > 0 && (
                <div className="last-move">
                    <h3>Last Move</h3>
                    <div className="move-item">
                        <span className={`player${moveHistory[moveHistory.length-1].player}-text`}>
                            {moveHistory[moveHistory.length-1].player}
                        </span>
                        <span>Column {moveHistory[moveHistory.length-1].column}</span>
                    </div>
                </div>
            )}
            
            <footer>
                <p><a href="https://dadyears.fun" target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'none', fontSize: '0.8rem' }}>@DadYears</a></p>
            </footer>
        </div>
    );
};

export default App;
