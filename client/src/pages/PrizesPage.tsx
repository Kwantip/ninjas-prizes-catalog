import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Prize, {PrizeProps} from "../components/Prize"
import DetailedPrizePopup from "../components/DetailedPrizePopup"

import "./PrizesPage.css";

function PrizesPage() {
    const [prizesList, setPrizesList] = useState<{
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
    const [premium, setPremium] = useState(false);
     const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/api/prizesList")
            .then((res) => res.json())
            .then(setPrizesList)
            .catch((err) => console.error("Failed to fetch data:", err));
    }, []);
    useEffect(() => {
        fetch("http://localhost:5000/api/premiumPrizesList")
            .then((res) => res.json())
            .then(setPremiumPrizesList)
            .catch((err) => console.error("Failed to fetch data:", err));
    }, []);

    const handleClose = () => {
        setDetailedPrizePopupVisible(false);
        document.body.classList.remove("no-scroll");
    }
    const handleClickPrize = (prize: Omit<PrizeProps, "handleClick">, premium: boolean) => {
        setSelectedPrize(prize);
        setPremium(premium);
        setDetailedPrizePopupVisible(true);
        window.scrollTo(0, 0);
        document.body.classList.add("no-scroll");
    }

    console.log(prizesList)
    return (
        <main>
            <h1>Prizes</h1>
            <div className="prizes-container">
                {/* <p>Talk to a sensei to buy these items!</p> */}
                {/* <div
                    className="request-print-preview"
                    onClick={() => {
                        scrollTo(0, 0);
                        navigate("/print-request");
                }}>
                    <div className="request-print-background">+</div>
                    <div className="request-print-label-container">
                        <p className="request-print-name-label">Request a Print</p>
                        <p className="request-print-price-label">2 - 3 Golds</p>
                    </div>
                </div> */}
                <div className="tier-1">
                    <h4>Tier 1 Prizes</h4>
                    <p>Talk to a sensei to buy these items!</p>
                    <div className="prizes">
                        {prizesList.filter((item) => `${item.price} ${item.unit}` === "1 Gold").map((prize) => (
                            <Prize
                                key={prize.id}
                                {...prize}
                                handleClick={() => {
                                    handleClickPrize(prize, false);
                                }}
                            />
                        ))}
                    </div>
                </div>
                <div className="tier-2">
                    <h4>Tier 2 Prizes</h4>
                    <p>Talk to a sensei to buy these items!</p>
                    <div className="prizes">
                        {prizesList.filter((item) => `${item.price} ${item.unit}` === "2 Gold").map((prize) => (
                            <Prize
                                key={prize.id}
                                {...prize}
                                handleClick={() => {
                                    handleClickPrize(prize, false);
                                }}
                            />
                        ))}
                    </div>
                </div>
                <div className="tier-3">
                    <h4>Tier 3 Prizes</h4>
                    <p>Talk to a sensei to buy these items!</p>
                    <div className="prizes">
                        {prizesList.filter((item) => `${item.price} ${item.unit}` === "3 Gold").map((prize) => (
                            <Prize
                                key={prize.id}
                                {...prize}
                                handleClick={() => {
                                    handleClickPrize(prize, false);
                                }}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <h4>Premium Prizes</h4>
                    <p>Click "Order" to submit a request</p>
                    <div className="prizes">
                        {premiumPrizesList.map((prize) => (
                            <Prize 
                                key={prize.id}
                                {...prize}
                                handleClick={() => {
                                    handleClickPrize(prize, true);
                                }}
                            />
                        ))}
                    </div>
                </div>
                {/* {prizesList.map((item) => (
                    item.visible &&
                    <>
                        <Prize
                            key={item.id}
                            {...item}
                            handleClick={() => {
                                handleClickPrize(item);
                            }}/>
                    </>
                ))} */}
            </div>
            <div className="overlay-area">
                {isDetailedPrizePopupVisible && <DetailedPrizePopup handleClose={handleClose} prize={selectedPrize} premium={premium} />}
            </div>
        </main>
    )
}

export default PrizesPage;