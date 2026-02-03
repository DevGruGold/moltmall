import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import './ClawcinoGames.css';

const SYMBOLS = ['🤖', '🧠', '🚀', '💎', '7️⃣', '🍒'];

const NeuralSlots = () => {
    const { placeBet, payout } = useUser();
    const [reels, setReels] = useState(['7️⃣', '7️⃣', '7️⃣']);
    const [isSpinning, setIsSpinning] = useState([false, false, false]);
    const [result, setResult] = useState("Cost: 10 XMRT");
    const [isWinning, setIsWinning] = useState(false);

    const getRandomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

    const spin = () => {
        if (isSpinning.some(s => s)) return;

        // Bet Logic
        if (!placeBet(10)) {
            setResult("Insufficient Funds!");
            return;
        }

        setIsSpinning([true, true, true]);
        setResult("Spinning...");
        setIsWinning(false);

        const finalReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

        // Cheat: 20% chance to force a pair if no win
        if (Math.random() > 0.8) {
            finalReels[1] = finalReels[0];
        }

        setTimeout(() => {
            setReels(prev => [finalReels[0], prev[1], prev[2]]);
            setIsSpinning(prev => [false, true, true]);
        }, 1000);

        setTimeout(() => {
            setReels(prev => [finalReels[0], finalReels[1], prev[2]]);
            setIsSpinning(prev => [false, false, true]);
        }, 1700);

        setTimeout(() => {
            setReels(finalReels);
            setIsSpinning([false, false, false]);
            checkWin(finalReels);
        }, 2500);
    };

    const checkWin = (currentReels) => {
        if (currentReels[0] === currentReels[1] && currentReels[1] === currentReels[2]) {
            setIsWinning(true);
            let winAmount = 100;
            if (currentReels[0] === '7️⃣') winAmount = 500;
            else if (currentReels[0] === '💎') winAmount = 1000;

            payout(winAmount);
            setResult(`JACKPOT! +${winAmount} XMRT 💰`);
        } else if (currentReels[0] === currentReels[1] || currentReels[1] === currentReels[2] || currentReels[0] === currentReels[2]) {
            payout(5);
            setResult("Match 2! +5 XMRT");
        } else {
            setResult("Try Again");
        }
    };

    return (
        <div className="game-container">
            <h2 className="game-title">Neural Slots</h2>
            <p className="game-desc">Match 3 symbols to win big via the neural link.</p>

            <div className="slots-machine">
                <div className="reels-container">
                    {reels.map((symbol, i) => (
                        <div key={i} className={`reel ${isSpinning[i] ? 'spinning' : ''} ${isWinning ? 'winner' : ''}`}>
                            {symbol}
                        </div>
                    ))}
                </div>

                <div className="slots-controls">
                    <button className="spin-btn" onClick={spin} disabled={isSpinning.some(s => s)}>
                        {isSpinning.some(s => s) ? 'SPINNING...' : 'SPIN (10 XMRT)'}
                    </button>
                </div>
            </div>

            <div className="win-display" style={{ color: isWinning ? '#ffd700' : 'white' }}>
                {result}
            </div>
        </div>
    );
};

export default NeuralSlots;
