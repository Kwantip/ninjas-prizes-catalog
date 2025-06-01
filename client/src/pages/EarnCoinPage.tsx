import { useState, useEffect } from "react";

import { adminModeSetter } from "../App";
import CoinCard from "../components/CoinCard";
import EarnLoseCoinsEditor from "../components/EarnLoseCoinsEditor";

import "./EarnCoinPage.css";

import { IP } from "../App";

function EarnCoinPage() {
    const { isAdmin } = adminModeSetter();
    const [isEditingEarnCoins, setEditingEarnCoins] = useState(false);
    const [isEditingLoseCoins, setEditingLoseCoins] = useState(false);
    const [earnCoinsRows, setEarnCoinsRows] = useState<{ id: number; action: string; price: number; unit: string; multipliable: boolean; }[]>([]);
    const [loseCoinsRows, setLoseCoinsRows] = useState<{ id: number; action: string; price: number; unit: string; multipliable: null}[]>([]);
    const [earnCoinsErrorMessage, setEarnCoinsErrorMessage] = useState("");
    const [loseCoinsErrorMessage, setLoseCoinsErrorMessage] = useState("");
    const [calcCoin, setCalcCoin] = useState("Enter the fields above");
    const [calcField, setCalcField] = useState({ multiplier: "", actionId: 0 });
    const [uploadingAnnouncement, setUploadingAnnouncement] = useState(false);
    const [announcementData, setAnnouncementData] = useState<{
        visible: boolean;
        imagePath: string;
    }>();
    const [announcementMsg, setAnnouncementMsg] = useState("");

    // console.log(IP)
    useEffect(() => {
        fetch(`http://${IP}:5000/api/earnLoseCoins`)
            .then((res) => res.json())
            .then((data) => {
                setEarnCoinsRows(data.earnCoins);
                setLoseCoinsRows(data.loseCoins);
                setAnnouncementData(data.announcement);
            })
            .catch((err) => console.error("Failed to fetch data:", err));

    }, []);

    let earnCoinsIdCounter = Math.max(...earnCoinsRows.map((row) => row.id), 0) + 1;
    let loseCoinsIdCounter = Math.max(...loseCoinsRows.map((row) => row.id), 0) + 1;
    
    const handleCalc = () => {
        const action = earnCoinsRows.find((item) => item.id === calcField.actionId);
        let multiplier = 0;

        switch (calcField.multiplier) {
            case "white":
                multiplier = 1;
                break;
            case "yellow":
            case "orange":
                multiplier = 2;
                break;
            case "green":
            case "blue":
                multiplier = 3;
                break;
            case "purple":
            case "brown":
                multiplier = 4;
                break;
            case "red":
            case "black":
                multiplier = 5;
                break;
            default:
                multiplier = 0;
                break;
        }

        if (action) {
            const calculatedCoin = action.multipliable
                ? `${action.price * multiplier} ${action.unit}s`
                : `${action.price} ${action.unit}s`;
            setCalcCoin(calculatedCoin);
        } else {
            console.error("That action don't exist womp womp");
        }
    };
    const handleCalcFieldChange = (field: string, value: number | string) => {
        setCalcField((prev) => ({ ...prev, [field]: value }));
        setCalcCoin("Enter the fields above");
    };
    const handleUpdateRow = (id: number, field: string, value: any, type: "earnCoins" | "loseCoins") => {
        if (type === "earnCoins") {
            setEarnCoinsRows((prevRows) =>
                prevRows.map((row) =>
                    row.id === id ? { ...row, [field]: value } : row
            ));
            setEarnCoinsErrorMessage("");
        } else if (type === "loseCoins") {
            setLoseCoinsRows((prevRows) =>
                prevRows.map((row) =>
                    row.id === id ? { ...row, [field]: value } : row
            ));
            setLoseCoinsErrorMessage("");
        }
    };    
    const handleDelete = (id: number, type: "earnCoins" | "loseCoins") => {
        if (type === "earnCoins") {
            setEarnCoinsRows((prevRows) => prevRows.filter((row) => row.id !== id));
            setEarnCoinsErrorMessage("");
        } else if (type === "loseCoins") {
            setLoseCoinsRows((prevRows) => prevRows.filter((row) => row.id !== id));
            setLoseCoinsErrorMessage("");
        }
    };
    const handleAddRow = (type: "earnCoins" | "loseCoins") => {
        console.log(earnCoinsIdCounter)
        if (type === "earnCoins") {
            setEarnCoinsRows((prevRows) => {
                return [
                    ...prevRows,
                    { id: earnCoinsIdCounter, action: "", price: 0, unit: "Silver", multipliable: true },
                ];
            });
        } else if (type === "loseCoins") {
            setLoseCoinsRows((prevRows) => {
                return [
                    ...prevRows,
                    { id: loseCoinsIdCounter, action: "", price: 0, unit: "Silver", multipliable: null },
                ];
            });
        }
    };
    
    const handleSubmit = (type: "earnCoins" | "loseCoins") => {
        const rows = type === "earnCoins" ? earnCoinsRows : loseCoinsRows;
        const setErrorMessage = type === "earnCoins" ? setEarnCoinsErrorMessage : setLoseCoinsErrorMessage;
        const setEditing = type === "earnCoins" ? setEditingEarnCoins : setEditingLoseCoins;
    
        try {
            // Validate the rows
            const parsedData = rows.map(({ id, action, price, unit, multipliable }) => {
                if (!action?.trim() || price <= 0 || !unit?.trim()) {
                    setErrorMessage("Invalid format. Each row must have 'action', 'price', and 'unit'.");
                    throw new Error("Validation failed");
                }
                return { id, action: action.trim(), price: Number(price), unit: unit.trim(), multipliable: multipliable };
            });
    
            console.log("Submitting data:", JSON.stringify(parsedData));

            // Send the data to the server
            fetch(`http://${IP}:5000/api/${type}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsedData),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        const errorDetails = await res.text();
                        console.error("Server response error:", errorDetails);
                        throw new Error(`Failed to update ${type}`);
                    }
                    console.log(`${type} data updated successfully!`, parsedData);
                    setEditing(false);
                })
                .catch((err) => {
                    setErrorMessage(`Failed to update ${type}!`);
                    console.error("Fetch error:", err);
                });
        } catch (error) {
            console.error("Validation or fetch setup error:", error);
        }
    };

    const uploadAnnouncementImage = () => {
        const imageInput = document.getElementById("announcementImage") as HTMLInputElement | null;
        const imageFile = imageInput?.files?.[0];

        if (!imageFile) {
            setAnnouncementMsg("Please select an image to upload.");
            return;
        }
      
        const formData = new FormData();
        formData.append("image", imageFile);
      
        fetch(`http://${IP}:5000/api/newAnnouncement`, {
            method: "POST",
            body: formData,
        })
            .then(async (res) => {
                if (!res.ok) {
                    setAnnouncementMsg("Error uploading image.");
                }
                setAnnouncementMsg("Image uploaded successfully!");
                setUploadingAnnouncement(false);
                location.reload();
            })
            .catch((error) => {
                console.error("Error:", error);
                setAnnouncementMsg("Failed to upload image.");
            });
      };
      
    const handleAnnouncementVisibility = () => {
        fetch(`http://${IP}:5000/api/announcementVisibility`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({visible: !announcementData?.visible})
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorDetails = await res.text();
                    console.error("Server response error:", errorDetails);
                    throw new Error("Failed to update announcement visibility");
                }
                fetch(`http://${IP}:5000/api/earnLoseCoins`)
                    .then((res) => res.json())
                    .then((data) => {
                        setAnnouncementData(data.announcement);
                    })
                    .catch((err) => console.error("Failed to fetch data:", err));
                    })
    };
    
    return (
        <main className="earn-coins-page">
            <div className="gradient"></div>
            <div className="announcement-container">
                {isAdmin ? (
                    <>
                        <h2>Announcement</h2>
                        <div className="manage-announcement-block container">
                            {uploadingAnnouncement ? (
                                <>
                                    <label>Upload New Announcement
                                        <input type="file" id="announcementImage" />
                                    </label>
                                    <button onClick={uploadAnnouncementImage}>Upload</button>
                                </>
                            ) : (
                                <button onClick={() => setUploadingAnnouncement(true)}>Upload New Announcement</button>
                            )}
                            <span className="material-symbols-outlined clickable" onClick={handleAnnouncementVisibility}>
                                {announcementData?.visible ? (<>visibility</>) : (<>visibility_off</>)}
                            </span>
                            <p>{announcementMsg}</p>
                        </div>
                    </>
                ) : (
                    <>
                        {announcementData?.visible &&
                            <>
                                <h2>Announcement</h2>
                                <img className="announcement-banner" src={`http://${IP}:5000/server/announcement/${announcementData.imagePath}`}/>
                            </>
                        }
                    </>
                )}
            </div>
            <div className="earn-lose-coins-blocks-container">
                <div>
                    <h2>How to Earn Coins</h2>
                    {isEditingEarnCoins && isAdmin ? (
                        <div className="container">
                            <div className="earn-coins-labels-area">
                                <h4>Action</h4>
                                <h4>Price</h4>
                                <h4>Unit</h4>
                                <h4>Mult.</h4>
                                <h4>X</h4>
                            </div>
                            <div className="edit-area">
                                {earnCoinsRows.map((row) => (
                                    <EarnLoseCoinsEditor key={row.id} {...row} type="earnCoins" handleDelete={handleDelete} handleUpdateRow={handleUpdateRow} />
                                ))}
                            </div>
                            <p className="add-new-btn" onClick={() => handleAddRow("earnCoins")}>+</p>
                            <p className="submit-error-msg">{earnCoinsErrorMessage}</p>
                            <button onClick={() => handleSubmit("earnCoins")} className="edit-submit-btn">Submit</button>
                        </div>
                    ) : (
                        <div className="container">
                            {isAdmin && (
                                <span
                                    className="material-symbols-outlined"
                                    onClick={() => {setEditingEarnCoins(true);}}
                                >
                                    edit
                                </span>
                            )}
                            {earnCoinsRows.map((item) => (
                                <div className="earn-lose-coins-block" key={item.id}>
                                    <p>+ {item.action}</p>
                                    <p>{item.price + " " + item.unit}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <h2>How to Lose Coins</h2>
                    {isEditingLoseCoins && isAdmin ? (
                        <div className="container">
                            <div className="lose-coins-labels-area">
                                <h4>Action</h4>
                                <h4>Price</h4>
                                <h4>Unit</h4>
                                <h4>X</h4>
                            </div>
                            <div className="edit-area">
                                {loseCoinsRows.map((row) => (
                                    <EarnLoseCoinsEditor key={row.id} {...row} type="loseCoins" handleDelete={handleDelete} handleUpdateRow={handleUpdateRow}/>
                                ))}
                            </div>
                            <p className="add-new-btn" onClick={() => handleAddRow("loseCoins")}>+</p>
                            <p className="submit-error-msg">{loseCoinsErrorMessage}</p>
                            <button onClick={() => handleSubmit("loseCoins")} className="edit-submit-btn">Submit</button>
                        </div>
                    ) : (
                        <div className="container">
                            {isAdmin && (
                                <span className="material-symbols-outlined" onClick={() => {setEditingLoseCoins(true);}}>edit</span>
                            )}
                            {loseCoinsRows.map((item) => (
                                <div className="earn-lose-coins-block" key={item.id}>
                                    <p>- {item.action}</p>
                                    <p>{item.price + " " + item.unit}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="belt-multiplier-container">
                <h2>Belt Multiplier</h2>
                <p>Hover to see the coin belt multiplier</p>
                <div className="belt-multiplier-block container">
                    <div className="ninja white">
                        <img src="./assets/CN_WhiteBelt@8x.png" alt="white belt" />
                    </div>
                    <div className="ninja yellow">
                        <img src="./assets/CN_YellowBelt@8x.png" alt="yellow belt" />
                    </div>
                    <div className="ninja orange">
                        <img src="./assets/CN_OrangeBelt@8x.png" alt="orange belt" />
                    </div>
                    <div className="ninja green">
                        <img src="./assets/CN_GreenBelt@8x.png" alt="green belt" />
                    </div>
                    <div className="ninja blue">
                        <img src="./assets/CN_BlueBelt@8x.png" alt="blue belt" />
                    </div>
                    <div className="ninja purple">
                        <img src="./assets/CN_PurpleBelt@8x.png" alt="purple belt" />
                    </div>
                    <div className="ninja brown">
                        <img src="./assets/CN_BrownBelt@8x.png" alt="brown belt" />
                    </div>
                    <div className="ninja red">
                        <img src="./assets/CN_RedBelt@8x.png" alt="red belt" />
                    </div>
                    <div className="ninja black">
                        <img src="./assets/CN_BlackBelt@8x.png" alt="black belt" />
                    </div>
                </div>
            </div>
            <div className="coins-calculator-container">
                <h2>Coins Calculator</h2>
                <p>Calculate how many coins you've earned and ask a sensei for them!</p>
                <div className="coins-calculator-block container">
                    <form>
                        <label>My belt level</label>
                        <div className="custom-select">
                            <select value={calcField.multiplier} onChange={(e) => handleCalcFieldChange("multiplier", e.target.value)}>
                                <option value="">Select your belt level</option>
                                <option value="white">White</option>
                                <option value="yellow">Yellow</option>
                                <option value="orange">Orange</option>
                                <option value="green">Green</option>
                                <option value="blue">Blue</option>
                                <option value="purple">Purple</option>
                                <option value="brown">Brown</option>
                                <option value="red">Red</option>
                                <option value="black">Black</option>
                            </select>
                        </div>
                        <label>What I did</label>
                        <div className="custom-select">
                            <select onChange={(e) => handleCalcFieldChange("actionId", +e.target.value)}>
                                <option value="">Select your activity</option>
                                {earnCoinsRows.map((item) => (
                                    <option value={item.id}>{item.action}</option>
                                ))}
                            </select>
                        </div>
                    </form>
                    <button onClick={handleCalc}>Calculate</button>
                    <p>{calcCoin}</p>
                </div>
            </div>
            <div className="available-coins-container">
                <h2>Available Coins</h2>
                <p>Hover to see how to get each coin</p>
                <div className="available-coins-block">
                    <CoinCard coin="Silver Coin" conversion="See above" emoji="🟡" emojiColor="yellow"/>
                    <CoinCard coin="Gold Coin" conversion="Trade 5 Silver Coins" emoji="⚪" emojiColor="silver"/>
                    <CoinCard coin="Obsidian Coin" conversion="Trade 5 Gold Coins" emoji="⚫" emojiColor="black"/>
                </div>
            </div>
        </main>
    );
}

export default EarnCoinPage;