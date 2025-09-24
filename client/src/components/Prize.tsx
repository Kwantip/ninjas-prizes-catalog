import { IP } from "../App";

import "./Prize.css";

export interface PrizeProps {
    id: number;
    name: string;
    price_quantity: number;
    price_coin_type: string;
    description: string;
    image: string | null;
    handleClick: () => void;
}
function Prize({ name, price_quantity, price_coin_type, image, handleClick }: PrizeProps) {
    const backgroundImage = image ? `url(http://${IP}:5000/server/prizes-images/${image})` : "none";

    return(
        <div className="prize-preview" style={{backgroundImage}} onClick={handleClick}>
            <div className="prize-label-container">
                <p className="prize-name-label">{name}</p>
                <p className="prize-price-label">{price_quantity + " " + price_coin_type}</p>
            </div>
        </div>
    )
}

export default Prize;