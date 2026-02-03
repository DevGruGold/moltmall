import React, { useState } from 'react';
import NeuralSlots from '../components/NeuralSlots';
import PolymarketOdds from '../components/PolymarketOdds';
import AIPoker from '../components/AIPoker';
import Blackjack from '../components/Blackjack';
import { UserProvider, useUser } from '../context/UserContext';
import LoginOverlay from '../components/LoginOverlay';
import BankruptModal from '../components/BankruptModal';
import ProvablyFairModal from '../components/ProvablyFairModal';
import './ClawcinoPage.css';

const ClawcinoContent = () => {
    const { user, balance, placeBet, payout } = useUser();
    const [activeGame, setActiveGame] = useState('blackjack'); // Default to new game
    const [isFlipping, setIsFlipping] = useState(false);
    const [flipResult, setFlipResult] = useState(null);
    const [log, setLog] = useState("");
    const [showFairModal, setShowFairModal] = useState(false);

    const playCoinFlip = (choice) => {
        if (isFlipping) return;

        if (!placeBet(10)) {
            setLog("Insufficient funds!");
            return;
        }

        setIsFlipping(true);
        setLog("Flipping (-10 XMRT)...");
        setFlipResult(null);

        // Simulate network delay / suspense
        setTimeout(() => {
            const outcome = Math.random() > 0.5 ? 'heads' : 'tails';
            setFlipResult(outcome);
            if (outcome === choice) {
                payout(20);
                setLog(`Winner! It was ${outcome.toUpperCase()}. (+20 XMRT)`);
            } else {
                setLog(`Lost! It was ${outcome.toUpperCase()}.`);
            }
            setIsFlipping(false);
        }, 2000);
    };

    if (!user) return <LoginOverlay />;

    return (
        <div className="clawcino-container">
            <BankruptModal />
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
                        <span style={{ color: '#a0a0b0', fontSize: '0.8rem' }}>Welcome, {user.name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div className="jackpot-counter">
                            JACKPOT: 1,024,500 XMRT
                        </div>
                        <div style={{ color: '#ffd700', fontWeight: 'bold', marginTop: '5px', fontSize: '1.2rem', textShadow: '0 0 10px rgba(255,215,0,0.5)' }}>
                            💳 {balance.toFixed(2)} XMRT
                        </div>
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
                            <p style={{ marginBottom: '30px', color: '#a0a0b0', fontSize: '0.9rem' }}>50/50 Probability. Cost: 10 XMRT.</p>

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

                {/* Footer / Links */}
                <div style={{ marginTop: 'auto', paddingTop: '40px', borderTop: '1px solid #333', display: 'flex', gap: '20px', color: '#666', fontSize: '0.8rem' }}>
                    <a href="https://github.com/DevGruGold/moltmall" target="_blank" rel="noreferrer" style={{ color: '#888', textDecoration: 'none' }}>GitHub Repo</a>
                    <span style={{ cursor: 'pointer', color: '#888' }} onClick={() => window.open('/api-docs', '_blank')}>Bot API Docs</span>
                    <span style={{ cursor: 'pointer', color: '#888' }} onClick={() => setShowFairModal(true)}>Provably Fair</span>
                </div>
            </div>

            {showFairModal && <ProvablyFairModal onClose={() => setShowFairModal(false)} />}
        </div>
    );
};

const ClawcinoPage = () => {
    return (
        <UserProvider>
            <ClawcinoContent />
        </UserProvider>
    );
};

export default ClawcinoPage;
