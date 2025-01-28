import "./PrizeManager.css";

import { IP } from "../App";

export interface PrizeManagerProps {
    id: number;
    name: string;
    price: number;
    unit: string;
    quantity: number;
    variations: {id: number, variation: string}[] | null;
    visible: boolean;
    description: string;
    imagesPaths: {id: number, file: File | null, path: string | null}[] | null;
    premium: boolean;
    handleEdit: () => void;
}
function PrizeManager({id, name, price, unit, quantity, visible, premium, handleEdit}: PrizeManagerProps) {
    const handleVisibility = () => {
        fetch(`http://${IP}:5000/api/prizesList`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({premium: premium, id: id, field: "visible", value: !visible})
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorDetails = await res.text();
                    console.error("Server response:", errorDetails);
                    throw new Error("Failed to update prize.");
                }
                location.reload();
            })
            .catch((err) => {
                console.error("Error details:", err);
            });
    }
    const handleDecreaseQuantity = () => {
        let newQuantity = quantity - 1;
        fetch(`http://${IP}:5000/api/prizesList`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({premium: premium, id: id, field: "quantity", value: newQuantity})
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorDetails = await res.text();
                    console.error("Server response:", errorDetails);
                    throw new Error("Failed to update prize.");
                }
                location.reload();
            })
            .catch((err) => {
                console.error("Error details:", err);
            });
    }

    return (
        <div className="prize">
            <p>{name}</p>
            <p>{price + " " + unit}</p>
            <p>{quantity}</p>
            {/* <p><strong>-</strong></p> */}
            <span className="material-symbols-outlined clickable" onClick={handleDecreaseQuantity}>arrow_circle_down</span>
            <span className="material-symbols-outlined clickable" onClick={handleVisibility}>
                {visible ? (<>visibility</>) : (<>visibility_off</>)}
            </span>
            <span className="material-symbols-outlined clickable" onClick={handleEdit}>edit</span>
        </div>
    )
}

export default PrizeManager;