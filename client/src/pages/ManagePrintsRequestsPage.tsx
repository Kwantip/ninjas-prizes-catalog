import { useState, useEffect } from "react";
import { useSearchParams } from "react-router"

import { FilterSection } from "../components/FilterSection";
import RequestManager from "../components/RequestManager";
import DetailedRequestPopup from "../components/DetailedRequestPopup";
import PastOrdersPopup from "../components/PastOrdersPopup";

import { IP } from "../App";

import "./ManagePrintsRequestsPage.css";
import { STATUS, Order } from "../data";

function ManagePrintsRequestsPage() {
    const [searchParams, setSearchParams] = useSearchParams({});

    const [requestsList, setRequestsList] = useState<Order[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<Order>();

    // const [isAnimating, setIsAnimating] = useState(false);
    
    const [isDetailedPopupVisible, setIsDetailedPopupVisible] = useState(false);
    const [isPastOrdersPopupVisible, setPastOrdersPopupVisible] = useState(false);
    
    const handleClick = (orderContent: Order) => {
        setSelectedRequest(orderContent)
        setIsDetailedPopupVisible(true);
        window.scrollTo(0, 0);
        document.body.classList.add("no-scroll");
    }

    const handleClose = (type: string) => {
        if (type === "detailedRequest") {
            setIsDetailedPopupVisible(false);
        } else if (type === "pastOrders") {
            setPastOrdersPopupVisible(false);
        }
        document.body.classList.remove("no-scroll");
    };

    const handleOpenPastOrders = () => {
        setPastOrdersPopupVisible(true);
        document.body.classList.add("no-scroll");
        window.scrollTo(0, 0);
    }

    useEffect(() => {
        fetch(`http://${IP}:8080/orders?exclude_status=DELIVERED&${searchParams}`)
            .then((res) => res.json())
            .then(setRequestsList)
            .catch((err) => console.error("Failed to fetch prints queue: ", err));
    }, [searchParams]);

    const buttons: { name: string, filter: string[]}[] = [
        {name: "New Order", filter: [STATUS.Pending]}, 
        {name: "Notify Ninja", filter: [STATUS.PaymentRequired, STATUS.Completed, STATUS.Denied]}, 
        {name: "Print Queue", filter: [STATUS.InQueue, STATUS.Processing]},
        {name: "Completed", filter: [STATUS.Completed]}
    ];

    return (
        <main className="manage-requests-page">
            <h1>Prints Requests Manager</h1>
            <FilterSection
                filterButtons={buttons}
                onFilterApplied={setSearchParams}
                />
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
                {
                    requestsList.map((item) => (
                        <RequestManager
                            key={item.id}
                            order={item}
                            // animating={isAnimating}
                            handleClick={() => handleClick(item)}
                        />
                    ))
                }
            </div>
            <div className="overlay-area">
                {isDetailedPopupVisible && selectedRequest && <DetailedRequestPopup handleClose={() => {handleClose("detailedRequest")}} request={selectedRequest}/>}
                {isPastOrdersPopupVisible && <PastOrdersPopup handleClose={() => {handleClose("pastOrders")}} />}
            </div>
        </main>
    )
}

export default ManagePrintsRequestsPage;