import { IP } from "../App";

import "./Prize.css";

export interface PrizeProps {
    id: number;
    name: string;
    price: number;
    unit: string;
    quantity: number;
    variations: { id: number, variation: string }[] | null;
    visible: boolean;
    description: string;
    imagesPaths: { id: number, file: File | null, path: string | null }[] | null;
    handleClick: () => void;
}
function Prize({ name, price, unit, imagesPaths, handleClick }: PrizeProps) {
    const backgroundImage = imagesPaths?.[0]?.path ? `url(http://${IP}:5000/server/prizes-images/${imagesPaths[0].path})` : "none";

    return(
        <div className="prize-preview" style={{backgroundImage}} onClick={handleClick}>
            <div className="prize-label-container">
                <p className="prize-name-label">{name}</p>
                <p className="prize-price-label">{price + " " + unit}</p>
            </div>
        </div>
    )
}

export default Prize;