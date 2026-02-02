import React, { useState, useEffect } from 'react';
import './ClawcinoGames.css';

const SUITS = ['♠', '♥', '♣', '♦'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Helper to create a deck
const createDeck = () => {
    let deck = [];
    SUITS.forEach(suit => {
        VALUES.forEach(value => {
            deck.push({ suit, value, color: (suit === '♥' || suit === '♦') ? 'red' : 'black' });
        });
    });
    return deck.sort(() => Math.random() - 0.5); // Simple shuffle
};

const AIPoker = () => {
    const [gameState, setGameState] = useState('idle'); // idle, dealing, preflop, flop, turn, river, showdown
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [communityCards, setCommunityCards] = useState([]);
    const [log, setLog] = useState("Press Deal to start.");
    const [pot, setPot] = useState(0);

    const deal = () => {
        const newDeck = createDeck();
        const pHand = [newDeck.pop(), newDeck.pop()];
        // Burn mock cards for opponents internally to keep deck accurate
        newDeck.pop(); newDeck.pop(); // Opp 1
        newDeck.pop(); newDeck.pop(); // Opp 2
        newDeck.pop(); newDeck.pop(); // Opp 3

        setDeck(newDeck);
        setPlayerHand(pHand);
        setCommunityCards([]);
        setGameState('preflop');
        setLog("Pre-flop: Your turn.");
        setPot(50); // Blinds
    };

    const nextStage = () => {
        const currentDeck = [...deck];
        let newCommunity = [...communityCards];

        if (gameState === 'preflop') {
            currentDeck.pop(); // Burn
            newCommunity.push(currentDeck.pop(), currentDeck.pop(), currentDeck.pop()); // Flop
            setGameState('flop');
            setLog("The Flop.");
        } else if (gameState === 'flop') {
            currentDeck.pop(); // Burn
            newCommunity.push(currentDeck.pop()); // Turn
            setGameState('turn');
            setLog("The Turn.");
        } else if (gameState === 'turn') {
            currentDeck.pop(); // Burn
            newCommunity.push(currentDeck.pop()); // River
            setGameState('river');
            setLog("The River.");
        } else if (gameState === 'river') {
            setGameState('showdown');
            // Mock showdown
            const win = Math.random() > 0.5;
            setLog(win ? "Showdown: You Win! +$250" : "Showdown: Opponent 2 Wins with Two Pair.");
        }

        setDeck(currentDeck);
        setCommunityCards(newCommunity);
    };

    const handleAction = (action) => {
        if (action === 'fold') {
            setGameState('idle');
            setLog("You Folded.");
            setPlayerHand([]);
            setCommunityCards([]);
        } else {
            setPot(pot + 50); // Mock bet
            setLog(`You ${action}ed.`);
            setTimeout(nextStage, 500);
        }
    };

    const Card = ({ card, hidden }) => {
        if (!card || hidden) return <div className="card back"></div>;
        return (
            <div className={`card ${card.color}`}>
                <div>{card.value}</div>
                <div>{card.suit}</div>
            </div>
        );
    };

    return (
        <div className="game-container poker-container">
            <h2 className="game-title">AI Poker</h2>
            <p className="game-desc">Texas Hold'em vs Neural Nets</p>

            <div className="poker-table">
                {/* Opponents */}
                <div className="opponent-seat opponent-1">
                    <div className="avatar">🤖</div>
                    <div className="player-hand">
                        <Card hidden={true} />
                        <Card hidden={true} />
                    </div>
                </div>
                <div className="opponent-seat opponent-2">
                    <div className="avatar">👺</div>
                    <div className="player-hand">
                        <Card hidden={true} />
                        <Card hidden={true} />
                    </div>
                </div>
                <div className="opponent-seat opponent-3">
                    <div className="avatar">👽</div>
                    <div className="player-hand">
                        <Card hidden={true} />
                        <Card hidden={true} />
                    </div>
                </div>

                {/* Community Cards */}
                <div className="board-area">
                    {communityCards.map((c, i) => <Card key={i} card={c} />)}
                </div>

                {/* Player */}
                <div className="player-seat">
                    <div className="avatar active" style={{ border: '2px solid #4ade80' }}>👤</div>
                    <div className="player-hand">
                        {playerHand.map((c, i) => <Card key={i} card={c} />)}
                    </div>
                </div>
            </div>

            <div className="game-log">{log}</div>

            <div className="poker-controls">
                {gameState === 'idle' || gameState === 'showdown' ? (
                    <button className="action-btn primary" onClick={deal}>DEAL HAND</button>
                ) : (
                    <>
                        <button className="action-btn fold" onClick={() => handleAction('fold')}>FOLD</button>
                        <button className="action-btn" onClick={() => handleAction('check')}>CHECK</button>
                        <button className="action-btn primary" onClick={() => handleAction('raise')}>RAISE</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AIPoker;
