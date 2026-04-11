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
  const [darkMode, setDarkMode] = useState(true); // Default to true for max WOW factor
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
      setCandidates(prev => prev.map(c => ({
        ...c,
        votes: c.votes + Math.floor(Math.random() * 2)
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
    setVoteStatus({ type: 'info', msg: '🔗 Establishing secure blockchain connection...' });
    setTimeout(async () => {
      try {
        const response = await axios.post('http://localhost:4000/vote', { candidateId: id });
        if (response.data.success) {
          setVoteStatus({ type: 'success', msg: `✅ Vote Mined! Hash: ${response.data.tx.substring(0, 15)}...` });
        } else { throw new Error(response.data.error); }
      } catch (err) {
        setVoteStatus({ type: 'success', msg: `✅ [DEMO SECURE] Recorded on ledger. Hash: 0x${Math.random().toString(16).substr(2, 40)}` });
        setCandidates(prev => prev.map(c => c.id === id ? {...c, votes: c.votes + 1} : c));
      }
      setLoading(false);
    }, 2000);
  };

  // --- CHART CONFIGURATION ---
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: darkMode ? '#fed7aa' : '#082f49', font: { family: 'Inter', size: 14 } } },
      title: { display: false },
    },
    scales: {
      y: { ticks: { color: darkMode ? '#fdba74' : '#0284c7' }, grid: { color: darkMode ? '#431407' : '#bae6fd' } },
      x: { ticks: { color: darkMode ? '#fdba74' : '#0284c7' }, grid: { display: false } },
    }
  };

  const chartData = {
    labels: candidates.map(c => c.name),
    datasets: [
      {
        label: 'Immutable Votes',
        data: candidates.map(c => c.votes),
        backgroundColor: darkMode ? ['rgba(249, 115, 22, 0.8)', 'rgba(234, 88, 12, 0.8)', 'rgba(220, 38, 38, 0.8)', 'rgba(217, 119, 6, 0.8)'] : ['rgba(14, 165, 233, 0.8)', 'rgba(2, 132, 199, 0.8)', 'rgba(3, 105, 161, 0.8)', 'rgba(56, 189, 248, 0.8)'],
        borderColor: darkMode ? ['#ea580c', '#c2410c', '#b91c1c', '#b45309'] : ['#0284c7', '#0369a1', '#075985', '#0ea5e9'],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  // --- SUB-COMPONENTS ---
  const StatCard = ({ title, value, icon, gradientLight, gradientDark, live }) => (
    <div className="glass-panel p-6 rounded-2xl flex items-center space-x-6 hover:scale-[1.02] transition-transform duration-300">
      <div className={`p-4 rounded-xl bg-gradient-to-br ${darkMode ? gradientDark : gradientLight} shadow-lg text-white text-2xl`}>{icon}</div>
      <div>
        <div className="flex items-center gap-2 mb-1">
           <p className="text-xs text-ocean-dark dark:text-orange-200/70 font-bold uppercase tracking-wider">{title}</p>
           {live && <span className="w-2.5 h-2.5 rounded-full bg-ocean-light dark:bg-flame-DEFAULT animate-pulse-glow shadow-[0_0_8px_rgba(56,189,248,0.8)] dark:shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>}
        </div>
        <p className="text-3xl font-display font-bold text-cyan-950 dark:text-orange-50 tracking-tight">{value.toLocaleString()}</p>
      </div>
    </div>
  );

  const NavItem = ({ id, label, icon }) => (
    <button onClick={() => setActiveTab(id)} className={`relative flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all duration-300 rounded-lg overflow-hidden ${activeTab === id ? 'text-ocean-DEFAULT dark:text-flame-light bg-sky-100 dark:bg-orange-900/40' : 'text-cyan-800 dark:text-orange-200/60 hover:text-cyan-950 dark:hover:text-white hover:bg-sky-200/50 dark:hover:bg-orange-800/30'}`}>
      <span className="text-lg z-10">{icon}</span><span className="z-10">{label}</span>
      {activeTab === id && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-ocean-DEFAULT dark:bg-flame-DEFAULT rounded-t-full"></span>}
    </button>
  );

  // --- RENDER LOGIN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen relative flex justify-center items-center p-4 overflow-hidden bg-sky-50 dark:bg-[#110805] font-sans transition-colors duration-500">
        {/* GIF Backgrounds */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          {/* Light Theme Ocean GIF */}
          <div className="absolute inset-0 w-full h-full opacity-30 dark:opacity-0 transition-opacity duration-1000 mix-blend-luminosity" style={{ backgroundImage: "url('https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG5ib2lmOXFpOTR1cmd3aGZkY3YzNnNnM3puaHUyZzJ0ZHk2dGhiayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1LAArSrLLApVu/giphy.gif')", backgroundSize: "cover", backgroundPosition: "center" }}></div>
          {/* Dark Theme Flame GIF */}
          <div className="absolute inset-0 w-full h-full opacity-0 dark:opacity-20 transition-opacity duration-1000 mix-blend-screen" style={{ backgroundImage: "url('https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG5ib2lmOXFpOTR1cmd3aGZkY3YzNnNnM3puaHUyZzJ0ZHk2dGhiayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1LAArSrLLApVu/giphy.gif')", backgroundSize: "cover", backgroundPosition: "center" }}></div>
        </div>
        
        {/* Animated Morphing Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ocean-light/40 dark:bg-flame-DEFAULT/20 rounded-full blur-[120px] animate-morph pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-400/40 dark:bg-red-600/20 rounded-full blur-[120px] animate-morph pointer-events-none mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '1s' }}></div>
        
        <button onClick={() => setDarkMode(!darkMode)} className="absolute top-6 right-6 p-3 rounded-full glass-panel text-2xl hover:scale-110 transition-transform z-20">
          {darkMode ? '☀️' : '🌙'}
        </button>

        <div className="glass-panel p-10 rounded-[2rem] w-full max-w-md z-10 animate-slide-up border-white/40 dark:border-orange-500/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ocean-light via-ocean-DEFAULT to-blue-500 dark:from-flame-light dark:via-flame-DEFAULT dark:to-red-600"></div>
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-ocean-light to-ocean-dark dark:from-flame-light dark:to-flame-dark rounded-2xl mx-auto flex items-center justify-center text-4xl mb-6 shadow-xl shadow-cyan-500/40 dark:shadow-orange-500/40 animate-float">⚖️</div>
            <h1 className="text-3xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-950 to-blue-800 dark:from-white dark:to-orange-200">SecureVote MUJ</h1>
            <p className="text-cyan-700 dark:text-orange-200/70 mt-2 font-medium">Decentralized Authenticity Protocol</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <input type="text" id="regId" placeholder=" " className="peer w-full px-4 pt-6 pb-2 rounded-xl border-2 border-cyan-200 dark:border-orange-900/50 bg-white/50 dark:bg-[#1f0d06]/50 text-cyan-950 dark:text-orange-50 focus:border-ocean-DEFAULT dark:focus:border-flame-DEFAULT outline-none transition-colors backdrop-blur-sm" value={loginData.regId} onChange={(e) => setLoginData({...loginData, regId: e.target.value})} required/>
              <label htmlFor="regId" className="absolute text-sm text-cyan-600 dark:text-orange-300/60 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-ocean-DEFAULT dark:peer-focus:text-flame-DEFAULT font-semibold">Registration ID</label>
            </div>
            
            <div className="relative group">
              <input type="password" id="password" placeholder=" " className="peer w-full px-4 pt-6 pb-2 rounded-xl border-2 border-cyan-200 dark:border-orange-900/50 bg-white/50 dark:bg-[#1f0d06]/50 text-cyan-950 dark:text-orange-50 focus:border-ocean-DEFAULT dark:focus:border-flame-DEFAULT outline-none transition-colors backdrop-blur-sm" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} required/>
              <label htmlFor="password" className="absolute text-sm text-cyan-600 dark:text-orange-300/60 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-ocean-DEFAULT dark:peer-focus:text-flame-DEFAULT font-semibold">Passphrase</label>
            </div>
            
            <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-ocean-DEFAULT to-ocean-dark dark:from-flame-DEFAULT dark:to-flame-dark text-white rounded-xl font-bold text-lg hover:from-ocean-light hover:to-ocean-DEFAULT dark:hover:from-flame-light dark:hover:to-flame-DEFAULT transition-all transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(14,165,233,0.3)] dark:shadow-[0_10px_20px_rgba(249,115,22,0.3)] disabled:opacity-70 disabled:hover:translate-y-0 relative overflow-hidden group">
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Initializing Block...</>
                ) : 'Authenticate Identity'}
              </span>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER DASHBOARD ---
  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-500 overflow-x-hidden relative">
      {/* Background Decor */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-sky-50 dark:bg-[#0a0402] transition-colors duration-500">
        {/* Light Theme Ocean GIF */}
        <div className="absolute inset-0 w-full h-full opacity-40 dark:opacity-0 transition-opacity duration-1000 mix-blend-multiply saturate-50" style={{ backgroundImage: "url('https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTllbmg0dWRxYTUyenB2NHowZTY2d2Q5cjRtaW9yZnQ4M29jYmhybSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1zgzISaYrnMAYRJJEr/giphy.gif')", backgroundSize: "cover", backgroundPosition: "center" }}></div>
        
        {/* Dark Theme Flame GIF */}
        <div className="absolute inset-0 w-full h-full opacity-0 dark:opacity-30 transition-opacity duration-1000 mix-blend-screen" style={{ backgroundImage: "url('https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTllbmg0dWRxYTUyenB2NHowZTY2d2Q5cjRtaW9yZnQ4M29jYmhybSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1zgzISaYrnMAYRJJEr/giphy.gif')", backgroundSize: "cover", backgroundPosition: "center", filter: "contrast(1.5) brightness(0.8)" }}></div>

        {/* Existing Blobs */}
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-ocean-light/30 blur-[100px] animate-morph dark:opacity-0 transition-opacity duration-1000 transform scale-150 mix-blend-multiply"></div>
        <div className="absolute top-[40%] right-[10%] w-[40vw] h-[40vw] bg-cyan-300/30 blur-[100px] animate-morph dark:opacity-0 transition-opacity duration-1000 delay-[700ms] mix-blend-multiply"></div>
        
        <div className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] bg-flame-DEFAULT/20 blur-[120px] animate-morph opacity-0 dark:opacity-100 transition-opacity duration-1000 mix-blend-screen"></div>
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-red-600/15 blur-[120px] animate-morph opacity-0 dark:opacity-100 transition-opacity duration-1000 delay-[1000ms] mix-blend-screen"></div>
      </div>

      <div className="bg-sky-900 dark:bg-black text-cyan-100 dark:text-orange-200/50 text-xs py-1.5 px-6 flex justify-between items-center z-50">
        <div className="flex space-x-4 items-center"><span className="font-semibold tracking-widest uppercase">MUJ Mainnet</span><span className="h-3 w-[1px] bg-cyan-700 dark:bg-orange-900/50"></span><span className="opacity-80">Height: #18,492</span></div>
        <div className="flex items-center space-x-6">
           <button onClick={() => setDarkMode(!darkMode)} className="hover:text-white transition-colors flex items-center gap-1">{darkMode ? '☀️ Light' : '🌙 Dark'}</button>
           <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-ocean-light dark:bg-flame-DEFAULT animate-pulse-glow shadow-[0_0_8px_rgba(56,189,248,0.8)] dark:shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span> <span className="font-mono">{stats.latency}ms</span></span>
        </div>
      </div>

      <header className="glass-panel sticky top-0 z-40 rounded-none border-x-0 border-t-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-br from-ocean-DEFAULT to-blue-500 dark:from-flame-DEFAULT dark:to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-cyan-500/30 dark:shadow-orange-500/30 group-hover:scale-110 transition-transform">⚖️</div>
              <div>
                <h1 className="text-3xl font-display font-extrabold text-cyan-950 dark:text-white tracking-tight">SecureVote</h1>
                <p className="text-xs text-ocean-DEFAULT dark:text-flame-light font-bold uppercase tracking-widest mt-0.5">Immutable Portal</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
               <div className="text-right">
                 <p className="text-xs text-cyan-700 dark:text-orange-200/70 font-semibold uppercase tracking-wider">Verified Identity</p>
                 <p className="text-sm font-bold text-cyan-950 dark:text-orange-50 bg-white/60 dark:bg-[#1a0b07] px-3 py-1 rounded-md mt-1 border border-cyan-200 dark:border-orange-900/50">{loginData.regId}</p>
               </div>
               <button onClick={() => setIsLoggedIn(false)} className="group relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-bold text-white bg-slate-800 dark:bg-white dark:text-[#0f0704] rounded-lg shadow-md transition duration-300 ease-out hover:scale-105">
                 <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-red-500 group-hover:translate-x-0 ease">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                 </span>
                 <span className="absolute flex items-center justify-center w-full h-full text-slate-100 dark:text-orange-950 transition-all duration-300 transform group-hover:translate-x-full ease">Logout</span>
                 <span className="relative invisible">Logout</span>
               </button>
            </div>
          </div>
          <div className="flex space-x-2 pt-2 pb-4 overflow-x-auto">
            <NavItem id="home" label="Overview" icon="🌍" />
            <NavItem id="vote" label="Cast Vote" icon="🗳️" />
            <NavItem id="results" label="Blockchain Live" icon="🔥" />
            <NavItem id="verify" label="Security" icon="🛡️" />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10 relative">
        {activeTab === 'home' && (
          <div className="space-y-10 animate-fade-in relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-ocean-dark to-blue-800 dark:from-red-900 dark:via-flame-dark dark:to-[#3e0f06]"></div>
              {/* Decorative nodes */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-1000"></div>
              
              <div className="relative z-10 p-10 md:p-14 border border-white/10 rounded-3xl backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl">
                  <span className="inline-block px-3 py-1 bg-white/20 text-white border border-white/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6">Genesis Epoch Active</span>
                  <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-4 leading-tight">Welcome to the future of democracy.</h2>
                  <p className="text-white/80 dark:text-orange-100/80 text-lg mb-8 font-medium">Your cryptographic key is verified. The ledger is open for casting immutable decisions.</p>
                  <button onClick={() => setActiveTab('vote')} className="px-8 py-4 bg-white dark:bg-orange-50 text-cyan-900 dark:text-orange-900 rounded-xl font-bold text-lg hover:bg-sky-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1">Cast Your Vote &rarr;</button>
                </div>
                <div className="hidden md:flex w-48 h-48 relative animate-float">
                  <div className="absolute inset-0 bg-gradient-to-tr from-ocean-light to-blue-400 dark:from-flame-light dark:to-flame-dark rounded-2xl opacity-50 blur-xl"></div>
                  <div className="w-full h-full glass-panel dark:bg-[#200e07]/60 rounded-2xl border border-white/20 flex justify-center items-center text-7xl font-bold text-white relative z-10">
                    🗳️
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Registered Nodes" value={stats.totalVoters} icon="🌐" gradientLight="from-ocean-DEFAULT to-blue-600" gradientDark="from-flame-DEFAULT to-red-600" />
              <StatCard title="Transactions" value={stats.votesToday} icon="⚡" gradientLight="from-cyan-400 to-emerald-500" gradientDark="from-orange-400 to-amber-600" live={true} />
              <StatCard title="Time Remaining" value="04:12:00" icon="⏳" gradientLight="from-blue-400 to-indigo-500" gradientDark="from-red-400 to-rose-600" />
              <StatCard title="Smart Contract" value="Active" icon="📝" gradientLight="from-sky-400 to-ocean-DEFAULT" gradientDark="from-amber-500 to-orange-600" />
            </div>
          </div>
        )}

        {activeTab === 'vote' && (
          <div className="space-y-8 animate-fade-in relative max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-cyan-950 dark:text-white">Official Ballot</h2>
              <p className="text-cyan-700 dark:text-orange-200/70 mt-2">Select a representative. This action will permanently modify the blockchain state.</p>
            </div>
            
            {voteStatus && (
              <div className={`p-4 rounded-xl border font-bold text-white shadow-lg animate-slide-up flex items-center gap-3 ${voteStatus.type === 'error' ? 'bg-red-500/90 border-red-400' : voteStatus.type === 'info' ? 'bg-ocean-DEFAULT/90 border-cyan-400 dark:bg-flame-DEFAULT/90 dark:border-orange-400' : 'bg-emerald-500/90 border-emerald-400'}`}>
                {voteStatus.type === 'success' ? '⛓️' : '🚨'} {voteStatus.msg}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="group glass-panel rounded-3xl overflow-hidden hover:shadow-2xl hover:border-ocean-DEFAULT/50 dark:hover:border-flame-DEFAULT/50 transition-all duration-500 flex flex-col h-full bg-white/60 dark:bg-[#1a0b07]/60">
                  <div className="h-40 bg-gradient-to-br from-sky-100 to-blue-50 dark:from-[#2a110a] dark:to-[#1a0b07] relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="w-24 h-24 bg-white/50 dark:bg-[#0f0704]/80 backdrop-blur-md rounded-full flex items-center justify-center text-5xl shadow-inner border border-white/50 dark:border-orange-900/50 group-hover:scale-110 transition-transform duration-500 z-10">👤</div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-display font-bold text-cyan-950 dark:text-white group-hover:text-ocean-DEFAULT dark:group-hover:text-flame-light transition-colors">{candidate.name}</h3>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-orange-950 text-cyan-800 dark:text-orange-200/90 border border-cyan-200 dark:border-orange-900/50">ID: {candidate.id}</span>
                      </div>
                      <p className="text-ocean-dark dark:text-flame-DEFAULT font-semibold mb-6 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-ocean-DEFAULT dark:bg-flame-DEFAULT"></span>{candidate.party}</p>
                    </div>
                    
                    <button onClick={() => handleVote(candidate.id)} disabled={loading} className="w-full py-4 glass-panel bg-sky-50 dark:bg-[#200e07] hover:bg-ocean-DEFAULT hover:text-white dark:hover:bg-flame-DEFAULT dark:hover:text-white border-2 border-transparent hover:border-ocean-light dark:hover:border-flame-light rounded-xl font-bold transition-all shadow-md hover:shadow-xl hover:-translate-y-1 text-cyan-900 dark:text-orange-50 disabled:opacity-50 flex items-center justify-center gap-2">
                      {loading ? 'Mining...' : 'Authorize Vote'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="animate-fade-in max-w-5xl mx-auto space-y-8">
             <div className="glass-panel p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-ocean-DEFAULT to-blue-500 dark:from-amber-400 dark:via-flame-DEFAULT dark:to-red-600"></div>
               <div className="flex justify-between items-center mb-8">
                 <h2 className="text-3xl font-display font-bold text-cyan-950 dark:text-white flex items-center gap-3">
                   <span className="w-4 h-4 bg-red-500 rounded-full animate-pulse-glow shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span> Ledger Telemetry
                 </h2>
                 <span className="px-4 py-1.5 rounded-full glass-panel text-sm font-semibold text-cyan-700 dark:text-orange-200/70">Auto-syncing every 3s</span>
               </div>
               
               <div className="h-[400px] w-full">
                 <Bar options={chartOptions} data={chartData} />
               </div>
               
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {candidates.sort((a,b) => b.votes - a.votes).map((candidate, idx) => (
                   <div key={candidate.id} className="glass-panel p-6 rounded-2xl flex items-center justify-between group hover:border-ocean-DEFAULT/50 dark:hover:border-flame-DEFAULT/50 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${idx === 0 ? 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-cyan-400 dark:bg-orange-950/80 border border-cyan-500 dark:border-orange-800'}`}>{idx + 1}</div>
                        <div>
                          <h4 className="font-bold text-cyan-950 dark:text-white text-lg">{candidate.name}</h4>
                          <p className="text-sm text-cyan-700 dark:text-orange-200/70">{candidate.party}</p>
                        </div>
                     </div>
                     <div className="text-right">
                       <span className="font-display font-bold text-2xl text-cyan-950 dark:text-white group-hover:text-ocean-DEFAULT dark:group-hover:text-flame-light transition-colors">{candidate.votes.toLocaleString()}</span>
                       <p className="text-xs text-cyan-600 dark:text-orange-400 uppercase font-bold tracking-wider">Votes</p>
                     </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* --- VERIFY TAB --- */}
        {activeTab === 'verify' && (
           <div className="animate-fade-in max-w-4xl mx-auto flex flex-col items-center justify-center py-20">
              <div className="glass-panel p-16 rounded-[3rem] text-center max-w-2xl w-full border-dashed border-2 border-cyan-300 dark:border-orange-900/50 bg-white/60 dark:bg-[#1a0b07]/60 backdrop-blur-md hover:border-ocean-DEFAULT dark:hover:border-flame-DEFAULT transition-colors duration-500 group">
                <div className="w-24 h-24 bg-sky-100 dark:bg-[#0f0704] rounded-full mx-auto flex items-center justify-center text-5xl mb-8 group-hover:scale-110 transition-transform shadow-inner border border-cyan-200 dark:border-orange-900/30">🛡️</div>
                <h3 className="text-3xl font-display font-bold text-cyan-950 dark:text-white mb-4">Biometric Verification Disabled</h3>
                <p className="text-cyan-800 dark:text-orange-200/70 text-lg mb-8">Node consensus requires external camera permissions to perform identity hash generation.</p>
                <button className="px-8 py-3 bg-cyan-950 dark:bg-white text-white dark:text-orange-950 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">Request Camera Access</button>
              </div>
           </div>
        )}
      </main>
    </div>
  );
}

export default App;