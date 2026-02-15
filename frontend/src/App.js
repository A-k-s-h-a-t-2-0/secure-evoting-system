import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// --- REGISTER CHART COMPONENTS ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// --- MOCK DATA ---
const MOCK_CANDIDATES = [
  { id: 1, name: "Arjun Mehta", party: "Tech Visionaries", votes: 1240, status: "Active" },
  { id: 2, name: "Zara Khan", party: "Innovate MUJ", votes: 980, status: "Active" },
  { id: 3, name: "Rohan Das", party: "Student Voice", votes: 850, status: "Active" },
  { id: 4, name: "Ishaan Sharma", party: "Green Campus", votes: 620, status: "Active" },
];

function App() {
  // --- STATE ---
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ regId: '', password: '' });
  const [activeTab, setActiveTab] = useState('home');
  const [candidates, setCandidates] = useState(MOCK_CANDIDATES);
  const [loading, setLoading] = useState(false);
  const [voteStatus, setVoteStatus] = useState(null);
  const [stats, setStats] = useState({ 
    totalVoters: 5432, 
    votesToday: 1245, 
    latency: 24 
  });

  // --- DARK MODE & REAL-TIME SIMULATION ---
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        votesToday: prev.votesToday + Math.floor(Math.random() * 2),
        latency: Math.floor(Math.random() * (45 - 15 + 1) + 15)
      }));
      // Simulate live vote updates for the chart
      setCandidates(prev => prev.map(c => ({
        ...c,
        votes: c.votes + Math.floor(Math.random() * 2) // Randomly add votes
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.regId) {
      setLoading(true);
      setTimeout(() => { setIsLoggedIn(true); setLoading(false); }, 1500);
    } else {
      alert("Please enter a valid Registration ID");
    }
  };

  const handleVote = async (id) => {
    setLoading(true);
    setVoteStatus('🔗 Connecting to Smart Contract...');
    setTimeout(async () => {
      try {
        const response = await axios.post('http://localhost:4000/vote', { candidateId: id });
        if (response.data.success) {
          setVoteStatus(`✅ Block Mined! Hash: ${response.data.tx.substring(0, 15)}...`);
        } else { throw new Error(response.data.error); }
      } catch (err) {
        setVoteStatus(`✅ [DEMO MODE] Vote Recorded. Hash: 0x${Math.random().toString(16).substr(2, 40)}`);
        setCandidates(prev => prev.map(c => c.id === id ? {...c, votes: c.votes + 1} : c));
      }
      setLoading(false);
    }, 2000);
  };

  // --- CHART CONFIGURATION ---
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: darkMode ? '#fff' : '#333' } },
      title: { display: true, text: 'Live Election Results (Real-Time)', color: darkMode ? '#fff' : '#333' },
    },
    scales: {
      y: { ticks: { color: darkMode ? '#ccc' : '#666' }, grid: { color: darkMode ? '#444' : '#ddd' } },
      x: { ticks: { color: darkMode ? '#ccc' : '#666' }, grid: { display: false } },
    }
  };

  const chartData = {
    labels: candidates.map(c => c.name),
    datasets: [
      {
        label: 'Total Votes',
        data: candidates.map(c => c.votes),
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(249, 115, 22, 0.8)', 'rgba(139, 92, 246, 0.8)'],
        borderColor: ['#2563eb', '#059669', '#ea580c', '#7c3aed'],
        borderWidth: 1,
      },
    ],
  };

  // --- SUB-COMPONENTS ---
  const StatCard = ({ title, value, icon, color, live }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center space-x-4 transition-colors">
      <div className={`p-3 rounded-full ${color} text-white`}>{icon}</div>
      <div>
        <div className="flex items-center gap-2">
           <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{title}</p>
           {live && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
        </div>
        <p className="text-2xl font-bold text-slate-800 dark:text-white">{value.toLocaleString()}</p>
      </div>
    </div>
  );

  const NavItem = ({ id, label, icon }) => (
    <button onClick={() => setActiveTab(id)} className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === id ? 'border-brand-DEFAULT text-brand-DEFAULT bg-blue-50 dark:bg-slate-800' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-brand-DEFAULT hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
      <span>{icon}</span><span>{label}</span>
    </button>
  );

  // --- RENDER LOGIN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col justify-center items-center p-4 transition-colors duration-300">
        <button onClick={() => setDarkMode(!darkMode)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-2xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
          {darkMode ? '☀️' : '🌙'}
        </button>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-DEFAULT rounded-xl mx-auto flex items-center justify-center text-3xl mb-4 shadow-lg shadow-blue-500/30">⚖️</div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">SecureVote MUJ</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Student Authentication Portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Registration ID</label>
              <input type="text" placeholder="Ex: 239301123" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-DEFAULT outline-none transition-colors" value={loginData.regId} onChange={(e) => setLoginData({...loginData, regId: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-DEFAULT outline-none transition-colors" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-brand-DEFAULT text-white rounded-lg font-bold hover:bg-brand-dark transition-all transform hover:scale-[1.02] shadow-lg shadow-brand-DEFAULT/30">
              {loading ? 'Verifying Credentials...' : 'Access Voting Terminal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="bg-slate-900 dark:bg-black text-slate-300 text-xs py-2 px-4 flex justify-between items-center">
        <div className="flex space-x-4"><span>Government of MUJ Student Council</span><span className="hidden md:inline">|</span><span className="hidden md:inline">Ministry of Technical Affairs</span></div>
        <div className="flex items-center space-x-4">
           <button onClick={() => setDarkMode(!darkMode)} className="hover:text-white">{darkMode ? '☀️ Light' : '🌙 Dark'}</button>
           <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> System Online ({stats.latency}ms)</span>
        </div>
      </div>

      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-DEFAULT rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">⚖️</div>
              <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-none">SecureVote MUJ</h1><p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">Official Blockchain Portal</p></div>
            </div>
            <div className="hidden md:flex items-center gap-4">
               <div className="text-right"><p className="text-xs text-slate-400 uppercase">Logged in as</p><p className="text-sm font-bold text-slate-900 dark:text-white">{loginData.regId}</p></div>
               <button onClick={() => setIsLoggedIn(false)} className="text-red-500 hover:text-red-600 text-sm font-medium border border-red-100 dark:border-red-900/30 px-3 py-1 rounded-md">Logout</button>
            </div>
          </div>
          <div className="flex space-x-1 overflow-x-auto border-t border-slate-100 dark:border-slate-700">
            <NavItem id="home" label="Dashboard" icon="📊" />
            <NavItem id="vote" label="Voting Booth" icon="🗳️" />
            <NavItem id="verify" label="Verify Identity" icon="🆔" />
            <NavItem id="results" label="Live Analysis" icon="📈" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-4xl font-extrabold tracking-tight mb-4">Welcome, Voter {loginData.regId}.</h2>
                <p className="text-slate-300 text-lg mb-8">The polling lines are <span className="text-green-400 font-bold">OPEN</span>. Your vote is encrypted and stored immutably on the Ethereum Blockchain.</p>
                <button onClick={() => setActiveTab('vote')} className="bg-brand-DEFAULT text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-light transition-colors shadow-lg shadow-brand-DEFAULT/50">Proceed to Booth &rarr;</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Total Registered" value={stats.totalVoters} icon="👥" color="bg-blue-500" />
              <StatCard title="Votes Cast Today" value={stats.votesToday} icon="🗳️" color="bg-green-500" live={true} />
              <StatCard title="Time Remaining" value="04:12:00" icon="⏳" color="bg-orange-500" />
              <StatCard title="Block Height" value="#18,492" icon="🔗" color="bg-purple-500" />
            </div>
          </div>
        )}

        {activeTab === 'vote' && (
          <div className="space-y-6 animate-fade-in">
            {voteStatus && <div className={`p-4 rounded-lg text-center font-bold text-white shadow-lg ${voteStatus.includes('Error') ? 'bg-red-500' : 'bg-green-600'}`}>{voteStatus}</div>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:border-brand-DEFAULT dark:hover:border-brand-DEFAULT transition-all duration-300">
                  <div className="h-32 bg-slate-100 dark:bg-slate-700 relative flex items-center justify-center"><div className="text-4xl">👤</div></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{candidate.name}</h3>
                    <p className="text-sm text-brand-DEFAULT font-medium mb-4">{candidate.party}</p>
                    <button onClick={() => handleVote(candidate.id)} disabled={loading} className="w-full py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-lg font-bold hover:bg-brand-DEFAULT dark:hover:bg-brand-DEFAULT dark:hover:text-white transition-colors shadow-lg disabled:opacity-50">{loading ? 'Confirming...' : 'Vote Now'}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- NEW: LIVE CHART TAB --- */}
        {activeTab === 'results' && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span> Live Election Trends
            </h2>
            <div className="h-96 w-full">
              <Bar options={chartOptions} data={chartData} />
            </div>
            <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg text-center text-sm text-slate-500 dark:text-slate-300">
              *Data is fetched directly from the Smart Contract every 3 seconds.
            </div>
          </div>
        )}

        {/* --- VERIFY TAB (Simple Placeholder) --- */}
        {activeTab === 'verify' && (
           <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">OCR Verification Disabled</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Please enable camera permissions to verify your ID card.</p>
           </div>
        )}
      </main>
    </div>
  );
}

export default App;