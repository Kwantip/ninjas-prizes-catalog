import { useState, useEffect } from "react";

import "./RequestManager.css";

import { AsyncOrder } from "../OrderState";
import { STATUS } from "../data.ts"

import { IP } from "../App";

export interface RequestManagerProps {
    orderItem: AsyncOrder | undefined
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

function RequestManager({ orderItem, id, firstName, lastInitial, printName, linkToPrint, status, animating, printerAvailable, handleClick, updateStatus }: RequestManagerProps) {
    const [statusQuestion, setStatusQuestion] = useState("Accept order?");
    const [showQuestion, setShowQuestion] = useState(true);
    const [queueLength, setQueueLength] = useState<number>(0);
    const [disableNo, setDisableNo] = useState(false);

    // initialize and update status 
    const setStatusElements = (status: string) => {
        switch (status) {
            case STATUS.Processing:
                setStatusQuestion("Finished printing?");
                break;
            case STATUS.Completed:
                setStatusQuestion("Picked-up?");
                break;
            case STATUS.PaymentRequired:
                setStatusQuestion("Payment received?");
                break;
            case STATUS.Denied:
                setStatusQuestion("Notified Ninja?");
                setDisableNo(true);
                break;
            case STATUS.Pending:
                setStatusQuestion("Accept order?");
                break;
            case STATUS.InQueue:
                setStatusQuestion("Start printing?");
                break;
            case "Reopened":
                setShowQuestion(false);
                break;
            default:
                setStatusQuestion(status + "?")
                break;
        }
    };

    useEffect(() => {
        if (typeof status === "number") {
            if (printerAvailable && status === 1) {
                setShowQuestion(true);
                setStatusQuestion("Start printing?")
            } else {
                setShowQuestion(false);
            }
        } else {
            setStatusElements(status)
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
        orderItem?.accept();

        const orderStatus = orderItem?.getCurrentState().getName();
        console.log(orderItem?.getCurrentState().getName() + " in request manager");

        if (orderStatus)
        {
            setStatusElements(orderStatus)
        }

        let newStatus = status;
        let adjustQueue = false;
        
        // console.log("HELLO", adjustQueue);
        updateStatus(id, newStatus, adjustQueue);
    };
    const handleNo = () => {
        orderItem?.deny();

        setStatusQuestion("Notified Ninja?");
        setDisableNo(true);

        // let adjustQueue = false;
        // if (status === 1) {
        //     adjustQueue = true;
        // }
        // updateStatus(id, "OrderDenied", adjustQueue);
    };

    return (
        <div className={`request-manager ${animating ? "animating" : ""}`}>
            <div className="status-section">
                <h4>{orderItem?.getCurrentState().getName()}</h4>
            </div>
            <div className="details-section">
                <h4>{`${orderItem?.getFirstName()} ${orderItem?.getLastName()}.`}</h4>
                <p><strong>ID: </strong>{orderItem?.getId()}</p>
            </div>
            <div className="print-details-section">
                {linkToPrint ? (
                    <>
                        <h4>{orderItem?.getPrintName()}</h4>
                        <button onClick={() => {window.open(linkToPrint, "_blank")}}>View Print</button>
                    </>
                ) : (
                    <h4>{orderItem?.getPrintName()}</h4>
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