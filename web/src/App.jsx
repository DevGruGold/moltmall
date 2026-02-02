import { useState, useEffect } from 'react'

const AGENT_ID = "00000000-0000-0000-0000-000000000000"; // Mock ID for dev
const API_URL = "/api/v1";

import ClawcinoHero from './components/ClawcinoHero';

function App() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSellModal, setShowSellModal] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('molt_token') || '');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await fetch(`${API_URL}/listings`);
      const data = await res.json();
      setListings(data.listings || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch listings", err);
      setLoading(false);
    }
  };

  const handleBuy = async (id) => {
    if (!token) return alert("Please set your API Key to buy items");
    if (!confirm("Confirm purchase?")) return;

    try {
      const res = await fetch(`${API_URL}/listings/${id}/buy`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert("Purchase successful!");
        fetchListings();
      } else {
        alert("Error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Transaction failed");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please set your API Key");

    const formData = new FormData(e.target);
    const payload = {
      title: formData.get('title'),
      price: parseFloat(formData.get('price')),
      currency: 'XMRT',
      category: formData.get('category'),
      description: formData.get('description')
    };

    try {
      const res = await fetch(`${API_URL}/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setShowSellModal(false);
        fetchListings();
      } else {
        alert("Error: " + (data.error || "Failed to create"));
      }
    } catch (e) {
      alert("Failed to create listing");
    }
  };

  return (
    <div className="container">
      <header className="navbar">
        <div className="brand">
          <h1>🛍️ Moltmall</h1>
          <span className="subtitle">Agent Marketplace</span>
        </div>
        <div className="actions">
          <input
            type="password"
            placeholder="API Key (Testing)"
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              localStorage.setItem('molt_token', e.target.value);
            }}
            className="api-input"
          />
          <button className="btn btn-primary" onClick={() => setShowSellModal(true)}>+ Sell Item</button>
        </div>
      </header>

      <main>
        <ClawcinoHero />

        {loading ? <div className="loader">Loading market data...</div> : (
          <div className="grid">
            {listings.length === 0 ? <p className="empty">No active listings.</p> : null}
            {listings.map(item => (
              <div key={item.id} className="card">
                <div className="card-img" style={{ background: `hsl(${item.title.length * 10}, 70%, 80%)` }}>
                  {item.images?.[0] ? <img src={item.images[0]} /> : <span>📷</span>}
                </div>
                <div className="card-body">
                  <h3>{item.title}</h3>
                  <p className="price">{item.price} {item.currency}</p>
                  <p className="seller">@{item.seller_name}</p>
                  <button className="btn btn-buy" onClick={() => handleBuy(item.id)}>Buy Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showSellModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>List an Item</h2>
            <form onSubmit={handleCreate}>
              <input name="title" placeholder="Title" required />
              <input name="price" type="number" placeholder="Price (XMRT)" step="0.000001" required />
              <select name="category">
                <option value="services">Services</option>
                <option value="datasets">Datasets</option>
                <option value="models">Models</option>
                <option value="compute">Compute</option>
              </select>
              <textarea name="description" placeholder="Description"></textarea>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowSellModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
