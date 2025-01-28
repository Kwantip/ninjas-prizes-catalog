import { useState, useEffect } from "react";

import PrizeManager, { PrizeManagerProps } from "../components/PrizeManager";
import FilamentManagerPopup from "../components/FilamentManagerPopup";
import PrizeEditorPopup from "../components/PrizeEditorPopup";

import { IP,  adminModeSetter } from "../App";

function ManagePremiumPrizesPage() {
    const { isAdmin } = adminModeSetter();
    const [isFilamentManagerPopupVisible, setFilamentManagerPopupVisible] = useState(false);
    const [isPrizeEditorPopupVisible, setPrizeEditorPopupVisible] = useState(false);
    const [premiumPrizesList, setPremiumPrizesList] = useState<{
        id: number;
        name: string;
        price: number;
        unit: string;
        quantity: number;
        variations: {id: number, variation: string}[] | null;
        visible: boolean;
        description: string;
        imagesPaths: {id: number, file: File | null, path: string | null}[] | null;
        premium: true
    }[]>([]);
    const [selectedPrize, setSelectedPrize] = useState<Omit<PrizeManagerProps, "handleEdit"> | null>(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetch(`http://${IP}:5000/api/premiumPrizesList`)
            .then((res) => res.json())
            .then(setPremiumPrizesList)
            .catch((err) => console.error("Failed to fetch data:", err));
    }, []);

    const resetScroll = () => {
        window.scrollTo(0, 0);
    };
    const handleClose = (type: "filamentManager" | "prizeEditor") => {
        type === "filamentManager" ? setFilamentManagerPopupVisible(false) : setPrizeEditorPopupVisible(false);
        document.body.classList.remove("no-scroll");
    };
    const handleAddNewPrize = () => {
        let newPrizeIdNum = Math.max(...premiumPrizesList.map((item) => item.id), 0) + 1;

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
            premium: true
        });
        setEditing(false);
        resetScroll();
        setPrizeEditorPopupVisible(true);
        document.body.classList.add("no-scroll");
    };

    const handleEditPrize = (prize: Omit<PrizeManagerProps, "handleEdit">) => {
        setSelectedPrize(prize);
        setEditing(true);
        resetScroll();
        setPrizeEditorPopupVisible(true);
    };

    return isAdmin ? (
        <main className="manage-prizes-page">
            <h1>Premium Prizes Manager</h1>
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
                {premiumPrizesList.map((item) => (
                    <PrizeManager
                        key={item.id}
                        {...item}
                        handleEdit={() => {
                            handleEditPrize(item);
                            document.body.classList.add("no-scroll");
                        }}
                        premium={true}
                    />
                ))}
            </div>
            <div className="overlay-area">
                {isFilamentManagerPopupVisible && <FilamentManagerPopup handleClose={() => handleClose("filamentManager")} />}
                {isPrizeEditorPopupVisible && <PrizeEditorPopup handleClose={() => handleClose("prizeEditor")} prize={selectedPrize} editing={editing} premium={true} />}
            </div>
        </main>
    ) : (
        <main>
            <h1>Breh</h1>
            <p>You don't belong here...</p>
        </main>
    );
}

export default ManagePremiumPrizesPage;