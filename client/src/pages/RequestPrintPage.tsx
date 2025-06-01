import { useState, useEffect } from "react";

import Step from "../components/Step";

import "./RequestPrintPage.css";

import { IP } from "../App";

function RequestPrintPage() {
    const [contClicked, setContClicked] = useState(false);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [availableColors, setAvailableColors] = useState<{ id: number; color: string }[]>([]);
    const [requestData, setRequestData] = useState({
        id: "",
        firstName: "",
        lastInitial: "",
        printName: "",
        linkToPrint: "",
        color: "Random",
        notes: "",
        status: null,
        receivedDate: ""
    });
    const [id, setId] = useState("Ewwor 3:");

    useEffect(() => {
        fetch(`http://${IP}:5000/api/availableColors`)
            .then((res) => res.json())
            .then(setAvailableColors)
            .catch((err) => console.error("Failed to fetch colors:", err));
    }, []);

    const handleContinue = () => {
        setContClicked(true);
        window.scrollTo(0, 0);
    };

    const handleFieldChange = (field: string, value: any) => {
        setRequestData((prev) => ({ ...prev, [field]: value }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestData.firstName || !requestData.lastInitial || !requestData.printName || !requestData.linkToPrint) {
            console.error("Invalid form data!!");
            return;
        }
    
        fetch(`http://${IP}:5000/api/printsQueue`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorDetails = await res.text();
                    console.error("Server response: ", errorDetails);
                    throw new Error("Failed to submit print request.");
                }
                const data = await res.json();
                console.log("Request received with ID: ", data.id);
                setId(data.id);
                setContClicked(false);
                setSubmitClicked(true);
                window.scrollTo(0, 0);
            })
            .catch((err) => {
                console.error("Error details: ", err);
            });
    };

    const handleAnotherRequest = () => {
        setContClicked(true);
        setSubmitClicked(false);
        window.scrollTo(0, 0);

        setRequestData({
            id: "",
            firstName: "",
            lastInitial: "",
            printName: "",
            linkToPrint: "",
            color: "Random",
            notes: "",
            status: null,
            receivedDate: ""
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
                                value={requestData.firstName}
                                maxLength={15}
                                onChange={(e) => handleFieldChange("firstName", e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Last Initial*
                            <input
                                type="text"
                                value={requestData.lastInitial}
                                maxLength={1}
                                onChange={(e) => handleFieldChange("lastInitial", e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Print Name*
                            <input
                                type="text"
                                value={requestData.printName}
                                onChange={(e) => handleFieldChange("printName", e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Link to Print*
                            <input
                                type="url"
                                value={requestData.linkToPrint}
                                onChange={(e) => handleFieldChange("linkToPrint", e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Color
                            <select
                                value={requestData.color}
                                onChange={(e) => handleFieldChange("color", e.target.value)}
                            >
                                {availableColors.map((color) => (
                                    <option key={color.id} value={color.color}>
                                        {color.color}
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
                                onChange={(e) => handleFieldChange("notes", e.target.value)}
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
                <h1>{`${requestData.firstName} ${requestData.lastInitial}., your print request for ${requestData.printName} has been submitted!`}</h1>
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
            <div className="gradient"></div>
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