import { useState } from "react";

import { IP } from "../App";

import "./PrizeEditorPopup.css";

interface VariationsEditorProps {
    id: number;
    value: string | null;
    handleUpdate: (id: number, value: any) => void;
    handleDelete: (id: number) => void;
}
function VariationsEditor({ id, value, handleUpdate, handleDelete }: VariationsEditorProps) {
    return (
        <div className="variation-editor">
            <input
                type="text"
                value={value || ""}
                onChange={(e) => handleUpdate(id, e.target.value)}
            />
            <span
                className="material-symbols-outlined clickable"
                onClick={() => handleDelete(id)}
            >
                close
            </span>
        </div>
    );
}
interface ImagePreviewProps {
    id: number;
    path: string | null;
    file: File | null;
    handleDelete: (id: number) => void;
    handleFileChange: (id: number, file: File) => void;
}
function ImagePreview({ id, path, handleDelete, handleFileChange }: ImagePreviewProps) {
    // console.log(id)
    return (
        <div className="image-preview">
            {path ? (
                <p>{path}</p>
            ) : (
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            handleFileChange(id, e.target.files[0]);
                        }
                    }}
                />
            )}
            <span
                className="material-symbols-outlined clickable"
                onClick={() => handleDelete(id)}
            >
                close
            </span>
        </div>
    );
}

interface PrizeEditorPopupProps {
    handleClose: () => void;
    prize: {
        id: number;
        name: string;
        price: number;
        unit: string;
        quantity: number;
        variations: { id: number; variation: string }[] | null;
        visible: boolean;
        description: string;
        imagesPaths: { id: number; file: File | null; path: string | null }[] | null;
    } | null;
    editing: boolean;
    premium: boolean;
}
function PrizeEditorPopup({ handleClose, prize, editing, premium }: PrizeEditorPopupProps) {
    const [prizeData, setPrizeData] = useState({
        id: prize?.id,
        name: prize?.name || "",
        price: prize?.price || 0,
        unit: prize?.unit || "Silver",
        quantity: prize?.quantity || 0,
        variations: prize?.variations || [],
        visible: prize?.visible ?? true,
        description: prize?.description || "",
        imagesPaths: prize?.imagesPaths || []
    });
    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
    const [savedMsg, setSavedMsg] = useState("");

    // INPUT FIELDS
    // General
    const handleFieldChange = (field: string, value: any) => {
        setPrizeData((prev) => ({ ...prev, [field]: value }));
    };

    // Variations
    let variationsIdCounter = prizeData.variations.length > 0
        ? Math.max(...prizeData.variations.map((item) => item.id)) + 1
        : 0;
    const handleAddVariation = () => {
        setPrizeData((prev) => ({
            ...prev,
            variations: [
                ...prev.variations,
                { id: variationsIdCounter, variation: "" },
            ]
        }));
    };
    const handleUpdateVariation = (id: number, value: any) => {
        setPrizeData((prev) => ({
            ...prev,
            variations: prev.variations.map((variation) =>
                variation.id === id ? { ...variation, variation: value } : variation
            ),
        }));
    };
    const handleDeleteVariation = (id: number) => {
        setPrizeData((prev) => ({
            ...prev,
            variations: prev.variations.filter((variation) => variation.id !== id),
        }));
    };

    // Images
    const handleAddImage = () => {
        let imagesIdCounter = prizeData.imagesPaths.length > 0
        ? Math.max(...prizeData.imagesPaths.map((item) => item.id)) + 1
        : 0;
        console.log("id", imagesIdCounter)
        setPrizeData((prev) => ({
            ...prev,
            imagesPaths: [...prev.imagesPaths, { id: imagesIdCounter, file: null, path: null }],
        }));
    };
    const handleFileChange = (id: number, file: File) => {
        setPrizeData((prev) => ({
            ...prev,
            imagesPaths: prev.imagesPaths.map((img) =>
                img.id === id ? { ...img, file } : img
            ),
        }));
    };
    const handleDeleteImagePreview = (id: number) => {
        let pathToDelete = prizeData.imagesPaths.find((thing) => thing.id === id)?.path;
        console.log("pATH", pathToDelete)

        setImagesToDelete((prev) => [...prev, id]);

        setPrizeData((prev) => ({
            ...prev,
            imagesPaths: prev.imagesPaths.filter((img) => img.id !== id),
        }));
    };


    // PRIZES
    // Update existing prize
    const handleUpdatePrize = () => {
        if (
            !prizeData.name ||
            !prizeData.price ||
            !prizeData.quantity ||
            prizeData.visible === null ||
            !prizeData.description
        ) {
            setSavedMsg("Invalid data!")
            console.error("INVALID DATA!!");
        } else {
            const formData = new FormData();
    
            formData.append("data", JSON.stringify(prizeData));
            prizeData.imagesPaths.forEach(image => {
                !image.path && image.file && formData.append("file", image.file)
            });
            imagesToDelete && formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
            formData.append("premium", JSON.stringify(premium));

            fetch(`http://${IP}:5000/api/prizesList`, {
                method: "PUT",
                body: formData,
            })
                .then(async (res) => {
                    if (!res.ok) {
                        const errorDetails = await res.text();
                        console.error("Server response:", errorDetails);
                        setSavedMsg("Error updating prize.")
                        throw new Error("Failed to update prize.");
                    }
                    setSavedMsg("Prize successfully updated!")
                })
                .catch((err) => console.error(err));
        }
    };
    // Add new prize  
    const handleSubmitPrize = () => {
        if (
            !prizeData.name ||
            !prizeData.price ||
            prizeData.price <= 0 ||
            !prizeData.quantity ||
            prizeData.visible === null ||
            !prizeData.description
        ) {
            console.error("INVALID DATA!!");
        } else {
            const formData = new FormData();
    
            formData.append("data", JSON.stringify(prizeData));
            prizeData.imagesPaths.forEach(image => {
                image.file && formData.append("file", image.file)
            });
            formData.append("premium", JSON.stringify(premium))

            fetch(`http://${IP}:5000/api/prizesList`, {
                method: "POST",
                body: formData,
            })
                .then(async (res) => {
                    if (!res.ok) {
                        const errorDetails = await res.text();
                        console.error("Server response:", errorDetails);
                        throw new Error("Failed to add new prize.");
                    }
                    console.log("YIPPEEEE!!!");
                    handleClose();
                    location.reload();
                })
                .catch((err) => console.error(err));
        }
    };

    // Delete prize 
    const handleDeletePrize = () => {
        confirm(`Delete ${prize?.name}?`) &&
            fetch(`http://${IP}:5000/api/prizesList`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ premium: premium, id: prize?.id }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        const errorDetails = await res.text();
                        console.error("Server response:", errorDetails);
                        throw new Error("Failed to delete prize.");
                    }
                    handleClose();
                    location.reload();
                })
                .catch((err) => {
                    console.error("Error details:", err);
                });
    };

    console.log(prizeData.visible);
    return (
        <>
            <div className="overlay-background" onClick={handleClose}></div>
            <div className="prize-editor-popup overlay">
                <h3>{editing ? "Edit Prize" : "Add New Prize"}</h3>
                <div className="prize-editor-form-container">
                    <form
                        className="prize-editor-form"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <label>
                            Item Name
                            <input
                                value={prizeData.name}
                                onChange={(e) =>
                                    handleFieldChange("name", e.target.value)
                                }
                            />
                        </label>
                        <label>
                            Price
                            <input
                                type="number"
                                min="1"
                                value={prizeData.price}
                                onChange={(e) =>
                                    handleFieldChange("price", parseFloat(e.target.value))
                                }
                            />
                        </label>
                        <label>
                            Unit
                            <select
                                value={prizeData.unit}
                                onChange={(e) =>
                                    handleFieldChange("unit", e.target.value)
                                }
                            >
                                <option>Silver</option>
                                <option>Gold</option>
                                <option>Obsidian</option>
                            </select>
                        </label>
                        <label>
                            Quantity
                            <input
                                type="number"
                                min="1"
                                value={prizeData.quantity}
                                onChange={(e) =>
                                    handleFieldChange("quantity", parseInt(e.target.value))
                                }
                            />
                        </label>
                        <label>
                            Variations
                            <p onClick={handleAddVariation} className="clickable">
                                +
                            </p>
                        </label>
                        <div className="variations-editors-container">
                            {prizeData.variations.map((variation) => (
                                <VariationsEditor
                                    key={variation.id}
                                    id={variation.id}
                                    value={variation.variation}
                                    handleUpdate={handleUpdateVariation}
                                    handleDelete={handleDeleteVariation}
                                />
                            ))}
                        </div>
                        <label>
                            Visibility
                            <label className="radio">
                                Visible
                                <input
                                    type="radio"
                                    name="visibility"
                                    checked={prizeData.visible}
                                    onChange={() => handleFieldChange("visible", true)}
                                />
                            </label>
                            <label className="radio">
                                Invisible
                                <input
                                    type="radio"
                                    name="visibility"
                                    checked={!prizeData.visible}
                                    onChange={() => handleFieldChange("visible", false)}
                                />
                            </label>
                        </label>
                        <label>Description</label>
                        <textarea
                            value={prizeData.description}
                            onChange={(e) => handleFieldChange("description", e.target.value)}
                            rows={10}
                        />
                        <label>
                            Images
                            <p onClick={handleAddImage} className="clickable">+</p>
                        </label>
                        {prizeData.imagesPaths.map((img) => (
                            <ImagePreview
                                key={img.id}
                                {...img}
                                handleDelete={handleDeleteImagePreview}
                                handleFileChange={handleFileChange}
                            />
                        ))}
                    </form>
                </div>
                {editing ? (
                    <div className="btn-container">
                        <button onClick={handleUpdatePrize}>Update</button>
                        <button
                            onClick={handleDeletePrize}
                            className="delete-prize-btn"
                        >
                            Delete
                        </button>
                    </div>
                ) : (
                    <button onClick={handleSubmitPrize}>Submit</button>
                )}
                <span
                    className="material-symbols-outlined close-btn clickable"
                    onClick={handleClose}
                >
                    close
                </span>
                <p>{savedMsg}</p>
            </div>
        </>
    );
}

export default PrizeEditorPopup;
