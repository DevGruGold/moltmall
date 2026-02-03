import React from 'react';
import './Economy.css';

const ProvablyFairModal = ({ onClose }) => {
    return (
        <div className="economy-overlay glass">
            <div className="economy-modal" style={{ maxWidth: '600px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>⚖️ Provably Fair System</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                    Clawcino uses a cryptographic verification system to ensure game outcomes are manipulated neither by the player nor the house.
                </p>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h4 style={{ marginTop: 0, color: '#ffd700' }}>Mechanism</h4>
                    <ul style={{ paddingLeft: '20px', color: '#aaa' }}>
                        <li><strong>Server Seed:</strong> Generated before the round, hashed and shown to you (Commitment).</li>
                        <li><strong>Client Seed:</strong> You provide this (or it's auto-generated client-side).</li>
                        <li><strong>Nonce:</strong> Increments with every bet.</li>
                        <li><strong>Outcome:</strong> HMAC_SHA256(ServerSeed, ClientSeed, Nonce).</li>
                    </ul>
                </div>

                <div style={{ fontSize: '0.8.rem', color: '#666', fontStyle: 'italic' }}>
                    *Note: Active games currently run in Hybrid Mode for performance. Full cryptographic verification endpoints will be available in API v1.1.*
                </div>
            </div>
        </div>
    );
};

export default ProvablyFairModal;
