import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./DetailedPrizePopup.css"

import { IP } from "../App";

interface ImageCarouselProps {
  imagesPaths: {
    id: number;
    file: File | null;
    path: string | null;
  }[] | null;
}

function ImageCarousel({ imagesPaths }: ImageCarouselProps) {
    const [imgIndex, setImgIndex] = useState(0);
    const [currentImg, setCurrentImg] = useState<string | null>(
        imagesPaths && imagesPaths.length > 0 && imagesPaths[imgIndex]?.path
        ? imagesPaths[imgIndex].path
        : null
    );
    const backgroundImage = imagesPaths?.[0]?.path ? `url(http://${IP}:5000/server/prizes-images/${currentImg})` : "none";

    const handleLeftArrow = () => {
        if (imagesPaths) {
            const newIndex = imgIndex === 0 ? imagesPaths.length - 1 : imgIndex - 1;
            setImgIndex(newIndex);
            setCurrentImg(imagesPaths[newIndex]?.path || null);
        }
    };
    
    const handleRightArrow = () => {
        if (imagesPaths) {
            const newIndex = imgIndex === imagesPaths.length - 1 ? 0 : imgIndex + 1;
            setImgIndex(newIndex);
            setCurrentImg(imagesPaths[newIndex]?.path || null);
        }
    };

    return (
        <div className="image-carousel">
            {imagesPaths && imagesPaths.length > 0 ? (
            <>
                <div className="image" style={{backgroundImage}}>
                    { imagesPaths.length > 1 &&
                        <>
                            <span className="material-symbols-outlined clickable left-arrow" onClick={handleLeftArrow}>arrow_back_ios</span>
                            <span className="material-symbols-outlined clickable right-arrow" onClick={handleRightArrow}>arrow_forward_ios</span>
                        </>
                    }
                </div>
            </>
            ) : (
            <>
                <img alt="No Prize Available" />
            </>
            )}
        </div>
    );
}

interface DetailedPrizePopupProps {
    handleClose: () => void;
    prize: {
        id: number;
        name: string;
        price: number;
        unit: string;
        quantity: number;
        variations: {
            id: number;
            variation: string;
        }[] | null;
        visible: boolean;
        description: string;
        imagesPaths: {
            id: number;
            file: File | null;
            path: string | null;
        }[] | null;
    }
    premium: boolean;
}
function DetailedPrizePopup({ handleClose, prize, premium }: DetailedPrizePopupProps) {
    const navigate = useNavigate();
    const handleOrderClick = () => {
        document.body.classList.remove("no-scroll");
        navigate("/request-premium-prize", { state: { prize: prize.name } });
    };

    return (
        <>
            <div className="overlay-background" onClick={handleClose}></div>
            <div className="overlay detailed-prize-popup">
                <ImageCarousel imagesPaths={prize.imagesPaths} />
                <div className="details-section">
                    <h1>{prize.name}</h1>
                    <h2>{prize.price} {prize.unit}</h2>
                    <h3>{prize.quantity} remaining in stock</h3>
                    {prize.variations && prize.variations?.length > 0 &&
                        <div>
                            <h3>Variations</h3>
                            <div className="variations-container">
                                {prize.variations.map((item) => (
                                    <p key={item.id}>- {item.variation}</p>
                                ))}
                            </div>
                        </div>
                    }
                    <div>
                        <h3>Item Descriptions</h3>
                        <p>{prize.description}</p>
                    </div>
                    {premium && <button onClick={handleOrderClick}>Order</button>}
                </div>
                <span
                    className="material-symbols-outlined close-btn clickable"
                    onClick={handleClose}
                >
                    close
                </span>
            </div>
        </>
    )
}

export default DetailedPrizePopup;