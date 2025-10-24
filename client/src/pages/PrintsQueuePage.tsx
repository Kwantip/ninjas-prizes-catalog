import { useState, useEffect } from "react";
import { useSearchParams } from "react-router"

import { IP } from "../App";

import { FilterSection } from "../components/FilterSection.tsx";
import QueueItem from "../components/QueueItem";

import { STATUS, Order } from "../data.ts"

import "./PrintsQueuePage.css";

function PrintsQueuePage() {
    const [printsQueue, setPrintsQueue] = useState<Order[]>([]);

    const [searchParams, setSearchParams] = useSearchParams({});

    useEffect(() => {
        fetch(`http://${IP}:8080/orders?exclude_status=DELIVERED&${searchParams}`)
            .then((res) => res.json())
            .then(setPrintsQueue)
            .catch((err) => console.error("Failed to fetch prints queue: ", err));
    }, [searchParams]);

    const buttons: { name: string, filter: string[]}[] = [
        {name: "Action Required", filter: [STATUS.PaymentRequired, STATUS.Completed]}, 
        {name: "Completed Prints", filter: [STATUS.Completed]}, 
        {name: "Prints in Queue", filter: [STATUS.InQueue, STATUS.Processing]}
    ];

    return (
        <main className="prints-queue-page">
            <h1>Prints Queue</h1>
            <FilterSection
                filterButtons={buttons}
                onFilterApplied={setSearchParams}
                />
            {/* TODO: Move to QueueTable component */}
            <div className="legends-section">
                <h4>Legend</h4>
                <ul className="legends-items">
                    <li><p><strong>P</strong> - Printing</p></li>
                    <li><p><strong>#</strong> - Order in Queue</p></li>
                    <li><p><strong><span className="material-symbols-outlined">check</span></strong> - Order Completed/Ready for Pick-Up</p></li>
                    <li><p><strong>$</strong> - Payment Required</p></li>
                    <li><p><strong><span className="material-symbols-outlined">close</span></strong> - Order Denined/Cancelled</p></li>
                    <li><p><strong>?</strong> - Order Submitted/Awaiting Approval</p></li>
                </ul>
            </div>
            <div className="queue-items-section">
                {
                    printsQueue.map((item) => (
                        <QueueItem key={item.id} 
                        id={item.id} 
                        firstName={item.first_name} 
                        lastName={item.last_name} 
                        printName={item.print_name} 
                        status={item.status} 
                        />
                    ))
                }
            </div>
        </main>
    )
}

export default PrintsQueuePage;