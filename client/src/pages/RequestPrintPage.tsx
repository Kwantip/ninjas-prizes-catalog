import { useState, useEffect } from "react";

import Step from "../components/Step";

import { OrderRequest, Color } from "../data.ts"

import "./RequestPrintPage.css";

import { IP } from "../App";
import axios from "axios";

function RequestPrintPage() {
    const [contClicked, setContClicked] = useState(false);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [availableColors, setAvailableColors] = useState<Color[]>([]);
    const [requestData, setRequestData] = useState<OrderRequest>({
        first_name: '',
        last_name: '',
        print_name: '',
        link_to_item: '',
        color: '',
        notes: ''
    });
    const [id, setId] = useState("Ewwor 3:");

    useEffect(() => {
        // TODO: GET Colors by isAvailable === TRUE
        fetch(`http://${IP}:8080/filament-colors?isAvailable=1`)
            .then((res) => res.json())
            .then(setAvailableColors)
            .catch((err) => console.error("Failed to fetch colors:", err));
    }, []);

    const handleContinue = () => {
        setContClicked(true);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestData.first_name || !requestData.last_name || !requestData.print_name || !requestData.link_to_item) {
            console.error("Invalid form data!!");
            return;
        }

        axios.post('http://localhost:8080/orders', requestData)
            .then(res => {
                const data = res.data;
                console.log("Request received with ID: ", data.id);
                setId(data.id);
                setContClicked(false);
                setSubmitClicked(true);
                window.scrollTo(0, 0);
            })
            .catch(err => console.log(err))
    };

    const handleAnotherRequest = () => {
        setContClicked(true);
        setSubmitClicked(false);
        window.scrollTo(0, 0);

        setRequestData({
            first_name: "",
            last_name: "",
            print_name: "",
            link_to_item: "",
            color: "Random",
            notes: "",
        });
    };
    

    if (contClicked) {
        return (
            <main>
                <h1>Submit a Custom Print Request</h1>
                <form className="prints-request-form" onSubmit={handleSubmit}>
                    <div className="input-area">
                        <label>
                            First Name*
                            <input
                                type="text"
                                value={requestData.first_name}
                                maxLength={15}
                                onChange={(e) => setRequestData({...requestData, first_name: e.target.value})}
                                required
                            />
                        </label>
                        <label>
                            Last Name*
                            <input
                                type="text"
                                value={requestData.last_name}
                                maxLength={15}
                                onChange={(e) => setRequestData({...requestData, last_name: e.target.value})}
                                required
                            />
                        </label>
                        <label>
                            Print Name*
                            <input
                                type="text"
                                value={requestData.print_name}
                                onChange={(e) => setRequestData({...requestData, print_name: e.target.value})}
                                required
                            />
                        </label>
                        <label>
                            Link to Print*
                            <input
                                type="url"
                                value={requestData.link_to_item}
                                onChange={(e) => setRequestData({...requestData, link_to_item: e.target.value})}
                                required
                            />
                        </label>
                        <label>
                            Color
                            <select
                                value={requestData.color}
                                onChange={(e) => setRequestData({...requestData, color: e.target.value})}
                            >
                                <option value="" disabled hidden>Select a color</option>
                                {availableColors.map((color) => (
                                    <option key={color.id} value={color.name}>
                                        {color.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Notes
                            <textarea
                                rows={5}
                                maxLength={500}
                                value={requestData.notes}
                                onChange={(e) => setRequestData({...requestData, notes: e.target.value})}
                            />
                        </label>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </main>
        )
    } else if (submitClicked) {
        return (
            <main className="request-submitted">
                <h1>{`${requestData.first_name} ${requestData.last_name}, your print request for ${requestData.print_name} has been submitted!`}</h1>
                <p className="id-section">
                    {`Your request ID is `}
                    <strong>{id}</strong>
                </p>
                <p>We will get back to you shortly regarding payment if your print is approved!</p>
                <button onClick={handleAnotherRequest}>Submit Another Request</button>
            </main>
        )
    } else {
        return (
            <main>
                <h1>Before Requesting a Custom Print...</h1>
                <div className="steps-container">
                    <Step stepNum={1} message="Make sure that the print fits in a 12” x 12” x 12” box."/>
                    <Step stepNum={2} message="Make sure that the print can finish printing within 30 to 60 minutes. Coins for the print will be collected accordingly."/>
                    <Step stepNum={3} message="Make sure that the content of the print is appropriate for the Dojo. Inappropriate or vulgar prints may result in loss of coins!!!"/>
                    <Step stepNum={4} message="The print may not be approved if any of these points are violated. In the case that a print is not approved, Ninja will be notified and payment will not be collected."/>
                    <Step stepNum={5} message="If the print is approved, Ninja will be notified regarding payment. Once payment is received, the print will go into the queue in the order of which they were received."/>
                    <Step stepNum={6} message="Please be patient with the prints time as there are a limited number of printers. Ninjas can check the status of their prints with the Prints Queue page."/>
                </div>
                <button onClick={handleContinue}>Continue</button>
            </main>
        )
    }
}

export default RequestPrintPage;