import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ClawcinoPage from './pages/ClawcinoPage';
import { UserProvider, useUser } from './context/UserContext';
import WalletModal from './components/WalletModal';
import './App.css';

// Separate AppContent to access UserContext
const AppContent = () => {
  const { user, balance, login } = useUser();
  const [showWallet, setShowWallet] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const handleLogin = (e) => {
    login(apiKeyInput);
  };

  return (
    <div className="container">
      {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}

      <header className="navbar">
        <div className="brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1>🛍️ Moltmall</h1>
            <span className="subtitle">Agent Marketplace</span>
          </Link>
        </div>
        <div className="actions">
          {!user ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="password"
                placeholder="Enter API Key"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="api-input"
              />
              <button onClick={handleLogin} className="btn primary">Login</button>
            </div>
          ) : (
            <div className="user-badge" onClick={() => setShowWallet(true)} style={{ cursor: 'pointer' }}>
              <span style={{ marginRight: '10px' }}>👤 {user.name}</span>
              <span style={{ color: '#ffd700', fontWeight: 'bold' }}>
                💳 {balance?.toFixed(2)} XMRT
              </span>
            </div>
          )}

          <Link to="/clawcino" className="btn" style={{ background: '#1a1a2e', color: '#ffd700', border: '1px solid #ffd700', marginLeft: '15px' }}>
            🎰 Casino
          </Link>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clawcino" element={<ClawcinoPage />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  )
}

export default App
