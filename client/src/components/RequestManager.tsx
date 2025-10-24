import { useEffect, useState } from "react";

import "./RequestManager.css";

import { AsyncOrder } from "../OrderState";
import { STATUS, Order } from "../data.ts"

import axios from "axios";

export interface RequestManagerProps {
    order: Order;
    // animating: boolean;
    handleClick: () => void;
}

function RequestManager({ order, handleClick}: RequestManagerProps) {
    const [status, setStatus] = useState(order.status);
    const [statusQuestion, setStatusQuestion] = useState("");
    const [disableNo, setDisableNo] = useState(false);

    const [orderStateItem] = useState(new AsyncOrder(order.id))

    // initialize and update status 
    useEffect(() => {
        let question = ""
        switch (status) {
            case STATUS.Pending:
                question = "Accept order?";
                setDisableNo(false);
                break;
            case STATUS.PaymentRequired:
                question = "Payment received?";
                setDisableNo(false);
                break;
            case STATUS.InQueue:
                question = "Start printing?";
                setDisableNo(false);
                break;
            case STATUS.Processing:
                question = "Finished printing?";
                setDisableNo(false);
                break;
            case STATUS.Completed:
                question = "Picked-up?";
                setDisableNo(false);
                break;
            case STATUS.Denied:
                question = "Notified Ninja?";
                setDisableNo(true);
                break;
            default:
                question = status + "?";
                break;
        }
        setStatusQuestion(question)
    }, [status]);

    function handleUpdateStatus(id: number, newStatus: string) {
        // PATCH to order and POST order history
        axios.patch(`http://localhost:8080/orders/${id}`, { status: newStatus })
            .then(res => {
                console.log(res)
                // navigate('/prizes-manager')
                const data = res.data;
                console.log("Request received with ID: ", data.id);
            })
            .catch(err => console.log(err))

        // TODO: POST queue item
        // if (newStatus === STATUS.InQueue)
        // {
        //     axios.post(`http://localhost:8080/orders/queue-item`, { })
        //     .then(res => {
        //         console.log(res)
        //         // navigate('/prizes-manager')
        //         const data = res.data;
        //         console.log("Request received with ID: ", data.id);
        //     })
        //     .catch(err => console.log(err))
        // }   
    }

    useEffect(() => {
        // if status is not pending, set order state
        orderStateItem.setStateByStatus(order.status)
    }, []);

    function handleYes() {
        orderStateItem?.accept();

        const orderStatus = orderStateItem?.getCurrentState().getName();

        if (orderStatus)
        {
            handleUpdateStatus(order.id, orderStatus)
            setStatus(orderStatus)
        }
    };
    const handleNo = () => {
        orderStateItem?.deny();

        const orderStatus = orderStateItem?.getCurrentState().getName();

        if (orderStatus)
        {
            handleUpdateStatus(order.id, orderStatus)
            setStatus(orderStatus)
        }
    };

    const handleRetry = () => {
        orderStateItem?.retry();

        const orderStatus = orderStateItem?.getCurrentState().getName();

        if (orderStatus)
        {
            handleUpdateStatus(order.id, orderStatus)
            setStatus(orderStatus)
        }
    };

    return (
        <div className={`request-manager`}>
            <div className="status-section">
                <h4>{status}</h4>
            </div>
            <div className="details-section">
                <h4>{`${order.first_name} ${order.last_name}`}</h4>
                <p><strong>ID: </strong>{order.id}</p>
            </div>
            <div className="print-details-section">
                <h4>{order.print_name}</h4>
                {order.link_to_item && <button onClick={() => {window.open(order.link_to_item, "_blank")}}>View Print</button>}
            </div>
                <div className="update-status-section">
                    <p>{statusQuestion}</p>
                    <div className="yes-no">
                        <span className="material-symbols-outlined clickable" onClick={handleYes}>check</span>
                        {disableNo && <span className="material-symbols-outlined clickable" onClick={handleRetry}>retry</span>}
                        {!disableNo && <span className="material-symbols-outlined clickable" onClick={handleNo}>close</span>}
                    </div>
                </div>
            <span className="material-symbols-outlined clickable" onClick={handleClick}>more_vert</span>
        </div>
    );
}

export default RequestManager;