import React, { useEffect, useState } from "react";
import { getCandidates, castVote, getResults } from "./api";

function App() {
  const [candidates, setCandidates] = useState([]);
  const [txHash, setTxHash] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState("vote");

  useEffect(() => {
    loadCandidates();
  }, []);

  async function loadCandidates() {
    const data = await getCandidates();
    setCandidates(data);
  }

  async function submitVote(id) {
    const tx = await castVote(id);
    setTxHash(tx.txHash);
    setPage("success");
  }

  async function loadResults() {
    const r = await getResults();
    setResults(r);
    setPage("results");
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>E-Voting System</h1>

      {/* VOTE PAGE */}
      {page === "vote" && (
        <>
          <h2>Select Candidate</h2>
          {candidates.map((c) => (
            <button
              key={c.id}
              style={{ display: "block", margin: 10 }}
              onClick={() => submitVote(c.id)}
            >
              {c.name}
            </button>
          ))}

          <button onClick={loadResults} style={{ marginTop: 20 }}>
            Admin – View Results
          </button>
        </>
      )}

      {/* SUCCESS PAGE */}
      {page === "success" && (
        <>
          <h2>Vote Cast Successfully!</h2>
          <p><b>Transaction Hash:</b></p>
          <p>{txHash}</p>

          <button onClick={loadResults}>Go to Admin Dashboard</button>
        </>
      )}

      {/* ADMIN RESULTS */}
      {page === "results" && (
        <>
          <h2>Vote Tally</h2>
          {results.map((r) => (
            <p key={r.id}>
              {r.name}: <b>{r.votes}</b>
            </p>
          ))}

          <button onClick={() => setPage("vote")}>Back to Ballot</button>
        </>
      )}
    </div>
  );
}

export default App;
