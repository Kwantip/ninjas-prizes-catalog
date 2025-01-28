import { useState, useEffect } from "react";

import "./RequestManager.css";

import { IP } from "../App";

export interface RequestManagerProps {
    id: string;
    firstName: string;
    lastInitial: string;
    printName: string;
    linkToPrint: string | null;
    color: string;
    note: string;
    status: string | number;
    receivedDate: string;
    animating: boolean;
    printerAvailable: boolean;
    handleClick: () => void;
    updateStatus: (id: string, newStatus: string | number, adjustQueue: boolean) => void;
}

function RequestManager({ id, firstName, lastInitial, printName, linkToPrint, status, animating, printerAvailable, handleClick, updateStatus }: RequestManagerProps) {
    const [statusQuestion, setStatusQuestion] = useState("");
    const [statusLabel, setStatusLabel] = useState("");
    const [showQuestion, setShowQuestion] = useState(true);
    const [queueLength, setQueueLength] = useState<number>(0);
    const [disableNo, setDisableNo] = useState(false);

    useEffect(() => {
        if (typeof status === "number") {
            setStatusLabel(`#${status} in Queue`);
            if (printerAvailable && status === 1) {
                setShowQuestion(true);
                setStatusQuestion("Start printing?")
            } else {
                setShowQuestion(false);
            }
        } else {
            switch (status) {
                case "Printing":
                    setStatusLabel("Printing");
                    setStatusQuestion("Finished printing?");
                    setDisableNo(true);
                    break;
                case "Completed":
                    setStatusLabel("Completed");
                    setStatusQuestion("Picked-up?");
                    setDisableNo(true);
                    break;
                case "PaymentRequired":
                    setStatusLabel("Payment Required");
                    setStatusQuestion("Payment received?");
                    break;
                case "OrderDenied":
                    setStatusLabel("Order Denied");
                    setStatusQuestion("Notified Ninja?");
                    setDisableNo(true);
                    break;
                case "Received":
                    setStatusLabel("Received");
                    setStatusQuestion("Accept order?");
                    break;
                case "Reopened":
                    setStatusLabel("Reopened");
                    setShowQuestion(false);
                    break;
                default:
                    break;
            }
        }
    }, [status, printerAvailable]);
    useEffect(() => {
        fetch(`http://${IP}:5000/api/queueLength`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(setQueueLength)
            .catch((error) => {
                console.error("Error getting queue length:", error);
            });
    },[]);

    const handleYes = () => {
        let newStatus = status;
        let adjustQueue = false;
        switch (status) {
            case "Received": // Accept request?
                newStatus = "PaymentRequired";
                break;
            case "PaymentRequired": // Payment received?
                newStatus = queueLength;
                break;
            case 1: // Start printing?
                newStatus = "Printing";
                console.log("MEEP");
                adjustQueue = true;
                console.log("??", adjustQueue)
                break;
            case "Printing": // Finished printing?
                newStatus = "Completed";
                break;
            case "Completed": // Picked-up?
                newStatus = "Fulfilled";
                break;
            case "OrderDenied": // Notified nina?
                newStatus = "Cancelled";
                break;
            default:
                break;
        }

        console.log("HELLO", adjustQueue);
        updateStatus(id, newStatus, adjustQueue);
    };
    const handleNo = () => {
        let adjustQueue = false;
        if (status === 1) {
            adjustQueue = true;
        }
        updateStatus(id, "OrderDenied", adjustQueue);
    };

    return (
        <div className={`request-manager ${animating ? "animating" : ""}`}>
            <div className="status-section">
                <h4>{statusLabel}</h4>
            </div>
            <div className="details-section">
                <h4>{`${firstName} ${lastInitial}.`}</h4>
                <p><strong>ID: </strong>{id}</p>
            </div>
            <div className="print-details-section">
                {linkToPrint ? (
                    <>
                        <h4>{printName}</h4>
                        <button onClick={() => {window.open(linkToPrint, "_blank")}}>View Print</button>
                    </>
                ) : (
                    <h4>{printName}</h4>
                )}
            </div>
            {showQuestion ? (
                <div className="update-status-section">
                    <p>{statusQuestion}</p>
                    <div className="yes-no">
                        <span className="material-symbols-outlined clickable" onClick={handleYes}>check</span>
                        {!disableNo && <span className="material-symbols-outlined clickable" onClick={handleNo}>close</span>}
                    </div>
                </div>
                ) : (
                <div>
                </div>
            )}
            <span className="material-symbols-outlined clickable" onClick={handleClick}>more_vert</span>
        </div>
    );
}

export default RequestManager;