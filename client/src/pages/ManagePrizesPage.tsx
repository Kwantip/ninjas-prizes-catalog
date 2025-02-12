import { useState, useEffect } from "react";
import PrizeManager, { PrizeManagerProps } from "../components/PrizeManager";
import FilamentManagerPopup from "../components/FilamentManagerPopup";
import PrizeEditorPopup from "../components/PrizeEditorPopup";
import { IP,  adminModeSetter } from "../App";

import "./ManagePrizesPages.css";

function ManagePrizesPage() {
    const { isAdmin } = adminModeSetter();
    const [isFilamentManagerPopupVisible, setFilamentManagerPopupVisible] = useState(false);
    const [isPrizeEditorPopupVisible, setPrizeEditorPopupVisible] = useState(false);
    const [prizesList, setPrizesList] = useState<{
        id: number;
        name: string;
        price: number;
        unit: string;
        quantity: number;
        variations: { id: number, variation: string }[] | null;
        visible: boolean;
        description: string;
        imagesPaths: {id: number, file: File | null, path: string | null}[] | null;
        premium: false;
    }[]>([]);
    const [selectedPrize, setSelectedPrize] = useState<Omit<PrizeManagerProps, "handleEdit" | "handleDecreaseQuantity" | "handleVisibility"> | null>(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetch(`http://${IP}:5000/api/prizesList`)
            .then((res) => res.json())
            .then(setPrizesList)
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
        fetch(`http://${IP}:5000/api/prizesList`)
            .then((res) => res.json())
            .then(setPrizesList)
            .catch((err) => console.error("Failed to fetch data:", err));
    };
    const handleAddNewPrize = () => {
        let newPrizeIdNum = Math.max(...prizesList.map((item) => item.id), 0) + 1;

        setSelectedPrize({
            id: newPrizeIdNum,
            name: '',
            price: 0,
            unit: '',
            quantity: 0,
            variations: null,
            visible: true,
            description: '',
            imagesPaths: null,
            premium: false
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

    const handleDecreaseQuantity = (prize: Omit<PrizeManagerProps, "handleEdit" | "handleDecreaseQuantity" | "handleVisibility">) => {
        let newQuantity = prize.quantity - 1;
        fetch(`http://${IP}:5000/api/prizesList`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({premium: false, id: prize.id, field: "quantity", value: newQuantity})
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
        console.log(prize.premium)
        fetch(`http://${IP}:5000/api/prizesList`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({premium: false, id: prize.id, field: "visible", value: !prize.visible})
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
            <h1>Prizes Manager</h1>
            <div className="btns-area">
                <button onClick={handleAddNewPrize}>Add New Prize</button>
                <button onClick={() => {
                    setFilamentManagerPopupVisible(true);
                    document.body.classList.add("no-scroll");
                    }}>
                    Manage Filament Colors
                </button>
            </div>
            <div className="labels-area">
                <h4>Name</h4>
                <h4>Price</h4>
                <h4>Quantity</h4>
                <h4>Decrease Quantity</h4>
                <h4>Visible</h4>
                <h4>Edit</h4>
            </div>
            <div className="prizes-list">
                {prizesList.map((item) => (
                    <PrizeManager
                        key={item.id}
                        {...item}
                        handleEdit={() => {handleEditPrize(item)}}
                        premium={false}
                        handleDecreaseQuantity={() => handleDecreaseQuantity(item)}
                        handleVisibility={() => handleVisibility(item)}
                    />
                ))}
            </div>
            <div className="overlay-area">
                {isFilamentManagerPopupVisible && <FilamentManagerPopup handleClose={() => handleClose("filamentManager")} />}
                {isPrizeEditorPopupVisible && <PrizeEditorPopup handleClose={() => handleClose("prizeEditor")} prize={selectedPrize} editing={editing} premium={false} />}
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
