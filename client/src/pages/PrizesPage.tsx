import { useState, useEffect } from "react";

import Prize, {PrizeProps} from "../components/Prize"
import DetailedPrizePopup from "../components/DetailedPrizePopup"

import { IP } from "../App";

import "./PrizesPage.css";

import { COIN, PrizeItem, PrizeCategory } from "../data.ts";

function PrizesPage() {
    const [prizeCategoryList, setPrizeCategoryList] = useState<PrizeCategory[]>([]);
    const [prizesList, setPrizesList] = useState<PrizeItem[]>([]);

    const [isDetailedPrizePopupVisible, setDetailedPrizePopupVisible] = useState(false);

    const [selectedPrizeCategory, setSelectedPrizeCategory] = useState<PrizeCategory>()
    const [selectedPrizesList, setSelectedPrizesList] = useState<PrizeItem[]>([]);
    const [premium, setPremium] = useState(false);

    useEffect(() => {
        // TODO: add filter is_visible=true
        fetch(`http://${IP}:8080/prize-categories`)
            .then((res) => res.json())
            .then((data) => {
                setPrizeCategoryList(data)
            })
            .catch((err) => console.error("Failed to fetch data:", err));
    }, []);
    useEffect(() => {
        fetch(`http://${IP}:8080/prize-items`)
            .then((res) => res.json())
            .then(setPrizesList)
            .catch((err) => console.error("Failed to fetch data:", err));
    }, []);

    const handleClose = () => {
        setDetailedPrizePopupVisible(false);
        document.body.classList.remove("no-scroll");
    }

    const handleClickPrize = (prizeCategory: PrizeCategory, premium: boolean) => {
        // TODO: useEffect get prize category by id; dependency: prize item state

        let prizeItem = prizesList.find((item) => item.prize_category_id === prizeCategory.id);
        let prizeListFilter = prizesList.filter((item) => item.prize_category_id === prizeCategory.id);

        if (prizeItem)
        {
            setSelectedPrizeCategory(prizeCategory);
            setPremium(premium);
            setSelectedPrizesList(prizeListFilter);
            setDetailedPrizePopupVisible(true);
            window.scrollTo(0, 0);
            document.body.classList.add("no-scroll");
        }
    }

    return (
        <main>
            <h1>Prizes</h1>
            <div className="prizes-container">
                <div className="tier-1">
                    <h4>Tier 1 Prizes</h4>
                    <p>Talk to a sensei to buy these items!</p>
                    <div className="prizes">
                        {prizeCategoryList.filter((item) => `${item.price_quantity}` === '1' && `${item.price_coin_type}` === COIN.Gold).map((prize) => (
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
                        {prizeCategoryList.filter((item) => `${item.price_quantity}` === '2' && `${item.price_coin_type}` === COIN.Gold).map((prize) => (
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
                        {prizeCategoryList.filter((item) => `${item.price_quantity}` === '3' && `${item.price_coin_type}` === COIN.Gold).map((prize) => (
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
                        {prizeCategoryList.filter((item) => `${item.price_coin_type}` === COIN.Obsidian).map((prize) => (
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
            </div>
            <div className="overlay-area">
                {isDetailedPrizePopupVisible && selectedPrizeCategory && <DetailedPrizePopup handleClose={handleClose} prize={selectedPrizeCategory} premium={premium} prizeList={selectedPrizesList}/>}
            </div>
        </main>
    )
}

export default PrizesPage;