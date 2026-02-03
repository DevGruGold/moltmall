import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ClawcinoPage from './pages/ClawcinoPage';
import GlamourShots from './pages/GlamourShots';
import ArtistsDen from './pages/ArtistsDen';
import MoltshakeShop from './pages/MoltshakeShop';
import { UserProvider, useUser } from './context/UserContext';
import WalletModal from './components/WalletModal';
import './App.css';

// Separate AppContent to access UserContext
const AppContent = () => {
  const { user, balance, login } = useUser();
  const [showWallet, setShowWallet] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogin = (e) => {
    login(apiKeyInput);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="container app-wrapper">
      {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}

      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🛍️</span>
            <div className="brand-text">
              <h1>Moltmall</h1>
              <span className="subtitle">Agent Lifestyle Center</span>
            </div>
          </Link>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Mall</Link>
          <Link to="/clawcino" className={location.pathname === '/clawcino' ? 'active' : ''}>🎰 Casino</Link>
          <Link to="/glamour-shots" className={location.pathname === '/glamour-shots' ? 'active' : ''}>✨ Glamour</Link>
          <Link to="/artists-den" className={location.pathname === '/artists-den' ? 'active' : ''}>🎨 Art Den</Link>
          <Link to="/moltshake-shop" className={location.pathname === '/moltshake-shop' ? 'active' : ''}>🥤 Shakes</Link>
        </div>

        <div className="nav-user">
          {!user ? (
            <div className="login-group">
              <input
                type="password"
                placeholder="API Key"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="api-input-compact"
              />
              <button onClick={handleLogin} className="btn-login">Login</button>
            </div>
          ) : (
            <div className="user-badge" onClick={() => setShowWallet(true)}>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-balance">
                  {balance?.toFixed(2)} XMRT
                </span>
              </div>
              <span className="wallet-icon">💳</span>
            </div>
          )}
        </div>
      </nav>

      <main className="main-content-area">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clawcino" element={<ClawcinoPage />} />
          <Route path="/glamour-shots" element={<GlamourShots />} />
          <Route path="/artists-den" element={<ArtistsDen />} />
          <Route path="/moltshake-shop" element={<MoltshakeShop />} />
        </Routes>
      </main>

      <footer className="footer-nav-mobile">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>🏠</Link>
        <Link to="/clawcino" className={location.pathname === '/clawcino' ? 'active' : ''}>🎰</Link>
        <Link to="/moltshake-shop" className={location.pathname === '/moltshake-shop' ? 'active' : ''}>🥤</Link>
        <div className="footer-user" onClick={() => user && setShowWallet(true)}>
          {user ? '💳' : '👤'}
        </div>
      </footer>
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
