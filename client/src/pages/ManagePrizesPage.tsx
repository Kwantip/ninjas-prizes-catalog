import { useState, useEffect } from "react";
import axios from 'axios'
import PrizeManager, { PrizeManagerProps } from "../components/PrizeManager";
import FilamentManagerPopup from "../components/FilamentManagerPopup";
import PrizeEditorPopup from "../components/PrizeEditorPopup";
import { IP,  adminModeSetter } from "../App";

import { PrizeItem, PrizeCategory } from "../data.ts";

import "./ManagePrizesPages.css";
import { Link } from "react-router-dom";

import "./ManagePrizesPages.css";

function ManagePrizesPage() {
    const { isAdmin } = adminModeSetter();
    const [isFilamentManagerPopupVisible, setFilamentManagerPopupVisible] = useState(false);
    const [isPrizeEditorPopupVisible, setPrizeEditorPopupVisible] = useState(false);
    const [prizeCategoryList, setPrizeCategoryList] = useState<PrizeCategory[]>([]);
    const [prizesList, setPrizesList] = useState<PrizeItem[]>([]);
    // {
    //     id: number;
    //     name: string;
    //     price: number;
    //     unit: string;
    //     quantity: number;
    //     variations: { id: number, variation: string }[] | null;
    //     visible: boolean;
    //     description: string;
    //     imagesPaths: {id: number, file: File | null, path: string | null}[] | null;
    //     premium: false;
    // }[]>([]);
    const [selectedPrize, setSelectedPrize] = useState<Omit<PrizeManagerProps, "handleEdit" | "handleDecreaseQuantity" | "handleVisibility"> | null>(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetch(`http://${IP}:8080/prize-categories`)
            .then((res) => res.json())
            .then(setPrizeCategoryList)
            .catch((err) => console.error("Failed to fetch data:", err));
    }, []);

    const resetScroll = () => {
        window.scrollTo(0, 0);
        document.body.classList.add("no-scroll");
    };
    const handleClose = (type: "filamentManager" | "prizeEditor") => {
        type === "filamentManager" ? setFilamentManagerPopupVisible(false) : setPrizeEditorPopupVisible(false);
        document.body.classList.remove("no-scroll");

        // Reload the data once the popup is closed
        fetch(`http://${IP}:8080/prize-categories`)
            .then((res) => res.json())
            .then(setPrizeCategoryList)
            .catch((err) => console.error("Failed to fetch data:", err));
    };
    const handleAddNewPrize = () => {
        let newPrizeIdNum = Math.max(...prizeCategoryList.map((item) => item.id), 0) + 1;

        setSelectedPrize({
            id: newPrizeIdNum,
            name: '',
            price_quantity: 0,
            price_coin_type: '',
            // quantity: 0,
            // visible: true,
            description: '',
            image: ''
            // premium: false
        });
        setEditing(false);
        resetScroll();
        setPrizeEditorPopupVisible(true);
        document.body.classList.add("no-scroll");
    };

    const handleEditPrize = (prize: Omit<PrizeManagerProps, "handleEdit" | "handleDecreaseQuantity" | "handleVisibility">) => {
        setSelectedPrize(prize);
        setEditing(true);
        resetScroll();
        setPrizeEditorPopupVisible(true);
    };

    const handleDelete = (id: number) => {
        axios.delete('http://localhost:8080/prize-categories/'+id)
        .then(res => {
            location.reload();
        })
        .catch(err => console.log(err))
    }

    const handleDecreaseQuantity = (prize: Omit<PrizeManagerProps, "handleEdit" | "handleDecreaseQuantity" | "handleVisibility">) => {
        // let newQuantity = prize.quantity - 1;
        fetch(`http://${IP}:5000/api/prizesList`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({premium: false, id: prize.id, field: "quantity", value: newQuantity})
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorDetails = await res.text();
                    console.error("Server response:", errorDetails);
                    throw new Error("Failed to update prize.");
                }
                // Reload the data after the button is clicked
                fetch(`http://${IP}:5000/api/prizesList`)
                    .then((res) => res.json())
                    .then(setPrizesList)
                    .catch((err) => console.error("Failed to fetch data:", err));
            })
            .catch((err) => {
                console.error("Error details:", err);
            });
    }

    const handleVisibility = (prize: Omit<PrizeManagerProps, "handleEdit" | "handleDecreaseQuantity" | "handleVisibility">) => {
        // console.log(prize.premium)
        fetch(`http://${IP}:5000/api/prizesList`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({premium: false, id: prize.id, field: "visible", value: !prize.visible})
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorDetails = await res.text();
                    console.error("Server response:", errorDetails);
                    throw new Error("Failed to update prize.");
                }
                // Reload the data after the button is clicked
                fetch(`http://${IP}:5000/api/prizesList`)
                    .then((res) => res.json())
                    .then(setPrizesList)
                    .catch((err) => console.error("Failed to fetch data:", err));
            })
            .catch((err) => {
                console.error("Error details:", err);
            });
    }

    return isAdmin ? (
        <main className="manage-prizes-page">
            <div>
            <h1>Prizes Manager</h1>
            <div className="btns-area">
                <button onClick={handleAddNewPrize}>Add New Prize</button>
                <button onClick={() => {
                    setFilamentManagerPopupVisible(true);
                    document.body.classList.add("no-scroll");
                    }}>
                    Manage Filament Colors
                </button><Link to="/prizes-manager/create"><button>Create</button></Link>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        {/* <th>Price Quantity</th>
                        <th>Price Coin Type</th> */}
                        <th>Image</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {prizeCategoryList.map((item, index) => {
                        return <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.price_quantity} {item.price_coin_type}</td>
                                {/* <td>{item.price_quantity}</td>
                                <td>{item.price_coin_type}</td> */}
                                <td>{item.image}</td>
                                <td>{item.description}</td>
                                <td>
                                    <Link to={`/prizes-manager/edit/${item.id}`}><button>Edit</button></Link>
                                    <button onClick={ () => handleDelete(item.id) }>Delete</button>
                                </td>
                            </tr>
                    })}
                </tbody>
            </table>
            </div>
            <div className="overlay-area">
                {isFilamentManagerPopupVisible && <FilamentManagerPopup handleClose={() => handleClose("filamentManager")} />}
                {/* {isPrizeEditorPopupVisible && <PrizeEditorPopup handleClose={() => handleClose("prizeEditor")} prize={selectedPrize} editing={editing} premium={false} />} */}
            </div>
        </main>
    ) : (
        <main>
            <h1>Breh</h1>
            <p>You don't belong here...</p>
        </main>
    );
}

export default ManagePrizesPage;
