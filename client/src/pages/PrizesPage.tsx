import { useState, useEffect } from "react";

import Prize, {PrizeProps} from "../components/Prize"
import DetailedPrizePopup from "../components/DetailedPrizePopup"

import { IP } from "../App";

import "./PrizesPage.css";

import { COIN, Price, PrizeItem, PrizeCategory, premiumPrizeCategoryList, premiumPrizeItemList } from "../data.ts";

function PrizesPage() {
    const [prizeCategoryList, setPrizeCategoryList] = useState<PrizeCategory[]>([]);
    const [prizesList, setPrizesList] = useState<PrizeItem[]>([]);
    const [premiumPrizesList, setPremiumPrizesList] = useState(premiumPrizeItemList);
    const [isDetailedPrizePopupVisible, setDetailedPrizePopupVisible] = useState(false);
    const [selectedPrizeCategory, setSelectedPrizeCategory] = useState<Omit<PrizeProps, "handleClick">>({
        id: 9999,
        name: "Fake Item",
        price_quantity: 9999,
        price_coin_type: COIN.Gold,
        description: "FAKE ITEM FAKE ITEM",
        image: ""
    });
    const [selectedPrizesList, setSelectedPrizesList] = useState<PrizeItem[]>([]);
    const [premium, setPremium] = useState(false);

    useEffect(() => {
        fetch(`http://${IP}:8080/prizeCategories`)
            .then((res) => res.json())
            .then((data) => {
                setPrizeCategoryList(data)
            })
            .catch((err) => console.error("Failed to fetch data:", err));
    }, []);
    useEffect(() => {
        fetch(`http://${IP}:8080/prizeItems`)
            .then((res) => res.json())
            .then(setPrizesList)
            .catch((err) => console.error("Failed to fetch data:", err));
    }, []);
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
    const handleClickPrize = (prizeCategory: Omit<PrizeProps, "handleClick">, premium: boolean) => {
        let prizeItem = (premium) ? premiumPrizeItemList.find((item) => item.prize_category_id === prizeCategory.id) : prizesList.find((item) => item.prize_category_id === prizeCategory.id);
        let prizeListFilter = (premium) ? premiumPrizeItemList.filter((item) => item.prize_category_id === prizeCategory.id) : prizesList.filter((item) => item.prize_category_id === prizeCategory.id);

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

    // console.log(prizesList)
    return (
        <main>
            <h1>Prizes</h1>
            <div className="prizes-container">
                <div className="tier-1">
                    <h4>Tier 1 Prizes</h4>
                    <p>Talk to a sensei to buy these items!</p>
                    <div className="prizes">
                        {/* {prizeCategoriesList.filter((item) => `${item.priceQuantity}` === '1').map((prize) => ( */}
                        {prizeCategoryList.filter((item) => `${item.price_quantity} ${item.price_coin_type}` === "1 Gold").map((prize) => (
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
                        {prizeCategoryList.filter((item) => `${item.price_quantity} ${item.price_coin_type}` === "2 Gold").map((prize) => (
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
                        {prizeCategoryList.filter((item) => `${item.price_quantity} ${item.price_coin_type}` === "3 Gold").map((prize) => (
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
                        {premiumPrizeCategoryList.map((prize) => (
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
                {isDetailedPrizePopupVisible && <DetailedPrizePopup handleClose={handleClose} prize={selectedPrizeCategory} premium={premium} prizeList={selectedPrizesList}/>}
            </div>
        </main>
    )
}

export default PrizesPage;