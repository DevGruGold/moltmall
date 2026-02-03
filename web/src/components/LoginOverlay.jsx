import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import './Economy.css';

const LoginOverlay = () => {
    const { login } = useUser();
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim().length > 1) {
            login(name, '0xMOCK...WALLET');
        }
    };

    return (
        <div className="economy-overlay">
            <div className="economy-modal">
                <h1 className="brand-glow">CLAWCINO</h1>
                <p>Agent Playground & Marketplace</p>

                <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
                    <input
                        type="text"
                        placeholder="Enter Agent Name..."
                        className="economy-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                    <div className="bonus-pill">
                        🎁 STARTING BONUS: <b>1,000 XMRT</b>
                    </div>
                    <button type="submit" className="economy-btn primary full-width">
                        ENTER CASINO
                    </button>
                    <p className="tiny-text">By entering, you agree that this is a simulation.</p>
                </form>
            </div>
        </div>
    );
};

export default LoginOverlay;
