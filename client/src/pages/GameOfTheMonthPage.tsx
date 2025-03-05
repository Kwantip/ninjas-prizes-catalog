
import { useEffect, useState } from "react";

import { IP,  adminModeSetter } from "../App";

import "./GameOfTheMonthPage.css";

interface LeaderBoardItemProps {
    id: number;
    firstName: string;
    lastInitial: string;
    score: number;
    rank: number;
}
function LeaderBoardItem({ firstName, lastInitial, score, rank }: LeaderBoardItemProps) {
    return (
        <div className="leaderboard-item">
            <p>{`${rank + 1}. ${firstName} ${lastInitial}.`}</p>
            <p>{score.toLocaleString()}</p>
        </div>
    );
}
interface LeaderBoardEditorProps {
    id: number;
    firstName: string;
    lastInitial: string;
    score: number;
    handleFieldChange: (id: number, field: string, value: any) => void;
    handleDelete: (id: number) => void;
}
function LeaderBoardEditor({ id, firstName, lastInitial, score, handleFieldChange, handleDelete }: LeaderBoardEditorProps) {
    return (
        <form className="leaderboard-editor">
            <input type="text" value={firstName} onChange={(e) => handleFieldChange(id, "firstName", e.target.value)} />
            <input type="text" value={lastInitial} onChange={(e) => handleFieldChange(id, "lastInitial", e.target.value)} />
            <input type="number" value={score} onChange={(e) => handleFieldChange(id, "score", e.target.value)} />
            <span className="material-symbols-outlined clickable" onClick={() => handleDelete(id)}>close</span>
        </form>
    )
}
interface PastGameItemProps {
    gameName: string;
    gameLink: string;
    number: number;
}
function PastGameItem({ gameName, gameLink, number }: PastGameItemProps) {
    return (
        <div className="past-game-item">
            <p>{`${number}. ${gameName}`}</p>
            <button onClick={() => {window.open(gameLink, "_blank")}}>Go to Game</button>
        </div>
    )
}

function GameOfTheMonthPage() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = months[new Date().getMonth()];

    const { isAdmin } = adminModeSetter();

    const [leaderboard, setLeaderboard] = useState<{ id: number; firstName: string; lastInitial: string; score: number}[]>([]);
    const [displayLeaderboard, setDisplayLeaderboard] = useState<{ id: number; firstName: string; lastInitial: string; score: number}[]>([]);
    const [editingLeaderboard, setEditingLeaderboard] = useState(false);
    let scoreIdCounter = Math.max(...leaderboard.map((item) => item.id), 0) + 1;
    // const [newScore, setNewScore] = useState({
    //     id: scoreIdCounter,
    //     firstName: "",
    //     lastInitial: "",
    //     score: 0
    // });
    const [copyMsg, setCopyMsg] = useState("Click to Copy");
    const [settingNewGame, setSettingNewGame] = useState(false);
    const [newGame, setNewGame] = useState({
        gameName: "",
        gameLink: ""
    });

    // Fetching the game of the month
    const [gameOfTheMonthData, setGameOfTheMonthData] = useState<{
        current: {
            gameName: string;
            gameLink: string;
            leaderBoard: { id: number; firstName: string; lastInitial: string; score: number }[];
        };
        past: {
            gameName: string;
            gameLink: string;
            leaderBoard: { firstName: string; lastInitial: string; score: number }[];
        }[];
    }>();
    useEffect(() => {
        fetch(`http://${IP}:5000/api/gameOfTheMonth`)
            .then((res) => res.json())
            .then((data) => {
                setGameOfTheMonthData(data);
                
                // Set full leaderboard for tracking
                setLeaderboard(data.current.leaderBoard);
    
                // Sort for display leaderboard
                const sortedLeaderboard = [...data.current.leaderBoard].sort((a, b) => b.score - a.score);

                if (sortedLeaderboard.length > 10) {
                    setDisplayLeaderboard(sortedLeaderboard.slice(0, 10));
                } else {
                    const placeholders = Array(10 - sortedLeaderboard.length).fill({
                        id: null,
                        firstName: null,
                        lastInitial: null,
                        score: 0
                    });
                    setDisplayLeaderboard([...sortedLeaderboard, ...placeholders])
                }
            })
            .catch((err) => console.error("Failed to fetch data: ", err));
    }, []);

    // GAME OF THE MONTH SECTION
    // Copy link to clipboard
    const copyLink = () => {
        gameOfTheMonthData && navigator.clipboard.writeText(gameOfTheMonthData?.current.gameLink);
        setCopyMsg("Copied!");
    }
    // Submit new game of the month
    const handleNewGameSubmit = () => {
        fetch(`http://${IP}:5000/api/setNewGame`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newGame)
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorDetails = await res.text();
                    console.error("Server response: ", errorDetails);
                    throw new Error("Failed to set new game");
                }
                // Re-fetch game of the month data
                return fetch(`http://${IP}:5000/api/gameOfTheMonth`)
                    .then((res) => res.json())
                    .then(setGameOfTheMonthData)
                    .catch((err) => console.error("Failed to data: ", err));
            })
            .then(() => {
                setSettingNewGame(false);
                setNewGame({
                    gameName: "",
                    gameLink: ""               
                });
            })
            .catch((err) => {
                console.error("Error details:", err);
            });
    }

    // LEADERBOARD SECTION
    // Submit new score to the leaderboard 
    // const handleNewScoreSubmit = () => {
    //     if (!newScore.firstName || !newScore.lastInitial || !newScore.score) {
    //         console.error("INVALID DATA!!");
    //         return;
    //     }
    //     console.log(`${newScore.firstName} ${newScore.lastInitial}: ${newScore.score}`);
    //     fetch(`http://${IP}:5000/api/leaderboardScore`, {
    //         method: "POST",
    //         headers: {"Content-Type": "application/json"},
    //         body: JSON.stringify(newScore),
    //     })
    //         .then(async (res) => {
    //             if (!res.ok) {
    //                 const errorDetails = await res.text();
    //                 console.error("Server response: ", errorDetails);
    //                 throw new Error("Failed to add new score");
    //             }
    //             // Re-fetch leaderboard data after successful score submission
    //             return fetch(`http://${IP}:5000/api/leaderboardScore`)
    //                 .then((res) => res.json())
    //                 .then(setLeaderboard)
    //                 .catch((err) => console.error("Failed to refresh leaderboard: ", err));
    //         })
    //         .then(() => {
    //             setEditingLeaderboard(false);
    //             setNewScore({
    //                 id: scoreIdCounter++,
    //                 firstName: "",
    //                 lastInitial: "",
    //                 score: 0
    //             });
    //         })
    //         .catch((err) => {
    //             console.error("Error details:", err);
    //         });
    // }
    // Handle editing score
    const handleScoreFieldChange = (id: number, field: string, value: any) => {
        setLeaderboard((prev) => prev.map((item) => item.id === id ? { ...item, [field]: value } : item));
        setDisplayLeaderboard((prev) => prev.map((item) => item.id === id ? { ...item, [field]: value } : item))
    }
    // Handle deleting existing score
    const handleScoreDelete = (id: number) => {
        setLeaderboard(leaderboard.filter((item) => item.id !== id));
        setDisplayLeaderboard(displayLeaderboard.filter((item) => item.id !== id));
    }
    // Handle adding new row to the leaderboard
    const handleAddNewScore = () => {
        console.log(`New ID: ${scoreIdCounter}`)
        setLeaderboard((prev) => {
            return [
                ...prev,
                {id: scoreIdCounter, firstName: "", lastInitial: "", score: 0}
            ];
        })
        setDisplayLeaderboard((prev) => {
            return [
                ...prev,
                {id: scoreIdCounter, firstName: "", lastInitial: "", score: 0}
            ];
        })
    }
    // Handle updating the leaderboard
    const handleUpdateLeaderboard = () => {
        // Validate the data
        leaderboard.forEach(element => {
            if (element.id === null || 
                !element.firstName || element.firstName === "" ||
                !element.lastInitial || element.lastInitial === "" ||
                element.score <= 0) {
                throw new Error("Invalid score!")
            }
        });
        fetch(`http://${IP}:5000/api/leaderboardScore`, {
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(leaderboard),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorDetails = await res.text();
                    console.error("Server response: ", errorDetails);
                    throw new Error("Failed to update leaderboard");                
                }
                setEditingLeaderboard(false);
                fetch(`http://${IP}:5000/api/gameOfTheMonth`)
                    .then((res) => res.json())
                    .then((data) => {                        
                        // Set full leaderboard for tracking
                        setLeaderboard(data.current.leaderBoard);
            
                        // Sort for the display leaderboard
                        const sortedLeaderboard = [...data.current.leaderBoard].sort((a, b) => b.score - a.score);

                        if (sortedLeaderboard.length > 10) {
                            setDisplayLeaderboard(sortedLeaderboard.slice(0, 10));
                        } else {
                            const placeholders = Array(10 - sortedLeaderboard.length).fill({
                                id: null,
                                firstName: null,
                                lastInitial: null,
                                score: 0
                            });
                            setDisplayLeaderboard([...sortedLeaderboard, ...placeholders])
                        }
                    })
                    .catch((err) => console.error("Failed to fetch data: ", err));

                    })
            .catch((err) => {
                console.error("Error details: ", err);
            })
    }

    return (
        <main className="game-of-the-month-page">
            {gameOfTheMonthData && (
                <>
                    <div className="game-of-the-month-container">
                        <h2>Game of the Month</h2>
                        <div className="game-of-the-month-block container">
                            <p>The game of the month for {currentMonth} is</p>
                            <h3>{gameOfTheMonthData.current.gameName}</h3>
                            {isAdmin ? (
                                settingNewGame ? (
                                    <>
                                        <h3>Set New Game</h3>
                                        <form>
                                            <label>Game Name
                                                <input value={newGame.gameName} onChange={(e) => setNewGame((prev) => ({ ...prev, ["gameName"]: e.target.value }))}/>
                                            </label>
                                            <label>Link to Game
                                                <input value={newGame.gameLink} onChange={(e) => setNewGame((prev) => ({ ...prev, ["gameLink"]: e.target.value }))} type="url" />
                                            </label>
                                        </form>
                                        <br></br>
                                        <button onClick={handleNewGameSubmit}>Submit</button>
                                    </>
                                ) : (
                                    <button onClick={() => setSettingNewGame(true)}>Set New Game</button>
                                )
                            ): (
                                <>
                                    <p>Go to <strong onClick={copyLink} onMouseLeave={() => setCopyMsg("Click to Copy")} id="link" className="clickable">{gameOfTheMonthData.current.gameLink}<span id="tooltip">{copyMsg}</span></strong> or</p>
                                    <button onClick={() => {window.open(gameOfTheMonthData.current.gameLink, "_blank")}}>Click Here</button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="leaderboard-container">
                        <h2>Leader Board</h2>
                        <div className="leaderboard-block container">
                            {editingLeaderboard ? (
                                <>
                                    {displayLeaderboard.map((item) => (
                                        item.id !== null && <LeaderBoardEditor key={item.id} {...item} handleFieldChange={handleScoreFieldChange} handleDelete={handleScoreDelete}/>
                                    ))}
                                    <br></br>
                                    <p className="add-new-btn" onClick={handleAddNewScore}>+</p>
                                    <button onClick={handleUpdateLeaderboard}>Update</button>
                                </>
                                ) : (
                                displayLeaderboard.map((item, index) => (
                                    item.id !== null && <LeaderBoardItem key={item.id} {...item} rank={index} />
                                ))
                            )}
                            {isAdmin && !editingLeaderboard && <button onClick={() => setEditingLeaderboard(true)}>Edit</button>}
                            {/* {isAdmin && (editingLeaderboard ? (
                                <>
                                    <br></br>
                                    <h3>Add New Score</h3>
                                    <form className="leaderboard-add-new-score">
                                        <label>First Name
                                            <input value={newScore.firstName} onChange={(e) => setNewScore((prev) => ({ ...prev, ["firstName"]: e.target.value }))} />
                                        </label>
                                        <label>Last Initial
                                            <input value={newScore.lastInitial} onChange={(e) => setNewScore((prev) => ({ ...prev, ["lastInitial"]: e.target.value }))} />
                                        </label>
                                        <label>Score
                                            <input value={newScore.score} onChange={(e) => setNewScore((prev) => ({ ...prev, ["score"]: +e.target.value }))} type="Number" />
                                        </label>
                                    </form>
                                    <br></br>
                                    <button onClick={handleNewScoreSubmit}>Submit</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setEditingLeaderboard(true)}>Edit</button>
                                </>
                            ))} */}
                        </div>
                    </div>
                    <div className="past-games-container">
                        <h2>Past Games</h2>
                        <div className="past-games-block container">
                                {gameOfTheMonthData.past.map((item, index) => (
                                    <PastGameItem key={index + 1} {...item} number={index + 1}/>
                                ))}
                        </div>
                    </div>
                </>
            )}
        </main>
    )
}

export default GameOfTheMonthPage;