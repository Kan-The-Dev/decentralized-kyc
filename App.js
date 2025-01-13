import React, { useState } from "react";
import axios from "axios";

function App() {
    const [dataHash, setDataHash] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [response, setResponse] = useState(null);

    const registerUser = async () => {
        try {
            const res = await axios.post("http://localhost:3000/registerUser", { dataHash });
            setResponse(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const verifyUser = async () => {
        try {
            const res = await axios.post("http://localhost:3000/verifyUser", { userAddress });
            setResponse(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Decentralized KYC System</h1>

            <div>
                <h2>Register User</h2>
                <input
                    type="text"
                    placeholder="Enter data hash"
                    value={dataHash}
                    onChange={(e) => setDataHash(e.target.value)}
                />
                <button onClick={registerUser}>Register</button>
            </div>

            <div>
                <h2>Verify User</h2>
                <input
                    type="text"
                    placeholder="Enter user address"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                />
                <button onClick={verifyUser}>Verify</button>
            </div>

            {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
        </div>
    );
}

export default App;
