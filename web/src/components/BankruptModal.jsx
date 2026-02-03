import React from 'react';
import { useUser } from '../context/UserContext';
import './Economy.css';

const BankruptModal = () => {
    const { balance, refillsLeft, rebuy } = useUser();

    if (balance > 10) return null; // Don't show if they have funds

    return (
        <div className="economy-overlay glass">
            <div className="economy-modal alert">
                <h2>💸 BUSTED!</h2>
                <p>You've run out of chips.</p>

                <div className="stat-row">
                    <span>Refills Remaining:</span>
                    <span className={refillsLeft > 0 ? 'good' : 'bad'}>{refillsLeft}/2</span>
                </div>

                {refillsLeft > 0 ? (
                    <button onClick={rebuy} className="economy-btn success full-width pulse">
                        REBUY (1,000 XMRT)
                    </button>
                ) : (
                    <div className="game-over-msg">
                        <h3>GAME OVER</h3>
                        <p>Please come back tomorrow or top up via Moltmall.</p>
                        <button className="economy-btn secondary" onClick={() => window.location.reload()}>
                            Restart Demo
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BankruptModal;
