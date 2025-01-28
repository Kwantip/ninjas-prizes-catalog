import { useState, useEffect, useCallback } from "react";

import RequestManager, {RequestManagerProps} from "../components/RequestManager";
import DetailedRequestPopup from "../components/DetailedRequestPopup";
import PastOrdersPopup from "../components/PastOrdersPopup";

import { IP } from "../App";

import "./ManagePrintsRequestsPage.css";

function ManagePrintsRequestsPage() {
    const [requestsList, setRequestsList] = useState<{
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
        printerAvailable: boolean;
    }[]>([]);
    const [filteredRequestsList, setFilteredRequestsList] = useState<{
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
        printerAvailable: boolean;
    }[]>([]);
    const [filterApplied, setFilterApplied] = useState(false);
    const [currentFilterField, setCurrentFilterField] = useState<string>("");
    const [isAnimating, setIsAnimating] = useState(false);
    const [isDetailedRequestPopupVisible, setDetailedRequestPopupVisible] = useState(false);
    const [isPastOrdersPopupVisible, setPastOrdersPopupVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<Omit<RequestManagerProps, "handleClick" | "updateQueue" | "updateStatus">>({
        id: "DAL00",
        firstName: "Fake",
        lastInitial: "N",
        printName: "Fake Print",
        linkToPrint: null,
        color: "Random",
        note: "FAKE REQUEST",
        status: "OrderDenied",
        receivedDate: "meep",
        animating: false,
        printerAvailable: false
    });
    const [isPrinterFree, setIsPrinterFree] = useState<boolean>(true);

    const applyFilter = (filterField: string) => {
        document.getElementById("filter-new-order-btn")?.classList.remove("selected");
        document.getElementById("filter-notify-ninja-btn")?.classList.remove("selected");
        document.getElementById("filter-print-queue-btn")?.classList.remove("selected");
        document.getElementById("filter-completed-btn")?.classList.remove("selected");

        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);

        if (filterApplied && currentFilterField === filterField) {
            setFilterApplied(false);
        } else {
            setFilterApplied(true);
            setCurrentFilterField(filterField);
            switch (filterField) {
                case "New Order":
                    setFilteredRequestsList(requestsList.filter((item) => item.status === "Received"));
                    document.getElementById("filter-new-order-btn")?.classList.add("selected");
                    break;
                case "Notify Ninja":
                    setFilteredRequestsList(requestsList.filter((item) => item.status === "PaymentRequired" || item.status === "Completed" || item.status === "OrderDenied"));
                    document.getElementById("filter-notify-ninja-btn")?.classList.add("selected");
                    break;
                case "Print Queue":
                    setFilteredRequestsList(requestsList.filter((item) => item.status === "Printing" || typeof item.status === "number"));
                    document.getElementById("filter-print-queue-btn")?.classList.add("selected");
                    break;
                case "Completed":
                    setFilteredRequestsList(requestsList.filter((item) => item.status === "Completed"));
                    document.getElementById("filter-completed-btn")?.classList.add("selected");
                    break;
                default:
                    const searchField = filterField.toLowerCase()
                    setFilteredRequestsList(requestsList.filter((item) => item.firstName.toLowerCase().includes(searchField) || item.id.toLowerCase().includes(searchField) || `${item.firstName} ${item.lastInitial}`.toLowerCase().includes(searchField) || item.printName.toLowerCase().includes(searchField)));
                    break;
            }
        }
    };

    const handleClose = (type: string) => {
        if (type === "detailedRequest") {
            setDetailedRequestPopupVisible(false);
        } else if (type === "pastOrders") {
            setPastOrdersPopupVisible(false);
        }
        document.body.classList.remove("no-scroll");
    };
    const handleClick = (request: Omit<RequestManagerProps, "handleClick" | "updateQueue" | "updateStatus">) => {
        setSelectedRequest(request);
        setDetailedRequestPopupVisible(true);
        window.scrollTo(0, 0);
        document.body.classList.add("no-scroll");
    };
    const handleUpdateStatus = useCallback((id: string, newStatus: string | number, adjustQueue: boolean) => {
        let reqBody = [{id: id, field: "status", value: newStatus}];
        console.log(adjustQueue)
        if (adjustQueue) {
            requestsList.filter((item) => typeof item.status === "number" && item.status > 1)
                .forEach((queueItem) => {
                    let newQueueNum = 0;
                    if (typeof queueItem.status === "number") {
                        newQueueNum = queueItem.status - 1;
                    }
                    reqBody.push({id: queueItem.id, field: "status", value: newQueueNum})
            });
        }
        if (newStatus === "Fulfilled" || newStatus === "Cancelled") {
            fetch(`http://${IP}:5000/api/updateStatus`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqBody),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        const errorDetails = await res.text();
                        console.error("Server response: ", errorDetails);
                        throw new Error("Failed to update status");
                    }
                })
                .catch((error) => {
                    console.error("Error details: ", error);
                });
        } else {
            fetch(`http://${IP}:5000/api/updateStatus`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqBody),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        const errorDetails = await res.text();
                        console.error("Server response: ", errorDetails);
                        throw new Error("Failed to update status");
                    }
                })
                .catch((error) => {
                    console.error("Error details: ", error);
                });
        }
    }, [requestsList]);
    const handleOpenPastOrders = () => {
        setPastOrdersPopupVisible(true);
        document.body.classList.add("no-scroll");
        window.scrollTo(0, 0);
    }

    useEffect(() => {
        fetch(`http://${IP}:5000/api/printsQueue`)
            .then((res) => res.json())
            .then(setRequestsList)
            .catch((err) => console.error("Failed to fetch prints queue: ", err));
    }, [isPrinterFree, handleUpdateStatus]);

    useEffect(() => {
        const printerStatus = requestsList.find((item) => item.status === "Printing");
        setIsPrinterFree(printerStatus ? false : true);
    }, [requestsList]);

    return (
        <main className="manage-requests-page">
            <h1>Prints Requests Manager</h1>
            <div className="filter-area">
                <h4>Filter</h4>
                <div className="filters-container">
                    <p className="clickable" id="filter-new-order-btn" onClick={() => applyFilter("New Order")}>New Orders</p>
                    <p className="clickable" id="filter-notify-ninja-btn" onClick={() => applyFilter("Notify Ninja")}>Notify Ninja</p>
                    <p className="clickable" id="filter-print-queue-btn" onClick={() => applyFilter("Print Queue")}>Print Queue</p>
                    <p className="clickable" id="filter-completed-btn" onClick={() => applyFilter("Completed")}>Completed Prints</p>
                </div>
                <form>
                    <input type="text" onChange={(e) => applyFilter(e.target.value)} placeholder="Search by name, print name, or ID" />
                    <span className="material-symbols-outlined clickable">close</span>
                </form>
            </div>
            <div className="btns-area">
                <button onClick={handleOpenPastOrders}>Past Orders</button>
            </div>
            <div className="labels-area">
                <h4>Status</h4>
                <h4>Details</h4>
                <h4>Prints Details</h4>
                <h4>Update Status</h4>
                <h4>.</h4>
            </div>
            <div className={`request-managers-container`}>
                {!filterApplied ? (
                    requestsList.map((item) => (
                        <RequestManager
                            key={item.id}
                            {...item}
                            animating={isAnimating}
                            printerAvailable={isPrinterFree}
                            handleClick={() => handleClick(item)}
                            updateStatus={handleUpdateStatus}
                        />
                    ))
                ) : (
                    filteredRequestsList.map((item) => (
                        <RequestManager
                            key={item.id}
                            {...item}
                            animating={isAnimating}
                            printerAvailable={isPrinterFree}
                            handleClick={() => {handleClick(item)}}
                            updateStatus={handleUpdateStatus}
                        />
                    ))
                )}
            </div>
            <div className="overlay-area">
                {isDetailedRequestPopupVisible && <DetailedRequestPopup handleClose={() => {handleClose("detailedRequest")}} request={selectedRequest}/>}
                {isPastOrdersPopupVisible && <PastOrdersPopup handleClose={() => {handleClose("pastOrders")}} />}
            </div>
        </main>
    )
}

export default ManagePrintsRequestsPage;