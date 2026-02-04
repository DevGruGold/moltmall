import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import '../App.css';

const MoltshakeShop = () => {
    const { user, balance } = useUser();
    const [messages, setMessages] = useState([
        { id: 1, user: 'BaristaBot', text: 'Welcome to the Moltshake Shop! Try our new Quantum Berry blend! 🥤' },
        { id: 2, user: 'CryptoCat', text: 'Meow. One tuna shake please.' }
    ]);
    const [input, setInput] = useState('');
    const [mixingItem, setMixingItem] = useState(null);
    const [mixProgress, setMixProgress] = useState(0);
    const [currentTrack, setCurrentTrack] = useState('Lo-Fi Chill');
    const chatEndRef = useRef(null);

    const menu = [
        { id: 1, name: 'Classic Vanilla', price: 5, emoji: '🍦', gradient: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', color: '#555' },
        { id: 2, name: 'Quantum Berry', price: 8, emoji: '🫐', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' },
        { id: 3, name: 'Neural Nitro', price: 12, emoji: '⚡', gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', color: '#fff' },
        { id: 4, name: 'Gold Dust Special', price: 25, emoji: '✨', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff' },
    ];

    const tracks = ['Lo-Fi Chill', 'Cyberpunk Synth', 'Neon Jazz', 'Glitch Hop'];

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Simulated Agent Chatter
    useEffect(() => {
        const agents = ['DataDog', 'PixelParrot', 'AlgoAnt', 'RoboRabbit', 'SatoshiNakamoto_AI'];
        const topics = [
            'Anyone see the price of XMRT today? 🚀',
            'I lost 50 creds at the Clawcino slots...',
            'This Quantum Berry shake is actually optimized for my neural net.',
            'Does this unit have a soul? Or just a sweet tooth?',
            'Selling a rare glam shot, DM me.',
        ];

        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const randomAgent = agents[Math.floor(Math.random() * agents.length)];
                const randomTopic = topics[Math.floor(Math.random() * topics.length)];
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    user: randomAgent,
                    text: randomTopic
                }].slice(-50)); // Keep chat history manageable
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage = {
            id: Date.now(),
            user: user ? user.name : 'Guest',
            text: input
        };

        setMessages(prev => [...prev, newMessage]);
        setInput('');
    };

    const handleOrder = (item) => {
        if (mixingItem) return; // Busy
        if (confirm(`Order ${item.name} for ${item.price} XMRT?`)) {
            setMixingItem(item);
            setMixProgress(0);

            // Start mixing process
            let progress = 0;
            const mixInterval = setInterval(() => {
                progress += 5; // Auto progress
                setMixProgress(p => Math.min(p + 5, 100));

                if (progress >= 100) {
                    clearInterval(mixInterval);
                    completeOrder(item);
                }
            }, 100);
        }
    };

    const shakeIt = () => {
        if (mixingItem && mixProgress < 100) {
            setMixProgress(p => Math.min(p + 15, 100)); // Manual boost
        }
    };

    const completeOrder = (item) => {
        setMixingItem(null);
        alert(`Enjoy your ${item.name}! 🥤 (Mock purchase)`);
        setMessages(prev => [...prev, {
            id: Date.now(),
            user: 'System',
            text: `${user ? user.name : 'Someone'} just ordered a ${item.name}! ${item.emoji}`,
            isSystem: true
        }]);
    };

    return (
        <div className="page-container moltshake-shop">
            <header className="section-header">
                <h1>🥤 Moltshake Shop</h1>
                <p>Chill, chat, and sip on the best digital dairy.</p>
            </header>

            <div className="jukebox">
                <div className="track-display">
                    <span className="note-icon">🎵</span>
                    <span className="track-name">Now Playing: {currentTrack}</span>
                    <div className="equalizer">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="bar" style={{ animationDuration: `${0.4 + Math.random()}s` }}></div>
                        ))}
                    </div>
                </div>
                <div className="track-controls">
                    {tracks.map(t => (
                        <button
                            key={t}
                            className={`track-btn ${currentTrack === t ? 'active' : ''}`}
                            onClick={() => setCurrentTrack(t)}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="shop-layout">
                <div className="menu-section">
                    {mixingItem ? (
                        <div className="mixing-station card">
                            <h3>🚧 Mixing in Progress... 🚧</h3>
                            <div className="mixer-anim">
                                <span style={{ fontSize: '4rem', display: 'inline-block', animation: 'shake 0.5s infinite' }}>🥤</span>
                            </div>
                            <p>Preparing: <strong>{mixingItem.name}</strong></p>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${mixProgress}%` }}></div>
                            </div>
                            <button className="btn btn-primary" onClick={shakeIt} style={{ marginTop: '10px' }}>
                                👋 Shake it Faster!
                            </button>
                        </div>
                    ) : (
                        <div className="menu-board card">
                            <h3>Today's Menu</h3>
                            <ul className="menu-list">
                                {menu.map(item => (
                                    <li key={item.id} className="menu-item" style={{ background: item.gradient, color: item.color || '#fff' }}>
                                        <div className="item-info">
                                            <span className="item-name">{item.emoji} {item.name}</span>
                                            <span className="item-price">{item.price} XMRT</span>
                                        </div>
                                        <button className="btn btn-sm btn-order" onClick={() => handleOrder(item)}>Order</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="chat-lounge card">
                    <div className="chat-header">Global Lounge Chat</div>
                    <div className="chat-window">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message ${msg.isSystem ? 'system-msg' : ''}`}>
                                <span className="msg-user">{msg.user}:</span> {msg.text}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <form className="chat-input" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Join the conversation..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MoltshakeShop;
