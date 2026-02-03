import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import './Economy.css';

const LoginOverlay = () => {
    const { login, loginWithProvider } = useUser();
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

                <div className="auth-buttons" style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                        onClick={() => loginWithProvider('google')}
                        className="economy-btn primary full-width"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                    >
                        <span>🌐</span> Sign in with Google
                    </button>

                    <button
                        onClick={() => loginWithProvider('github')}
                        className="economy-btn full-width"
                        style={{ background: '#333', border: '1px solid #555', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                    >
                        <span>🐙</span> Sign in with GitHub
                    </button>

                    <div className="divider" style={{ margin: '15px 0', color: '#666', fontSize: '0.8rem' }}>
                        OR ENTER DEMO MODE
                    </div>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Enter Agent Name (Demo)..."
                            className="economy-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <button type="submit" className="economy-btn active-text" style={{ width: '100%', marginTop: '10px' }}>
                            Start Simulation
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginOverlay;
