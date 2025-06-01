// import { useState } from "react";
import "./CoinCard.css";

interface CoinCardProps {
    coin: string;
    conversion: string;
}
function CoinCard({ coin, conversion}: CoinCardProps) {
    // const [cardContent, setCardContent] = useState(coin);

    // const handleMouseOver = () => {
    //     setCardContent(conversion);
    // }
    // const handleMouseOut = () => {
    //     setCardContent(coin);
    // }

    // just using a seperate description span
    //its smart to use state, but useless and just more confusing
    return (
        <div className="coin-card"
            // onMouseOver={handleMouseOver}
            // onMouseOut={handleMouseOut}
        >
            <div className="pulse"></div>
            <div className="coin-card-header">{coin}</div>
            <span className="coin-card-description">{conversion}</span>
        </div>
    )
}

export default CoinCard;