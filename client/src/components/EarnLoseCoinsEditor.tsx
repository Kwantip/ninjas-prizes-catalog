import "./EarnLoseCoinsEditor.css";

export interface EarnLoseCoinsEditorProps {
    id: number;
    action: string;
    price: number;
    unit: string;
    type: "earnCoins" | "loseCoins";
    handleDelete: (id: number, type: "earnCoins" | "loseCoins") => void;
    handleUpdateRow: (id: number, field: string, value: any, type: "earnCoins" | "loseCoins") => void;
}


function EarnLoseCoinsEditor({ id, action, price, unit, type, handleDelete, handleUpdateRow }: EarnLoseCoinsEditorProps) {
    return (
        <form className="earn-lose-coins-editor">
            <input type="text" value={action} onChange={(e) => handleUpdateRow(id, "action", e.target.value, type)} />
            <input type="number" min="1" value={price} onChange={(e) => handleUpdateRow(id, "price", e.target.value, type)} />
            <select value={unit} onChange={(e) => handleUpdateRow(id, "unit", e.target.value, type)}>
                <option>Silver</option>
                <option>Gold</option>
                <option>Obsidian</option>
            </select>
            <p className="delete-btn" onClick={() => handleDelete(id, type)}>×</p>
        </form>
    );
}


export default EarnLoseCoinsEditor;