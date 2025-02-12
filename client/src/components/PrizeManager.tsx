import "./PrizeManager.css";

import { IP } from "../App";
import { useState } from "react";

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
    handleDecreaseQuantity: () => void;
    handleVisibility: () => void;
}
function PrizeManager({id, name, price, unit, quantity, visible, premium, handleEdit, handleDecreaseQuantity, handleVisibility}: PrizeManagerProps) {

    return (
        <div className="prize">
            <p>{name}</p>
            <p>{price + " " + unit}</p>
            <p>{quantity}</p>
            <span className="material-symbols-outlined clickable" onClick={handleDecreaseQuantity}>arrow_circle_down</span>
            <span className="material-symbols-outlined clickable" onClick={handleVisibility}>
                {visible ? (<>visibility</>) : (<>visibility_off</>)}
            </span>
            <span className="material-symbols-outlined clickable" onClick={handleEdit}>edit</span>
        </div>
    )
}

export default PrizeManager;