import { useState } from "react";
import "./DetailedRequestPopup.css";

interface DetailedRequestPopupProps {
    handleClose: () => void;
    request: {
        id: string
        firstName: string;
        lastInitial: string;
        printName: string;
        linkToPrint: string | null;
        color: string;
        note: string;
        status: string | number;
        receivedDate: string;
        animating: boolean;
    }
}

function DetailedRequestPopup({ handleClose, request }: DetailedRequestPopupProps) {
    const link = request.linkToPrint;
    const [newStatus, setNewStatus] = useState<string>("");

    const handleSave = () => {
        if (newStatus === "Fulfilled" || newStatus === "Cancelled") {
            fetch("http://localhost:5000/api/updateStatus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([{id: request.id, field: "status", value: newStatus}]),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        const errorDetails = await res.text();
                        console.error("Server response: ", errorDetails);
                        throw new Error("Failed to update status");
                    }
                    handleClose();
                })
                .catch((error) => {
                    console.error("Error details: ", error);
                });
        } else {
            fetch("http://localhost:5000/api/updateStatus", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([{id: request.id, field: "status", value: newStatus}]),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        const errorDetails = await res.text();
                        console.error("Server response: ", errorDetails);
                        throw new Error("Failed to update status");
                    }
                    handleClose();
                    location.reload();
                })
                .catch((error) => {
                    console.error("Error details: ", error);
                });
        }
    };
    return (
        <>
            <div className="overlay-background" onClick={handleClose}></div>
            <div className="overlay detailed-request-popup">
                <div className="details-section">
                    <p><strong>Name: </strong>{`${request.firstName} ${request.lastInitial}.`}</p>
                    <p><strong>ID: </strong>{request.id}</p>
                    <p><strong>Print Name: </strong>{request.printName}</p>
                    <p><strong>Color: </strong>{request.color}</p>
                    <p><strong>Status: </strong>{request.status}</p>
                        <form>
                            <p><strong>Change Status</strong></p>
                            <select value={request.status} onChange={(e) => setNewStatus(e.target.value)}>
                                {/* <option></option> */}
                                <option value="Receieved">Received</option>
                                <option value="PaymentRequired">Payment Required</option>
                                <option>In Queue</option>
                                <option value="Printing">Printing</option>
                                <option value="Completed">Finished Printing</option>
                                <option value="Fulfilled">Picked-Up</option>
                                <option value="OrderDenied">Order Denied</option>
                                <option value="Cancelled">Cancel Order</option>
                            </select>
                        </form>
                    <p><strong>Received Date: </strong>{request.receivedDate}</p>
                    <p><strong>Ninja Notes:</strong></p>
                    {request.note ? (
                        <p>{request.note}</p>
                    ) : (
                        <p>N/A</p>
                    )}
                </div>
                <div className="buttons-section">
                    {link && 
                        <button onClick={() => {window.open(link, "_blank")}}>View Print</button>}
                    <button onClick={handleSave}>Save</button>
                </div>
                <span
                    className="material-symbols-outlined close-btn clickable"
                    onClick={handleClose}
                >
                    close
                </span>
            </div>
            
        </>
    );
}

export default DetailedRequestPopup;