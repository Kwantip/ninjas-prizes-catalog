
import { useState, useEffect } from "react";

import "./FilamentManagerPopup.css";

interface FilamentEditorProps {
    id: number;
    color: string;
    handleUpdate: (id: number, value: any) => void;
    handleDelete: (id: number) => void;
}
function FilamentEditor({ id, color, handleUpdate, handleDelete }: FilamentEditorProps) {
    return(
        <form className="filament-editor">
            <input value={color} onChange={(e) => handleUpdate(id, e.target.value)}/>
            <p className="delete-btn" onClick={() => {handleDelete(id)}}>×</p>
        </form>
    )
}
interface FilamentManagerPopupProps {
    handleClose: () => void;
}
function FilamentManagerPopup({ handleClose }: FilamentManagerPopupProps) {
    const [availableColors, setAvailableColors] = useState<{ id: number; color: string }[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/availableColors")
            .then((res) => res.json())
            .then(setAvailableColors)
            .catch((err) => console.error("Failed to fetch colors:", err));
    }, []);

    let colorIdCounter = Math.max(...availableColors.map((item) => item.id), 0);

    const handleUpdate = (id: number, value: any) => {
        setAvailableColors((prev) =>
            prev.map((color) =>
                color.id === id ? {...color, color: value} : color  
        ));
        setMessage("");
    };
    const handleAdd = () => {
        setAvailableColors((prev) => {
            return [
                ...prev,
                { id: colorIdCounter++, color: "" },
            ];
        })
    };
    const handleDelete = (id: number) => {
        setAvailableColors((prev) => prev.filter((color) => color.id !== id));
        setMessage("");
    };
    const handleSave = () => {
        // Validate that each item has a valid `id` and non-empty `color`
        const invalidItems = availableColors.filter(item => item.id === null || !item.color.trim());
    
        if (invalidItems.length > 0) {
            setMessage("Invalid format. Each row must have a unique color.");
            return;
        }

        fetch("http://localhost:5000/api/availableColors", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(availableColors),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorDetails = await res.text();
                    console.error("Server response:", errorDetails);
                    throw new Error("Failed to update colors.");
                }
                setMessage("Colors updated successfully!");
            })
            .catch((err) => {
                setMessage("Error updating colors.");
                console.error("Error details:", err);
            });
        
    };    

    return(
        <>
            <div className="overlay-background" onClick={handleClose}></div>
            <div className="filament-manager overlay">
                <h3>Filaments Manager</h3>
                <ul className="filament-editors-container">
                    {availableColors.map((item) => (
                        <li key={item.id}><FilamentEditor id={item.id} color={item.color} handleUpdate={handleUpdate} handleDelete={handleDelete}/></li>
                    ))}
                </ul>
                <p className="add-btn" onClick={handleAdd}>+</p>
                <span className="material-symbols-outlined close-btn" onClick={handleClose}>close</span>
                <p>{message}</p>
                <button onClick={handleSave}>Save</button>
            </div>
        </>
    );
}

export default FilamentManagerPopup;