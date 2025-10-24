import { useState, useEffect } from "react";

import { STATUS } from "../data.ts"

import "./QueueItem.css";

interface QueueItemProps {
    id: number;
    firstName: string;
    lastName: string;
    printName: string;
    status: string;
}

function QueueItem({ id, firstName, lastName, printName, status }: QueueItemProps) {
    const [statusLabel, setStatusLabel] = useState("");
    const [statusExpanded, setStatusExpanded] = useState("");

    useEffect(() => {
        if (typeof status === "number") {
            setStatusLabel(status);
            setStatusExpanded(`${status} in queue`)
        } else {
            switch (status) {
                case STATUS.Processing:
                    setStatusLabel("P");
                    setStatusExpanded("Printing");
                    break;
                case STATUS.Completed:
                    setStatusLabel("✓");
                    setStatusExpanded("Ready");
                    break;
                case STATUS.PaymentRequired:
                    setStatusLabel("$");
                    setStatusExpanded("$ Needed")
                    break;
                case STATUS.Denied:
                    setStatusLabel("X");
                    setStatusExpanded("Denied")
                    break;
                case STATUS.Pending:
                    setStatusLabel("?");
                    setStatusExpanded("Received")
                    break;
                case STATUS.InQueue:
                    setStatusLabel("#");
                    setStatusExpanded("In Queue")
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
                <div className="status-section">
                    {status === STATUS.Delivered ? <span className='material-symbols-outlined status-label'>check</span>
                        : status === STATUS.Denied ? <span className='material-symbols-outlined status-label'>close</span>
                        : <div className="status-label">{statusLabel}</div>
                    }
                    <div className="status-expanded">{statusExpanded}</div>
                </div>
                <div className="label-section">
                    <h2>{`${firstName} ${lastName}`}</h2>
                    <p><strong>Print ID </strong>{id}</p>
                    <p><strong>Print Name </strong>{printName}</p>
                </div>
            </div>
        </div>
    );
}

export default QueueItem;
