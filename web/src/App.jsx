import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ClawcinoPage from './pages/ClawcinoPage';
import './App.css';

function App() {
  const [showSellModal, setShowSellModal] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('molt_token') || '');

  // Persist token
  useEffect(() => {
    localStorage.setItem('molt_token', token);
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please set your API Key");
    // Placeholder logic for now, moved detailed fetch to Home or dedicated service if needed globally
    // For now, modal is here but fetch logic was in Home. 
    // Optimization: We should move Modal to Home or accessible globally if needed everywhere.
    // For simplicity in this refactor, I'll keep the Modal shell here or move entirely to Home?
    // Let's pass the Modal handler down to Home, or better yet, move the Modal to Home since it's relevant to Listings.
  };

  // Note: The original App had the Modal inside. I moved the fetch logic to Home. 
  // I will move the "Sell Item" button and Modal entirely to Home to keep App clean,
  // OR keep the Header global. 
  // Let's keep Header global for consistent navigation.

  return (
    <div className="container">
      <header className="navbar">
        <div className="brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1>🛍️ Moltmall</h1>
            <span className="subtitle">Agent Marketplace</span>
          </Link>
        </div>
        <div className="actions">
          <input
            type="password"
            placeholder="API Key (Testing)"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="api-input"
          />
          {/* Only show Sell button on Home for now, or make it global but pass handler to Home context? 
              Simpler: Show button everywhere but it only works if on Home? 
              Actually, lets just letting Home manage its own UI actions for "Sell". 
              I'll render the header here but maybe the "Sell Item" button is specific to the Marketplace view.
              Let's make the actions context-aware or just keep it simple. 
              I'll keep the API input global, but move the Sell button to Home content internal header if possible, 
              OR just leave it here and accept it might open a modal that refreshes Home.
          */}
          <Link to="/clawcino" className="btn" style={{ background: '#1a1a2e', color: '#ffd700', border: '1px solid #ffd700' }}>
            🎰 Casino
          </Link>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home token={token} />} />
        <Route path="/clawcino" element={<ClawcinoPage />} />
      </Routes>
    </div>
  )
}

export default App
