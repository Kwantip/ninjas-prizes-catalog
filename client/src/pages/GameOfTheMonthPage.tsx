
import { useEffect, useState } from "react";

import { IP,  adminModeSetter } from "../App";

import "./GameOfTheMonthPage.css";

interface LeaderBoardItemProps {
    firstName: string;
    lastInitial: string;
    score: number;
    rank: number;
}
function LeaderBoardItem({ firstName, lastInitial, score, rank }: LeaderBoardItemProps) {
    return (
        <div className="leader-board-item">
            <p>{`${rank + 1}. ${firstName} ${lastInitial}.`}</p>
            <p>{score.toLocaleString()}</p>
        </div>
    );
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
    const [gameOfTheMonthData, setGameOfTheMonthData] = useState<{
        current: {
            gameName: string;
            gameLink: string;
            leaderBoard: { firstName: string; lastInitial: string; score: number }[];
        };
        past: {
            gameName: string;
            gameLink: string;
            leaderBoard: { firstName: string; lastInitial: string; score: number }[];
        }[];
    }>();
    
    const [copyMsg, setCopyMsg] = useState("Click to Copy");
    const [addingNewScore, setAddingNewScore] = useState(false);
    const [newScore, setNewScore] = useState({
        firstName: "",
        lastInitial: "",
        score: 0
    });
    const [settingNewGame, setSettingNewGame] = useState(false);
    const [newGame, setNewGame] = useState({
        gameName: "",
        gameLink: ""
    })
    let col1 = [];
    let col2 = [];

    const copyLink = () => {
        gameOfTheMonthData && navigator.clipboard.writeText(gameOfTheMonthData?.current.gameLink);
        setCopyMsg("Copied!");
    }
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
    const handleNewScoreSubmit = () => {
        if (!newScore.firstName || !newScore.lastInitial || !newScore.score) {
            console.error("INVALID DATA!!");
            return;
        }
        console.log(`${newScore.firstName} ${newScore.lastInitial}: ${newScore.score}`);
        fetch(`http://${IP}:5000/api/newScore`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newScore),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorDetails = await res.text();
                    console.error("Server response: ", errorDetails);
                    throw new Error("Failed to add new score");
                }
                // Re-fetch leaderboard data after successful score submission
                return fetch(`http://${IP}:5000/api/gameOfTheMonth`)
                    .then((res) => res.json())
                    .then(setGameOfTheMonthData)
                    .catch((err) => console.error("Failed to refresh leaderboard: ", err));
            })
            .then(() => {
                setAddingNewScore(false);
                setNewScore({
                    firstName: "",
                    lastInitial: "",
                    score: 0
                });
            })
            .catch((err) => {
                console.error("Error details:", err);
            });
    }

    useEffect(() => {
        fetch(`http://${IP}:5000/api/gameOfTheMonth`)
            .then((res) => res.json())
            .then(setGameOfTheMonthData)
            .catch((err) => console.error("Failed to fetch data: ", err));
    }, []);

    console.log("LEADER: ", gameOfTheMonthData?.current.leaderBoard)

    if (gameOfTheMonthData) {
        for (let i = 0; i < 10; i++) {
            if (i < 5) {
                col1.push(gameOfTheMonthData.current.leaderBoard[i]);
            } else {
                col2.push(gameOfTheMonthData.current.leaderBoard[i]);
            }
        }
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
                    <div className="leader-board-container">
                        <h2>Leader Board</h2>
                        <div className="leader-board-block container">
                                    {gameOfTheMonthData.current.leaderBoard.map((item, index) => (
                                        <LeaderBoardItem key={index} {...item} rank={index} />
                                    ))}
                            {isAdmin && (addingNewScore ? (
                                <>
                                    <br></br>
                                    <h3>Add New Score</h3>
                                    <form>
                                        <label>First Name
                                            <input value={newScore.firstName} onChange={(e) => setNewScore((prev) => ({ ...prev, ["firstName"]: e.target.value }))} />
                                        </label>
                                        <label>Last Initial
                                            <input value={newScore.lastInitial} onChange={(e) => setNewScore((prev) => ({ ...prev, ["lastInitial"]: e.target.value }))} maxLength={2} />
                                        </label>
                                        <label>Score
                                            <input value={newScore.score} onChange={(e) => setNewScore((prev) => ({ ...prev, ["score"]: +e.target.value }))} type="Number" />
                                        </label>
                                    </form>
                                    <br></br>
                                    <button onClick={handleNewScoreSubmit}>Submit</button>
                                </>
                            ) : (
                                <button onClick={() => setAddingNewScore(true)}>Add New</button>
                            ))}
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