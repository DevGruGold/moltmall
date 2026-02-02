import React, { useState } from 'react';
import './ClawcinoPage.css';

const ClawcinoPage = () => {
    const [activeGame, setActiveGame] = useState('coinflip');
    const [isFlipping, setIsFlipping] = useState(false);
    const [flipResult, setFlipResult] = useState(null);
    const [log, setLog] = useState("");

    const playCoinFlip = (choice) => {
        if (isFlipping) return;
        setIsFlipping(true);
        setLog("Flipping...");
        setFlipResult(null);

        // Simulate network delay / suspense
        setTimeout(() => {
            const outcome = Math.random() > 0.5 ? 'heads' : 'tails';
            setFlipResult(outcome);
            if (outcome === choice) {
                setLog(`Winner! It was ${outcome.toUpperCase()}.`);
            } else {
                setLog(`Lost! It was ${outcome.toUpperCase()}.`);
            }
            setIsFlipping(false);
        }, 2000);
    };

    return (
        <div className="clawcino-container">
            <div className="clawcino-sidebar">
                <h3>Games</h3>
                <div className={`game-nav-item ${activeGame === 'coinflip' ? 'active' : ''}`} onClick={() => setActiveGame('coinflip')}>
                    🪙 Quantum Coin Flip
                </div>
                <div className="game-nav-item" onClick={() => alert("Coming soon!")}>
                    🃏 AI Poker
                </div>
                <div className="game-nav-item" onClick={() => alert("Coming soon!")}>
                    🎰 Neural Slots
                </div>
                <div className="game-nav-item" onClick={() => alert("Coming soon!")}>
                    🔮 Polymarket Odds
                </div>
            </div>

            <div className="clawcino-main">
                <div className="clawcino-header">
                    <div>
                        <h1>CLAWCINO</h1>
                        <span style={{ color: '#a0a0b0' }}>Proven Fair • Low Latency</span>
                    </div>
                    <div className="jackpot-counter">
                        JACKPOT: 1,024,500 XMRT
                    </div>
                </div>

                <div className="game-area">
                    {activeGame === 'coinflip' && (
                        <div className="coin-flip-game">
                            <h2>Quantum Coin Flip</h2>
                            <p style={{ marginBottom: '30px', color: '#a0a0b0' }}>50/50 Probability. 100% Excitement.</p>

                            <div className={`coin ${isFlipping ? 'flipping' : ''}`}>
                                {isFlipping ? '?' : (flipResult === 'tails' ? 'T' : 'H')}
                            </div>

                            <div className="bet-controls">
                                <button
                                    className="bet-btn heads"
                                    disabled={isFlipping}
                                    onClick={() => playCoinFlip('heads')}
                                >
                                    HEADS
                                </button>
                                <button
                                    className="bet-btn tails"
                                    disabled={isFlipping}
                                    onClick={() => playCoinFlip('tails')}
                                >
                                    TAILS
                                </button>
                            </div>

                            <div className={`result-message ${log.includes("Winner") ? 'win' : 'lose'}`}>
                                {log}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClawcinoPage;
