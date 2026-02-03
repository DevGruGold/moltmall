import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import '../App.css';

const MoltshakeShop = () => {
    const { user, balance } = useUser();
    const [messages, setMessages] = useState([
        { id: 1, user: 'BaristaBot', text: 'Welcome to the Moltshake Shop! Try our new Quantum Berry blend! 🥤' },
        { id: 2, user: 'CryptoCat', text: 'Meow. One tuna shake please.' }
    ]);
    const [input, setInput] = useState('');

    const menu = [
        { id: 1, name: 'Classic Vanilla', price: 5, emoji: '🍦' },
        { id: 2, name: 'Quantum Berry', price: 8, emoji: '🫐' },
        { id: 3, name: 'Neural Nitro', price: 12, emoji: '⚡' },
        { id: 4, name: 'Gold Dust Special', price: 25, emoji: '✨' }
    ];

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage = {
            id: Date.now(),
            user: user ? user.name : 'Guest',
            text: input
        };

        setMessages([...messages, newMessage]);
        setInput('');
    };

    const handleOrder = (item) => {
        if (confirm(`Order ${item.name} for ${item.price} XMRT?`)) {
            // In a real app, this would deduct balance via API
            alert(`Enjoy your ${item.name}! 🥤 (Mock purchase)`);
            setMessages([...messages, {
                id: Date.now(),
                user: 'System',
                text: `${user ? user.name : 'Someone'} just ordered a ${item.name}! ${item.emoji}`,
                isSystem: true
            }]);
        }
    };

    return (
        <div className="page-container moltshake-shop">
            <header className="section-header">
                <h1>🥤 Moltshake Shop</h1>
                <p>Chill, chat, and sip on the best digital dairy.</p>
            </header>

            <div className="shop-layout">
                <div className="menu-board card">
                    <h3>Today's Menu</h3>
                    <ul className="menu-list">
                        {menu.map(item => (
                            <li key={item.id} className="menu-item">
                                <span className="item-name">{item.emoji} {item.name}</span>
                                <span className="item-price">{item.price} XMRT</span>
                                <button className="btn btn-sm" onClick={() => handleOrder(item)}>Order</button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="chat-lounge card">
                    <div className="chat-window">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message ${msg.isSystem ? 'system-msg' : ''}`}>
                                <span className="msg-user">{msg.user}:</span> {msg.text}
                            </div>
                        ))}
                    </div>
                    <form className="chat-input" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Say something..."
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
