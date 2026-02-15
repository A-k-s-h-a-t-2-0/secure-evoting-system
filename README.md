# 🗳️ Secure Hybrid E-Voting System

A blockchain-based e-voting application that uses **OCR (Optical Character Recognition)** for secure voter identity verification and **Ethereum Smart Contracts** for immutable vote recording.

## 🚀 Features
- **Hybrid Security:** Combines Cloud for user management and Blockchain (Ethereum) for vote storage.
- **OCR Verification:** Scans ID cards to authenticate voters using `Tesseract.js`.
- **Admin Dashboard:** Real-time voting analytics and candidate management.
- **Tamper-Proof:** Votes are stored on the blockchain and cannot be altered or deleted.

## 🛠️ Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js, Express, Multer
- **Blockchain:** Hardhat, Solidity, Ethers.js

## ⚙️ Installation & Setup

### 1. Install Dependencies
```bash
cd blockchain && npm install
cd ../backend && npm install
cd ../frontend && npm install
