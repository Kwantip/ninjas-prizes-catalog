import { useState } from "react";
import "./CoinCard.css";

interface CoinCardProps {
    coin: string;
    conversion: string;
}
function CoinCard({ coin, conversion }: CoinCardProps) {
    const [cardContent, setCardContent] = useState(coin);

    const handleMouseOver = () => {
        setCardContent(conversion);
    }
    const handleMouseOut = () => {
        setCardContent(coin);
    }

    return (
        <div className="coin-card"
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            {cardContent}
        </div>
    )
}

export default CoinCard;