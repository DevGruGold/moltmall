import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import './ClawcinoGames.css';

const SUITS = ['♠', '♥', '♣', '♦'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const createDeck = () => {
    let deck = [];
    SUITS.forEach(suit => {
        VALUES.forEach(value => {
            let weight = parseInt(value);
            if (['J', 'Q', 'K'].includes(value)) weight = 10;
            if (value === 'A') weight = 11;
            deck.push({ suit, value, weight, color: (suit === '♥' || suit === '♦') ? 'red' : 'black' });
        });
    });
    return deck.sort(() => Math.random() - 0.5);
};

const calculateScore = (hand) => {
    let score = 0;
    let aces = 0;
    hand.forEach(card => {
        score += card.weight;
        if (card.value === 'A') aces += 1;
    });
    while (score > 21 && aces > 0) {
        score -= 10;
        aces -= 1;
    }
    return score;
};

const Blackjack = () => {
    const { placeBet, payout } = useUser();
    const [gameState, setGameState] = useState('idle'); // idle, playing, dealerTurn, gameOver
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [result, setResult] = useState("");
    const [message, setMessage] = useState("Cost: 20 XMRT");
    const [betAmount] = useState(20);

    const deal = () => {
        if (!placeBet(betAmount)) {
            setMessage("Insufficient Funds!");
            return;
        }

        const newDeck = createDeck();
        const pHand = [newDeck.pop(), newDeck.pop()];
        const dHand = [newDeck.pop(), newDeck.pop()];

        setDeck(newDeck);
        setPlayerHand(pHand);
        setDealerHand(dHand);
        setGameState('playing');
        setMessage("Your move...");
        setResult("");

        // Immediate Blackjack check
        if (calculateScore(pHand) === 21) {
            handleGameOver(pHand, dHand, 'Blackjack! You Win! 💰', true);
        }
    };

    const hit = () => {
        const newDeck = [...deck];
        const newHand = [...playerHand, newDeck.pop()];
        setDeck(newDeck);
        setPlayerHand(newHand);

        if (calculateScore(newHand) > 21) {
            handleGameOver(newHand, dealerHand, 'Bust! You Lose.', false);
        }
    };

    const stand = () => {
        setGameState('dealerTurn');
        let dHand = [...dealerHand];
        let dScore = calculateScore(dHand);
        let currentDeck = [...deck];

        while (dScore < 17) {
            dHand.push(currentDeck.pop());
            dScore = calculateScore(dHand);
        }

        setDeck(currentDeck);
        setDealerHand(dHand);

        const pScore = calculateScore(playerHand);
        let gameResult = "";
        let won = false;

        if (dScore > 21) { gameResult = "Dealer Busts! You Win! 🎉"; won = true; }
        else if (pScore > dScore) { gameResult = "You Win! 🏆"; won = true; }
        else if (dScore > pScore) { gameResult = "Dealer Wins."; won = false; }
        else { gameResult = "Push (Tie)."; payout(betAmount); } // Return bet

        handleGameOver(playerHand, dHand, gameResult, won);
    };

    const handleGameOver = (pHand, dHand, res, won) => {
        setGameState('gameOver');
        setMessage(res);
        if (won) payout(betAmount * 2); // 1:1 win
    };

    const Card = ({ card, hidden }) => {
        if (hidden) return <div className="card back"></div>;
        return (
            <div className={`card ${card.color}`}>
                <div>{card.value}</div>
                <div>{card.suit}</div>
            </div>
        );
    };

    return (
        <div className="game-container blackjack-container">
            <h2 className="game-title">Agents Blackjack</h2>
            <p className="game-desc">Dealer stands on 17. Pays 1:1.</p>

            <div className="blackjack-table">
                {/* Dealer Area */}
                <div className="hand-area dealer-area">
                    <div className="score-bubble">
                        {gameState === 'playing' ? '?' : calculateScore(dealerHand)}
                    </div>
                    <div className="cards-row">
                        {dealerHand.map((c, i) => (
                            <Card key={i} card={c} hidden={i === 0 && gameState === 'playing'} />
                        ))}
                    </div>
                    <div className="label">DEALER BOT</div>
                </div>

                <div className="center-info">
                    {gameState === 'gameOver' && <div className="result-banner">{message}</div>}
                </div>

                {/* Player Area */}
                <div className="hand-area player-area">
                    <div className="label">YOU</div>
                    <div className="cards-row">
                        {playerHand.map((c, i) => <Card key={i} card={c} />)}
                    </div>
                    <div className="score-bubble player-score">
                        {calculateScore(playerHand)}
                    </div>
                </div>
            </div>

            <div className="poker-controls">
                {gameState === 'idle' || gameState === 'gameOver' ? (
                    <button className="action-btn primary" onClick={deal}>
                        {gameState === 'idle' ? `DEAL (${betAmount} XMRT)` : 'PLAY AGAIN'}
                    </button>
                ) : (
                    <>
                        <button className="action-btn hit" onClick={hit}>HIT</button>
                        <button className="action-btn stand" onClick={stand}>STAND</button>
                    </>
                )}
            </div>
            <div className="win-display">{message}</div>
        </div>
    );
};

export default Blackjack;
