const API_URL = "http://localhost:4000";

export async function getCandidates() {
  const res = await fetch(`${API_URL}/candidates`);
  return await res.json();
}

export async function castVote(candidateId) {
  const res = await fetch(`${API_URL}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ candidateId }),
  });
  return await res.json();
}

export async function getResults() {
  const res = await fetch(`${API_URL}/results`);
  return await res.json();
}
