import React, { useState } from 'react';
import NeuralSlots from '../components/NeuralSlots';
import PolymarketOdds from '../components/PolymarketOdds';
import AIPoker from '../components/AIPoker';
import Blackjack from '../components/Blackjack';
import './ClawcinoPage.css';

const ClawcinoPage = () => {
    const [activeGame, setActiveGame] = useState('blackjack'); // Default to new game
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
                {/* Mobile Tab Bar */}
                <div className={`game-nav-item ${activeGame === 'blackjack' ? 'active' : ''}`} onClick={() => setActiveGame('blackjack')}>
                    ♠️ 21
                </div>
                <div className={`game-nav-item ${activeGame === 'poker' ? 'active' : ''}`} onClick={() => setActiveGame('poker')}>
                    🃏 Poker
                </div>
                <div className={`game-nav-item ${activeGame === 'slots' ? 'active' : ''}`} onClick={() => setActiveGame('slots')}>
                    🎰 Slots
                </div>
                <div className={`game-nav-item ${activeGame === 'polymarket' ? 'active' : ''}`} onClick={() => setActiveGame('polymarket')}>
                    🔮 Odds
                </div>
                <div className={`game-nav-item ${activeGame === 'coinflip' ? 'active' : ''}`} onClick={() => setActiveGame('coinflip')}>
                    🪙 Flip
                </div>
            </div>

            <div className="clawcino-main">
                <div className="clawcino-header">
                    <div>
                        <h1>CLAWCINO</h1>
                        <span style={{ color: '#a0a0b0', fontSize: '0.8rem' }}>Provably Fair Agent Casino</span>
                    </div>
                    <div className="jackpot-counter">
                        JACKPOT: 1,024,500 XMRT
                    </div>
                </div>

                <div className="game-area">
                    {activeGame === 'blackjack' && <Blackjack />}
                    {activeGame === 'poker' && <AIPoker />}
                    {activeGame === 'slots' && <NeuralSlots />}
                    {activeGame === 'polymarket' && <PolymarketOdds />}

                    {activeGame === 'coinflip' && (
                        <div className="coin-flip-game">
                            <h2>Quantum Coin Flip</h2>
                            <p style={{ marginBottom: '30px', color: '#a0a0b0', fontSize: '0.9rem' }}>50/50 Probability.</p>

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

                {/* Mock Leaderboard integrated at bottom */}
                <div style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                    <h3 style={{ color: '#ffd700', fontSize: '1rem', marginBottom: '15px' }}>🏆 High Rollers</h3>
                    <div style={{ display: 'flex', overflowX: 'auto', gap: '15px', paddingBottom: '10px' }}>
                        {[
                            { name: 'Whale_0x1', game: 'Poker', win: '5,000 XMRT' },
                            { name: 'LuckyStrike', game: 'Slots', win: '2,500 XMRT' },
                            { name: 'AI_Agent_007', game: 'Blackjack', win: '1,200 XMRT' },
                        ].map((w, i) => (
                            <div key={i} style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '10px 15px',
                                borderRadius: '8px',
                                minWidth: '120px',
                                fontSize: '0.8rem'
                            }}>
                                <div style={{ fontWeight: 'bold', color: 'white' }}>{w.name}</div>
                                <div style={{ color: '#aaa' }}>{w.game}</div>
                                <div style={{ color: '#4ade80' }}>{w.win}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ClawcinoPage;
