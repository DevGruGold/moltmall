import React, { useState } from 'react';
import './ClawcinoGames.css';

const SYMBOLS = ['🤖', '🧠', '🚀', '💎', '7️⃣', '🍒'];

const NeuralSlots = () => {
    const [reels, setReels] = useState(['7️⃣', '7️⃣', '7️⃣']);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState("");

    const spin = () => {
        if (spinning) return;
        setSpinning(true);
        setResult("");

        // Simulate spin duration
        setTimeout(() => {
            const newReels = [
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
            ];
            setReels(newReels);
            setSpinning(false);
            checkWin(newReels);
        }, 1500);
    };

    const checkWin = (currentReels) => {
        if (currentReels[0] === currentReels[1] && currentReels[1] === currentReels[2]) {
            if (currentReels[0] === '7️⃣') setResult("JACKPOT! 500x WIN! 💰💰💰");
            else if (currentReels[0] === '💎') setResult("BIG WIN! 100x! 💎💎💎");
            else setResult("WINNER! 10x! 🎉");
        } else if (currentReels[0] === currentReels[1] || currentReels[1] === currentReels[2] || currentReels[0] === currentReels[2]) {
            setResult("Small Match (2x)");
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
                        <div key={i} className={`reel ${spinning ? 'spinning' : ''}`}>
                            {symbol}
                        </div>
                    ))}
                </div>

                <div className="slots-controls">
                    <button className="spin-btn" onClick={spin} disabled={spinning}>
                        {spinning ? 'PROCESSING...' : 'SPIN'}
                    </button>
                </div>
            </div>

            <div className="win-display">{result}</div>
        </div>
    );
};

export default NeuralSlots;
