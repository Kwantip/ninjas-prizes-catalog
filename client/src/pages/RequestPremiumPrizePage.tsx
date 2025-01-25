import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./RequestPrintPage.css";

function RequestPremiumPrizePage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [submitClicked, setSubmitClicked] = useState(false);
    const [availableColors, setAvailableColors] = useState<{ id: number; color: string }[]>([]);
    const [availablePremiumPrizes, setAvailablePremiumPrizes] = useState<{ name: string }[]>([]);
    const [requestData, setRequestData] = useState({
        id: "",
        firstName: "",
        lastInitial: "",
        printName: location.state?.prize || "",
        linkToPrint: null,
        color: "Random",
        notes: "",
        status: null,
        receivedDate: ""
    });
    const [id, setId] = useState("ERROR :((");

    // Fetch available colors and prizes
    useEffect(() => {
        Promise.all([
            fetch("http://localhost:5000/api/availableColors").then((res) => res.json()),
            fetch("http://localhost:5000/api/premiumPrizesNames").then((res) => res.json())
        ])
            .then(([colors, prizes]) => {
                setAvailableColors(colors);
                setAvailablePremiumPrizes(prizes);
            })
            .catch((err) => {
                console.error("Failed to fetch data:", err);
            });
    }, []);

    const handleFieldChange = (field: string, value: any) => {
        setRequestData((prev) => ({ ...prev, [field]: value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestData.firstName || !requestData.lastInitial || !requestData.printName) {
            console.error("Invalid form data!!");
            return;
        }

        fetch("http://localhost:5000/api/printsQueue", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorDetails = await res.text();
                    console.error("Server response: ", errorDetails);
                    throw new Error("Failed to submit premium prize request.");
                }
                const data = await res.json();
                console.log("Request received with ID: ", data.id);
                setId(data.id);
                setSubmitClicked(true);
                window.scrollTo(0, 0);
            })
            .catch((err) => {
                console.error("Error details: ", err);
            });
    };

    const handleGoBack = () => {
        window.scrollTo(0, 0);
        navigate("/premium-prizes");
    };

    if (submitClicked) {
        return (
            <main className="request-submitted">
                <h1>{`${requestData.firstName} ${requestData.lastInitial}., we've received your request for ${requestData.printName}!`}</h1>
                <p className="id-section">
                    {`Your request ID is `}
                    <strong>{id}</strong>
                </p>
                <p>
                    We will get back to you shortly regarding payment if your print is approved! Premium Prizes are
                    approved on a first-come-first-serve basis and may be denied depending on the quantity of the goods
                    remaining!
                </p>
                <button onClick={handleGoBack}>Go Back</button>
            </main>
        );
    }

    return (
        <main>
            <h1>Request a Premium Print</h1>
            <form className="prints-request-form" onSubmit={handleSubmit}>
                <div className="input-area">
                    <label>
                        First Name*
                        <input
                            type="text"
                            value={requestData.firstName}
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
                        <select
                            value={requestData.printName}
                            onChange={(e) => handleFieldChange("printName", e.target.value)}
                        >
                            <option value="" disabled>
                                Select a prize
                            </option>
                            {availablePremiumPrizes.map((prize, index) => (
                                <option key={index} value={prize.name}>
                                    {prize.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Color
                        <select
                            value={requestData.color}
                            onChange={(e) => handleFieldChange("color", e.target.value)}
                        >
                            <option value="Random">Random</option>
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
    );
}

export default RequestPremiumPrizePage;
