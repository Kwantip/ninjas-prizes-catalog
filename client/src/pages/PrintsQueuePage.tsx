import { useState, useEffect } from "react";

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
    const [filteredPrintsQueue, setFilteredPrintsQueue] = useState<{
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
    const [filterApplied, setFilterApplied] = useState(false);
    const [currentFilterField, setCurrentFilterField] = useState<string>("");

    useEffect(() => {
        fetch(`http://${IP}:5000/api/printsQueue`)
            .then((res) => res.json())
            .then(setPrintsQueue)
            .catch((err) => console.error("Failed to fetch prints queue: ", err));
    }, []);

    const clearFilter = () => {
        document.getElementById("filter-action-required-btn")?.classList.remove("selected");
        document.getElementById("filter-completed-prints-btn")?.classList.remove("selected");
        document.getElementById("filter-print-in-queue-btn")?.classList.remove("selected");

        setFilterApplied(false);
    }

    const applyFilter = (filterField: string) => {
        clearFilter();
        if (filterApplied && currentFilterField === filterField) {
            setFilterApplied(false);
        } else {
            setFilterApplied(true);
            setCurrentFilterField(filterField);
            switch (filterField) {
                case "Action Required":
                    setFilteredPrintsQueue(printsQueue.filter((item) => item.status === "Completed" || item.status === "PaymentRequired"));
                    document.getElementById("filter-action-required-btn")?.classList.add("selected");
                    break;
                case "Completed Prints":
                    setFilteredPrintsQueue(printsQueue.filter((item) => item.status === "Completed"));
                    document.getElementById("filter-completed-prints-btn")?.classList.add("selected");
                    break;
                case "Print Queue":
                    setFilteredPrintsQueue(printsQueue.filter((item) => item.status === "Printing" || typeof item.status === "number"));
                    document.getElementById("filter-print-in-queue-btn")?.classList.add("selected");
                    break;
                default:
                    const searchField = filterField.toLowerCase()
                    setFilteredPrintsQueue(printsQueue.filter((item) => item.firstName.toLowerCase().includes(searchField) || item.id.toLowerCase().includes(searchField) || `${item.firstName} ${item.lastInitial}`.toLowerCase().includes(searchField) || item.printName.toLowerCase().includes(searchField)));
                    break;
                }
        }
    };

    return (
        <main className="prints-queue-page">
            <div className="gradient"></div>
            <h1>Prints Queue</h1>
            <div className="filter-area">
                <h4>Filter</h4>
                <div className="filters-container">
                    <p className="clickable" id="filter-action-required-btn" onClick={() => applyFilter("Action Required")}>Action Required</p>
                    <p className="clickable" id="filter-completed-prints-btn" onClick={() => applyFilter("Completed Prints")}>Completed Prints</p>
                    <p className="clickable" id="filter-print-in-queue-btn" onClick={() => applyFilter("Print Queue")}>Prints in Queue</p>
                    {filterApplied && <span className="material-symbols-outlined clickable" onClick={clearFilter}>close</span>}
                </div>
                <form>
                    <input type="text" onChange={(e) => {applyFilter(e.target.value)}} placeholder="Search by name, print name, or ID" />
                    <span className="material-symbols-outlined clickable">close</span>
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
                {!filterApplied ? (
                    printsQueue.filter((item) => item.status !== "Reopened").map((item) => (
                        <QueueItem key={item.id} {...item} />
                    ))
                ) : (
                    filteredPrintsQueue.map((item) => (
                        <QueueItem key={item.id} {...item} />
                    ))
                )}
            </div>
        </main>
    )
}

export default PrintsQueuePage;