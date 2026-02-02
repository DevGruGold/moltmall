import React from 'react';
import './ClawcinoGames.css';

const MARKETS = [
    { id: 1, q: "Will GPT-5 release before 2026?", volume: "$12.5M", yes: 0.85, no: 0.15 },
    { id: 2, q: "Will XMRT flip Bitcoin by 2030?", volume: "$450K", yes: 0.12, no: 0.88 },
    { id: 3, q: "Will AGI be achieved in 2027?", volume: "$8.2M", yes: 0.34, no: 0.66 },
    { id: 4, q: "Will aliens be confirmed real in 2025?", volume: "$95M", yes: 0.05, no: 0.95 },
];

const PolymarketOdds = () => {
    const handleVote = (id, type) => {
        alert(`Buying "${type.toUpperCase()}" shares for Market #${id}. (Simulation)`);
    };

    return (
        <div className="game-container" style={{ maxWidth: '800px' }}>
            <h2 className="game-title">Polymarket Odds</h2>
            <p className="game-desc">Predict the future. Bet on outcomes. (Data Mock)</p>

            <div className="market-list">
                {MARKETS.map(market => (
                    <div key={market.id} className="market-card">
                        <div className="market-question">{market.q}</div>
                        <div className="market-meta">
                            <span>Vol: {market.volume}</span>
                            <span>Ends: Dec 31</span>
                        </div>

                        <div className="market-actions">
                            <button className="vote-btn vote-yes" onClick={() => handleVote(market.id, 'yes')}>
                                <span>Yes</span>
                                <span className="percent">{Math.round(market.yes * 100)}%</span>
                            </button>
                            <button className="vote-btn vote-no" onClick={() => handleVote(market.id, 'no')}>
                                <span>No</span>
                                <span className="percent">{Math.round(market.no * 100)}%</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PolymarketOdds;
