import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ethers } from "ethers";
import { createRequire } from "module";

// Standard way to load JSON in ES Modules for Node.js
const require = createRequire(import.meta.url);
const contractJson = require("../blockchain/artifacts/contracts/Voting.sol/Voting.json");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --------------------------------------------
// DUMMY CANDIDATES
// --------------------------------------------
const candidates = [
  { id: 1, name: "Candidate A" },
  { id: 2, name: "Candidate B" },
  { id: 3, name: "Candidate C" },
];

// --------------------------------------------
// GET ALL CANDIDATES
// --------------------------------------------
app.get("/candidates", (req, res) => {
  res.json(candidates);
});

// --------------------------------------------
// BLOCKCHAIN CONNECTION + VOTE ROUTE
// --------------------------------------------
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractJson.abi, wallet);

app.post("/vote", async (req, res) => {
  const { candidateId } = req.body;
  try {
    // For the demo: We pick a random unlocked Hardhat account (0 to 19) 
    // to simulate a unique voter's blockchain wallet.
    const randomAccountIndex = Math.floor(Math.random() * 20);
    const randomSigner = await provider.getSigner(randomAccountIndex);
    
    // Connect the contract to this new user's wallet
    const userContract = contract.connect(randomSigner);

    // Cast the vote
    const tx = await userContract.castVote(candidateId); 
    await tx.wait();
    
    res.json({ success: true, tx: tx.hash });
  } catch (err) {
    // If THIS specific random account already voted, it will throw an error
    res.status(400).json({ success: false, error: err.reason || err.message });
  }
});

app.listen(4000, () => console.log("Backend running at http://localhost:4000"));