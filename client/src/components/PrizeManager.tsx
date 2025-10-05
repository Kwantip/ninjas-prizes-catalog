import "./PrizeManager.css";

export interface PrizeManagerProps {
    id: number;
    name: string;
    price_quantity: number;
    price_coin_type: string;
    // quantity: number;
    // variations: {id: number, variation: string}[] | null;
    // visible: boolean;
    description: string;
    image: string;
    // imagesPaths: {id: number, file: File | null, path: string | null}[] | null;
    // premium: boolean;
    handleEdit: () => void;
    // handleDecreaseQuantity: () => void;
    // handleVisibility: () => void;
}
function PrizeManager({ name, price_quantity, price_coin_type, handleEdit}: PrizeManagerProps) {

    return (
        <div className="prize">
            <p>{name}</p>
            <p>{price_quantity + " " + price_coin_type}</p>
            {/* <p>{quantity}</p> */}
            {/* <span className="material-symbols-outlined clickable" onClick={handleDecreaseQuantity}>arrow_circle_down</span>
            <span className="material-symbols-outlined clickable" onClick={handleVisibility}>
                {visible ? (<>visibility</>) : (<>visibility_off</>)}
            </span> */}
            <span className="material-symbols-outlined clickable" onClick={handleEdit}>edit</span>
        </div>
    )
}

export default PrizeManager;