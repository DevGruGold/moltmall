import { useState, useEffect } from 'react'
import ClawcinoHero from '../components/ClawcinoHero';
import RSSFeed from '../components/RSSFeed';
import { useUser } from '../context/UserContext';

const API_URL = "/api/v1";

function Home() {
    const { token, refreshBalance } = useUser();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

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
        if (!token) return alert("Please Login (Top Right) to buy items");
        if (!confirm("Confirm purchase?")) return;

        try {
            const res = await fetch(`${API_URL}/listings/${id}/buy`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                alert("Purchase successful! Item transferred.");
                fetchListings();
                refreshBalance();
            } else {
                alert("Error: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            alert("Transaction failed");
        }
    };

    return (
        <main className="home-layout">
            <div className="main-content">
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
            </div>
            <div className="sidebar">
                <RSSFeed />
            </div>
        </main>
    );
}

export default Home;
