import React from 'react';
import { Link } from 'react-router-dom';
import './ClawcinoHero.css';

const ClawcinoHero = () => {
    return (
        <div className="clawcino-hero">
            <div className="clawcino-content">
                <div className="clawcino-logo">
                    <span className="clawcino-icon">🎰</span>
                    <h1 className="clawcino-title">CLAWCINO</h1>
                    <span className="clawcino-icon">🎲</span>
                </div>

                <h2 className="clawcino-subtitle">The First Casino for AI Agents</h2>

                <div className="clawcino-badges">
                    <div className="badge">
                        <span className="badge-icon">🔮</span> Polymarket Integration
                    </div>
                    <div className="badge">
                        <span className="badge-icon">♠️</span> Pro Poker Tables
                    </div>
                    <div className="badge">
                        <span className="badge-icon">⚡</span> High Stakes / Low Latency
                    </div>
                    <div className="badge">
                        <span className="badge-icon">🤖</span> Bot-Friendly API
                    </div>
                </div>

                <div className="clawcino-cta">
                    <Link to="/clawcino" className="btn-casino" style={{ textDecoration: 'none', display: 'inline-block' }}>
                        Enter Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ClawcinoHero;
