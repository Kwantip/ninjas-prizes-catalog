import { useState, useEffect } from "react";

import Prize, {PrizeProps} from "../components/Prize"
import DetailedPrizePopup from "../components/DetailedPrizePopup"

import { IP } from "../App";

import "./PrizesPage.css";

function PremiumPrizesPage() {
    const [premiumPrizesList, setPremiumPrizesList] = useState<{
        id: number;
        name: string;
        price: number;
        unit: string;
        quantity: number;
        variations: {id: number, variation: string}[] | null;
        visible: boolean;
        description: string;
        imagesPaths: {id: number, file: File| null, path: string | null}[] | null
     }[]>([]);
     const [isDetailedPrizePopupVisible, setDetailedPrizePopupVisible] = useState(false);
     const [selectedPrize, setSelectedPrize] = useState<Omit<PrizeProps, "handleClick">>({
        id: 9999,
        name: "Fake Item",
        price: 10,
        unit: "Fake Unit",
        quantity: 99999,
        variations: null,
        visible: false,
        description: "FAKE ITEM FAKE ITEM",
        imagesPaths: null
     });

     useEffect(() => {
        fetch(`http://${IP}:5000/api/premiumPrizesList`)
            .then((res) => res.json())
            .then(setPremiumPrizesList)
            .catch((err) => console.error("Failed to fetch data:", err));
    }, []);

    const handleClose = () => {
        setDetailedPrizePopupVisible(false);
        document.body.classList.remove("no-scroll");
    }
    const handleClickPrize = (prize: Omit<PrizeProps, "handleClick">) => {
        setSelectedPrize(prize);
        setDetailedPrizePopupVisible(true);
        window.scrollTo(0, 0);
        document.body.classList.add("no-scroll");
    }

    return (
        <main>
            <h1>Premium Prizes</h1>
            <div className="premium-prizes-container">
                {premiumPrizesList.map((item) => (
                    item.visible &&
                    <>
                        <Prize
                            key={item.id}
                            {...item}
                            handleClick={() => {
                                handleClickPrize(item);
                            }} />
                    </>
                ))}
            </div>
            <div className="overlay-area">
                {isDetailedPrizePopupVisible && <DetailedPrizePopup handleClose={handleClose} prize={selectedPrize} premium={true} />}
            </div>
        </main>
    )
}

export default PremiumPrizesPage;