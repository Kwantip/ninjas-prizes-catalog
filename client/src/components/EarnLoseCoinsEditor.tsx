import "./EarnLoseCoinsEditor.css";

export interface EarnLoseCoinsEditorProps {
    id: number;
    action: string;
    price: number;
    unit: string;
    type: "earnCoins" | "loseCoins";
    multipliable: boolean | null;
    handleDelete: (id: number, type: "earnCoins" | "loseCoins") => void;
    handleUpdateRow: (id: number, field: string, value: any, type: "earnCoins" | "loseCoins") => void;
}


function EarnLoseCoinsEditor({ id, action, price, unit, type, multipliable, handleDelete, handleUpdateRow }: EarnLoseCoinsEditorProps) {
    return (
        <form className={type==="earnCoins" ? (`earn-coins-editor`) : ("lose-coins-editor")}>
            <input type="text" value={action} onChange={(e) => handleUpdateRow(id, "action", e.target.value, type)} />
            <input type="number" min="1" value={price} onChange={(e) => handleUpdateRow(id, "price", e.target.value, type)} />
            <select value={unit} onChange={(e) => handleUpdateRow(id, "unit", e.target.value, type)}>
                <option>Silver</option>
                <option>Gold</option>
                <option>Obsidian</option>
            </select>
            {type === "earnCoins" && 
                <label>{multipliable ? (
                    <input type="checkbox" onChange={() => handleUpdateRow(id, "multipliable", false, type)} checked />
                ) : (
                    <input type="checkbox" onChange={() => handleUpdateRow(id, "multipliable", true, type)} />

                )}
                </label>
            }
            <p className="delete-btn" onClick={() => handleDelete(id, type)}>×</p>
        </form>
    );
}


export default EarnLoseCoinsEditor;