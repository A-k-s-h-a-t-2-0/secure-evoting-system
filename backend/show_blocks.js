import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

async function showBlocks() {
  console.log("🔍 Scanning Local Hardhat Blockchain...\n");
  
  try {
    const currentBlockNumber = await provider.getBlockNumber();
    console.log(`📦 Total Blocks Mined: ${currentBlockNumber}\n`);
    
    for (let i = 0; i <= currentBlockNumber; i++) {
      const block = await provider.getBlock(i, true); // true to get full transaction details
      
      console.log(`--- Block #${i} ---`);
      console.log(`Hash: ${block.hash}`);
      console.log(`Timestamp: ${new Date(block.timestamp * 1000).toLocaleString()}`);
      console.log(`Transactions: ${block.prefetchedTransactions.length}`);
      
      if (block.prefetchedTransactions.length > 0) {
        block.prefetchedTransactions.forEach((tx, index) => {
          console.log(`   [Tx ${index + 1}] Hash: ${tx.hash}`);
          console.log(`   [Tx ${index + 1}] From: ${tx.from}`);
          console.log(`   [Tx ${index + 1}] To: ${tx.to || "Contract Creation"}`);
        });
      }
      console.log("-------------------\n");
    }
  } catch (error) {
    console.error("❌ Could not connect to Blockchain. Is Hardhat node running?");
  }
}

showBlocks();
