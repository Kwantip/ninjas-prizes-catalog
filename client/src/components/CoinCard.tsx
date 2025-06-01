import { useState } from "react";
import "./CoinCard.css";

interface CoinCardProps {
    coin: string;
    conversion: string;
    emoji: string;
    emojiColor: string;
}
function CoinCard({ coin, conversion, emoji, emojiColor }: CoinCardProps) {
    const [cardContent, setCardContent] = useState(coin);

    const handleMouseOver = () => {
        setCardContent(conversion);
    }
    const handleMouseOut = () => {
        setCardContent(coin);
    }

    // just using a seperate description span
    //its smart to use state, but useless and just more confusing
    return (
        <div className="coin-card"
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <div className="pulse"></div>
            <div className="coin-card-emoji" style={{backgroundColor:emojiColor}}>
                {emoji}
            </div>
            <div className="coin-card-header">{coin}</div>
            <span className="coin-card-description">{conversion}</span>
        </div>
    )
}

export default CoinCard;