const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = [
    "function registerUser(string dataHash) external",
    "function verifyUser(address userAddress) external",
    "function users(address) view returns (address userAddress, string dataHash, bool isVerified)"
];

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

app.post("/registerUser", async (req, res) => {
    const { dataHash } = req.body;
    try {
        const tx = await contract.registerUser(dataHash);
        await tx.wait();
        res.status(200).json({ message: "User registered successfully", txHash: tx.hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/verifyUser", async (req, res) => {
    const { userAddress } = req.body;
    try {
        const tx = await contract.verifyUser(userAddress);
        await tx.wait();
        res.status(200).json({ message: "User verified successfully", txHash: tx.hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/getUser/:userAddress", async (req, res) => {
    const { userAddress } = req.params;
    try {
        const user = await contract.users(userAddress);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
