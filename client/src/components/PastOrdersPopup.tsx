import { useState, useEffect } from "react";

import "./PastOrdersPopup.css";

import { IP } from "../App";

interface PastOrdersProps {
    id: string;
    firstName: string;
    lastInitial: string;
    printName: string;
    status: string;
    fulfilledDate: string;
    handleReopen: (id: string) => void;
}
function PastOrders({ id, firstName, lastInitial, printName, status, fulfilledDate, handleReopen }: PastOrdersProps) {

    return (
        <div className="past-order">
            <h4>{printName}</h4>
            <div className="detail1">
                <p><strong>Ninja Name: </strong>{`${firstName} ${lastInitial}.`}</p>
                <p><strong>ID: </strong>{id}</p>
            </div>
            <div className="detail2">
                <p><strong>Status: </strong>{status}</p>
                <p><strong>Fulfilled Date: </strong>{fulfilledDate}</p>
            </div>
            <button onClick={() => handleReopen(id)}>Reopen</button>
        </div>
    )
}
interface PastOrdersPopupProps {
    handleClose: () => void;
}
function PastOrdersPopup({ handleClose }: PastOrdersPopupProps) {
    const [pastOrdersList, setPastOrdersList] = useState<{
        id: string;
        firstName: string;
        lastInitial: string;
        printName: string;
        linkToPrint: string;
        color: string;
        notes: string;
        status: string;
        fulfilledDate: string;
    }[]>([]);
    const [increment, setIncrement] = useState(1);
    const [isEndOfListVisible, setEndOfListVisible] = useState(false);

    const handleLoadMore = () => {
        setIncrement(increment + 1);
    }
    const handleReopen = (id: string) => {
        confirm(`Reopen order?`) &&
        fetch(`http://${IP}:5000/api/reopenOrder`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id: id})
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://${IP}:5000/api/pastOrders?increment=${increment}`);
                const data = await res.json();
    
                setPastOrdersList(prev => {
                    const newItems = data.dataChunk.filter(
                        (item:any) => !prev.some(prevItem => prevItem.id === item.id)
                    );
                    return [...prev, ...newItems];
                });
                setEndOfListVisible(data.endOfList);
            } catch (error) {
                console.error('Error fetching past orders:', error);
            }
        };
    
        fetchData();
    }, [increment]);

    return (
        <>
            <div className="overlay-background" onClick={handleClose}></div>
            <div className="overlay past-orders-popup">
                <h1>Past Orders</h1>
                <div className="items-section">
                    {pastOrdersList.map((item) => (
                        <PastOrders
                            key={item.id}
                            id={item.id}
                            firstName={item.firstName}
                            lastInitial={item.lastInitial}
                            printName={item.printName}
                            status={item.status}
                            fulfilledDate={item.fulfilledDate}
                            handleReopen={() => handleReopen(item.id)}
                        />
                    ))}
                </div>
                {isEndOfListVisible ? (
                    <p>End of list</p>
                ) : (
                    <button onClick={handleLoadMore}>Load More</button>
                )}
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

export default PastOrdersPopup;