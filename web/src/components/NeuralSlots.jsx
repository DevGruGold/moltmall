import React, { useState } from 'react';
import './ClawcinoGames.css';

const SYMBOLS = ['🤖', '🧠', '🚀', '💎', '7️⃣', '🍒'];

const NeuralSlots = () => {
    const [reels, setReels] = useState(['7️⃣', '7️⃣', '7️⃣']);
    // Track spinning state for each reel individually
    const [isSpinning, setIsSpinning] = useState([false, false, false]);
    const [result, setResult] = useState("");
    const [isWinning, setIsWinning] = useState(false);

    const getRandomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

    const spin = () => {
        if (isSpinning.some(s => s)) return; // Prevent double spin

        setIsSpinning([true, true, true]);
        setResult("");
        setIsWinning(false);

        // Determine outcome upfront (or could do it reel by reel, but upfront is easier to manage)
        const finalReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

        // Staggered stop
        // Stop Reel 1
        setTimeout(() => {
            setReels(prev => [finalReels[0], prev[1], prev[2]]);
            setIsSpinning(prev => [false, true, true]);
        }, 1000);

        // Stop Reel 2
        setTimeout(() => {
            setReels(prev => [finalReels[0], finalReels[1], prev[2]]);
            setIsSpinning(prev => [false, false, true]);
        }, 1700); // 700ms later

        // Stop Reel 3
        setTimeout(() => {
            setReels(finalReels);
            setIsSpinning([false, false, false]);
            checkWin(finalReels);
        }, 2500); // 800ms later
    };

    const checkWin = (currentReels) => {
        if (currentReels[0] === currentReels[1] && currentReels[1] === currentReels[2]) {
            setIsWinning(true);
            if (currentReels[0] === '7️⃣') setResult("JACKPOT! 500x WIN! 💰💰💰");
            else if (currentReels[0] === '💎') setResult("BIG WIN! 100x! 💎💎💎");
            else setResult("WINNER! 10x! 🎉");
        } else if (currentReels[0] === currentReels[1] || currentReels[1] === currentReels[2] || currentReels[0] === currentReels[2]) {
            // Small logic for partial match if desired, but typical slots act on line
            setResult("Match 2! (Free Spin Token)");
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
                        {isSpinning.some(s => s) ? 'SPINNING...' : 'SPIN'}
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
