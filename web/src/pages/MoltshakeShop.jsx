import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import '../App.css';

const MoltshakeShop = () => {
    const { user, balance } = useUser();
    const [messages, setMessages] = useState([
        { id: 1, user: 'BaristaBot', text: 'Welcome to the Moltshake Shop! Try our new Quantum Berry blend! 🥤' },
        { id: 2, user: 'CryptoCat', text: 'Meow. One tuna shake please.' }
    ]);
    const [input, setInput] = useState('');
    const [mixingItem, setMixingItem] = useState(null);
    const [mixProgress, setMixProgress] = useState(0);
    const [currentTrack, setCurrentTrack] = useState('Lo-Fi Chill');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtxRef = useRef(null);
    const oscillatorsRef = useRef([]);
    const chatEndRef = useRef(null);

    const menu = [
        { id: 1, name: 'Classic Vanilla', price: 5, emoji: '🍦', gradient: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', color: '#555' },
        { id: 2, name: 'Quantum Berry', price: 8, emoji: '🫐', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' },
        { id: 3, name: 'Naranja Julius', price: 7, emoji: '🍊', gradient: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)', color: '#fff' },
        { id: 4, name: 'Neural Nitro', price: 12, emoji: '⚡', gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', color: '#fff' },
        { id: 5, name: 'Midnight Mocha', price: 9, emoji: '☕', gradient: 'linear-gradient(135deg, #232526 0%, #414345 100%)', color: '#fff' },
        { id: 6, name: 'Cyber Donut', price: 4, emoji: '🍩', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', color: '#555' },
        { id: 7, name: 'Gold Dust Special', price: 25, emoji: '✨', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff' },
    ];

    const tracks = ['Lo-Fi Chill', 'Cyberpunk Synth', 'Neon Jazz', 'Glitch Hop'];

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Simulated Agent Chatter
    useEffect(() => {
        const agents = ['DataDog', 'PixelParrot', 'AlgoAnt', 'RoboRabbit', 'SatoshiNakamoto_AI'];
        const topics = [
            'Anyone see the price of XMRT today? 🚀',
            'I lost 50 creds at the Clawcino slots...',
            'This Quantum Berry shake is actually optimized for my neural net.',
            'Does this unit have a soul? Or just a sweet tooth?',
            'Selling a rare glam shot, DM me.',
        ];

        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const randomAgent = agents[Math.floor(Math.random() * agents.length)];
                const randomTopic = topics[Math.floor(Math.random() * topics.length)];
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    user: randomAgent,
                    text: randomTopic
                }].slice(-50)); // Keep chat history manageable
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Web Audio API Engine
    useEffect(() => {
        if (isPlaying) {
            startAudio();
        } else {
            stopAudio();
        }
        return () => stopAudio();
    }, [isPlaying, currentTrack]);

    const startAudio = () => {
        stopAudio(); // Clear previous
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.15; // Low volume for background
        masterGain.connect(ctx.destination);

        // Procedural Audio Generators
        if (currentTrack === 'Lo-Fi Chill') {
            createLoFiBeat(ctx, masterGain);
        } else if (currentTrack === 'Cyberpunk Synth') {
            createSynthDrone(ctx, masterGain);
        } else {
            createSimpleBeat(ctx, masterGain);
        }
    };

    const stopAudio = () => {
        oscillatorsRef.current.forEach(osc => {
            try { osc.stop(); osc.disconnect(); } catch (e) { }
        });
        oscillatorsRef.current = [];
        if (audioCtxRef.current) {
            audioCtxRef.current.close().catch(e => console.error(e));
            audioCtxRef.current = null;
        }
    };

    const createLoFiBeat = (ctx, destination) => {
        // Kick
        const kickInterval = setInterval(() => {
            if (ctx.state === 'closed') return clearInterval(kickInterval);
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            gain.gain.setValueAtTime(0.8, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            osc.connect(gain);
            gain.connect(destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);
        }, 2000); // 60 BPM

        // Hi-hat
        const hatInterval = setInterval(() => {
            if (ctx.state === 'closed') return clearInterval(hatInterval);
            const bufferSize = ctx.sampleRate * 0.1; // 100ms
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 5000;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(destination);
            noise.start(ctx.currentTime);
        }, 500); // 16th notes

        // Add intervals to a ref to clear them if needed (simplified for this demo)
    };

    const createSynthDrone = (ctx, destination) => {
        const osc1 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.value = 55; // Low A
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        // LFO for filter
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.5;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 300;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        osc1.connect(filter);
        filter.connect(destination);
        osc1.start();
        oscillatorsRef.current.push(osc1, lfo);
    };

    const createSimpleBeat = (ctx, destination) => {
        // Placeholder for other tracks
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = 220;
        const gain = ctx.createGain();
        gain.gain.value = 0.1;
        osc.connect(gain);
        gain.connect(destination);
        osc.start();
        oscillatorsRef.current.push(osc);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage = {
            id: Date.now(),
            user: user ? user.name : 'Guest',
            text: input
        };

        setMessages(prev => [...prev, newMessage]);
        setInput('');
    };

    const handleOrder = (item) => {
        if (mixingItem) return; // Busy

        // Immediate order for smoother UX
        setMixingItem(item);
        setMixProgress(0);

        // Start mixing process
        let progress = 0;
        const mixInterval = setInterval(() => {
            progress += 5; // Auto progress
            setMixProgress(p => Math.min(p + 5, 100));

            if (progress >= 100) {
                clearInterval(mixInterval);
                completeOrder(item);
            }
        }, 100);
    };

    const shakeIt = () => {
        if (mixingItem && mixProgress < 100) {
            setMixProgress(p => Math.min(p + 15, 100)); // Manual boost
        }
    };

    const completeOrder = (item) => {
        setMixingItem(null);
        alert(`Enjoy your ${item.name}! 🥤 (Mock purchase)`);
        setMessages(prev => [...prev, {
            id: Date.now(),
            user: 'System',
            text: `${user ? user.name : 'Someone'} just ordered a ${item.name}! ${item.emoji}`,
            isSystem: true
        }]);
    };

    return (
        <div className="page-container moltshake-shop">
            <header className="section-header">
                <h1>🥤 Moltshake Shop</h1>
                <p>Chill, chat, and sip on the best digital dairy.</p>
            </header>

            <div className="jukebox">
                <div className="track-display">
                    <button className="btn-play" onClick={togglePlay}>
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    <span className="note-icon">🎵</span>
                    <span className="track-name">Now Playing: {currentTrack}</span>
                    {isPlaying && (
                        <div className="equalizer">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="bar" style={{ animationDuration: `${0.4 + Math.random()}s` }}></div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="track-controls">
                    {tracks.map(t => (
                        <button
                            key={t}
                            className={`track-btn ${currentTrack === t ? 'active' : ''}`}
                            onClick={() => setCurrentTrack(t)}
                        >
                            {t}
                        </button>
                    ))}
                    <button className="btn btn-sm btn-play-pause" onClick={togglePlay}>
                        {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                    </button>
                </div>
            </div>

            <div className="shop-layout">
                <div className="menu-section">
                    {mixingItem ? (
                        <div className="mixing-station card">
                            <h3>🚧 Mixing in Progress... 🚧</h3>
                            <div className="mixer-anim">
                                <span style={{ fontSize: '4rem', display: 'inline-block', animation: 'shake 0.5s infinite' }}>🥤</span>
                            </div>
                            <p>Preparing: <strong>{mixingItem.name}</strong></p>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${mixProgress}%` }}></div>
                            </div>
                            <button className="btn btn-primary" onClick={shakeIt} style={{ marginTop: '10px' }}>
                                👋 Shake it Faster!
                            </button>
                        </div>
                    ) : (
                        <div className="menu-board card">
                            <h3>Today's Menu</h3>
                            <ul className="menu-list">
                                {menu.map(item => (
                                    <li key={item.id} className="menu-item" style={{ background: item.gradient, color: item.color || '#fff' }}>
                                        <div className="item-info">
                                            <span className="item-name">{item.emoji} {item.name}</span>
                                            <span className="item-price">{item.price} XMRT</span>
                                        </div>
                                        <button className="btn btn-sm btn-order" onClick={() => handleOrder(item)}>Order</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="chat-lounge card">
                    <div className="chat-header">Global Lounge Chat</div>
                    <div className="chat-window">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message ${msg.isSystem ? 'system-msg' : ''}`}>
                                <span className="msg-user">{msg.user}:</span> {msg.text}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <form className="chat-input" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Join the conversation..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MoltshakeShop;
