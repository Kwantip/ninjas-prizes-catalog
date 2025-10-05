import { useState, useEffect } from "react";
import { useSearchParams } from "react-router"

import { IP } from "../App";

import QueueItem from "../components/QueueItem";

import "./PrintsQueuePage.css";

function PrintsQueuePage() {
    const [printsQueue, setPrintsQueue] = useState<{
        id: string
        firstName: string;
        lastInitial: string;
        printName: string;
        linkToPrint: string | null;
        color: string;
        note: string;
        status: string | number;
        receivedDate: string
    }[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const [filterApplied, setFilterApplied] = useState(false);

    useEffect(() => {
        // TODO: GET orders

        fetch(`http://${IP}:5000/api/printsQueue?${searchParams}`)
            .then((res) => res.json())
            .then(setPrintsQueue)
            .catch((err) => console.error("Failed to fetch prints queue: ", err));
    }, [searchParams]);

    const clearFilter = () => {
        setSearchParams({});

        document.getElementById("filter-action-required-btn")?.classList.remove("selected");
        document.getElementById("filter-completed-prints-btn")?.classList.remove("selected");
        document.getElementById("filter-print-in-queue-btn")?.classList.remove("selected");

        setFilterApplied(false);
    }

    const applyFilter = (filterField: string, filterValue: string[], filterButton?: string) => {
        clearFilter()
        
        if (filterValue.length > 0)
        {
            switch(filterField)
            {
                case "status":
                    setSearchParams({ status: filterValue })
                    break;
                case "search": 
                    setSearchParams({ search: filterValue })
                    break;
            }

            if (filterButton)
            {
                document.getElementById(filterButton)?.classList.add("selected");
            }

            setFilterApplied(true);
        }
    };

    return (
        <main className="prints-queue-page">
            <h1>Prints Queue</h1>
            <div className="filter-area">
                <h4>Filter</h4>
                <div className="filters-container">
                    <p className="clickable" id="filter-action-required-btn" onClick={() => applyFilter("status", ["PaymentRequired", "Completed"], "filter-action-required-btn")}>Action Required</p>
                    <p className="clickable" id="filter-completed-prints-btn" onClick={() => applyFilter("status", ["Completed"], "filter-completed-prints-btn")}>Completed Prints</p>
                    <p className="clickable" id="filter-print-in-queue-btn" onClick={() => applyFilter("status", ["InQueue", "Printing"], "filter-print-in-queue-btn")}>Prints in Queue</p>
                    {filterApplied && <span className="material-symbols-outlined clickable" onClick={clearFilter}>close</span>}
                </div>
                <form>
                    <input type="text" onChange={(e) => {applyFilter("search", [e.target.value])}} placeholder="Search by name, print name, or ID" />
                    <span className="material-symbols-outlined clickable" onClick={clearFilter}>close</span>
                </form>
            </div>            
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
                    printsQueue.filter((item) => item.status !== "Reopened").map((item) => (
                        <QueueItem key={item.id} {...item} />
                    ))
                }
            </div>
        </main>
    )
}

export default PrintsQueuePage;