import { useState, useEffect } from "react";

import "./QueueItem.css";

interface QueueItemProps {
    id: string;
    firstName: string;
    lastInitial: string;
    printName: string;
    linkToPrint: string | null;
    color: string;
    note: string;
    status: string | number;
    receivedDate: string;
}

function QueueItem({ id, firstName, lastInitial, printName, status }: QueueItemProps) {
    const [statusLabel, setStatusLabel] = useState("");
    const [statusExpanded, setStatusExpanded] = useState("");

    useEffect(() => {
        if (typeof status === "number") {
            setStatusLabel(status.toString());
            setStatusExpanded(`${status} in queue`)
        } else {
            switch (status) {
                case "Printing":
                    setStatusLabel("P");
                    setStatusExpanded("Printing");
                    break;
                case "Completed":
                    setStatusLabel("✓");
                    setStatusExpanded("Ready");
                    break;
                case "PaymentRequired":
                    setStatusLabel("$");
                    setStatusExpanded("$ Required")
                    break;
                case "OrderDenied":
                    setStatusLabel("X");
                    setStatusExpanded("Denied")
                    break;
                case "Received":
                    setStatusLabel("?");
                    setStatusExpanded("Received")
                    break;
                default:
                    setStatusLabel("ERROR");
                    break;
            }
        }
    }, [status]);

    return (
        <div className="queue-item">
            <div className="detail-section">
                <div className="label-section">
                    {status === "Completed" ? <span className='material-symbols-outlined status-label'>check</span>
                        : status === "OrderDenied" ? <span className='material-symbols-outlined status-label'>close</span>
                        : <div className="status-label">{statusLabel}</div>
                    }
                    <div className="status-expanded">{statusExpanded}</div>
                </div>
                <h2>{`${firstName} ${lastInitial}.`}</h2>
                <p><strong>Print ID </strong>{id}</p>
                <p><strong>Print Name </strong>{printName}</p>
            </div>
        </div>
    );
}

export default QueueItem;
