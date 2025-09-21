import { IP } from "../App";

import "./Prize.css";
import { Price } from "../data.ts"

export interface PrizeProps {
    id: number;
    name: string;
    price: Price;
    description: string;
    image: string | null;
    handleClick: () => void;
}
function Prize({ name, price, image, handleClick }: PrizeProps) {
    const backgroundImage = image ? `url(http://${IP}:5000/server/prizes-images/${image})` : "none";

    return(
        <div className="prize-preview" style={{backgroundImage}} onClick={handleClick}>
            <div className="prize-label-container">
                <p className="prize-name-label">{name}</p>
                <p className="prize-price-label">{price.quantity + " " + price.coinType}</p>
            </div>
        </div>
    )
}

export default Prize;