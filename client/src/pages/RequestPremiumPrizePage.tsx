import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { OrderRequest, Color } from "../data.ts";

import "./RequestPrintPage.css";

import { IP } from "../App";
import axios from "axios";

function RequestPremiumPrizePage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [submitClicked, setSubmitClicked] = useState(false);
    const [availableColors, setAvailableColors] = useState<Color[]>([]);
    const [availablePremiumPrizes, setAvailablePremiumPrizes] = useState<{ id: 0, name: '' }[]>([]);
    const [requestData, setRequestData] = useState<OrderRequest>({
        first_name: '',
        last_name: '',
        print_name: location.state?.prize || '',
        link_to_item: '',
        color: '',
        notes: ''
    });
    const [id, setId] = useState("ERROR :((");

    // Fetch available colors and prizes
    useEffect(() => {
        Promise.all([
            fetch(`http://${IP}:8080/filament-colors?isAvailable=1`)
            .then((res) => res.json()),

            fetch(`http://${IP}:8080/prize-items?isOrderable=1&select=name`)
            .then((res) => res.json())
        ])
            .then(([colors, prizes]) => {
                setAvailableColors(colors);
                setAvailablePremiumPrizes(prizes);
            })
            .catch((err) => {
                console.error("Failed to fetch data:", err);
            });
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestData.first_name || !requestData.last_name || !requestData.print_name) {
            console.error("Invalid form data!!");
            return;
        }

        axios.post('http://localhost:8080/orders', requestData)
            .then(res => {
                const data = res.data;
                console.log("Request received with ID: ", data.id);
                setId(data.id);
                setSubmitClicked(true);
                window.scrollTo(0, 0);
            })
            .catch(err => console.log("Failed to submit premium prize request: " + err))
    };

    const handleGoBack = () => {
        window.scrollTo(0, 0);
        navigate("/premium-prizes");
    };

    if (submitClicked) {
        return (
            <main className="request-submitted">
                <h1>{`${requestData.first_name} ${requestData.last_name}, we've received your request for ${requestData.print_name}!`}</h1>
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
                        <select
                            value={requestData.print_name}
                            onChange={(e) => setRequestData({...requestData, print_name: e.target.value})}
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
    );
}

export default RequestPremiumPrizePage;
