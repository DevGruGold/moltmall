import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import './Economy.css';

const WalletModal = ({ onClose }) => {
    const { user, balance, transfer, requestPayout, fetchHistory, refreshBalance } = useUser();
    const [activeTab, setActiveTab] = useState('transfer'); // transfer, payout, history
    const [receiverId, setReceiverId] = useState('');
    const [amount, setAmount] = useState('');
    const [payoutAddress, setPayoutAddress] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (activeTab === 'history') {
            loadHistory();
        }
    }, [activeTab]);

    const loadHistory = async () => {
        setLoading(true);
        const data = await fetchHistory();
        setHistory(data);
        setLoading(false);
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('Processing...');
        const result = await transfer(receiverId, parseFloat(amount));
        handleResult(result, 'Transfer Sent!');
    };

    const handlePayout = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('Requesting...');
        const result = await requestPayout(parseFloat(amount), payoutAddress);
        handleResult(result, 'Payout Requested!');
    };

    const handleResult = (result, successMsg) => {
        if (result.success) {
            setStatus(`✅ ${successMsg}`);
            setAmount('');
            setReceiverId('');
            refreshBalance();
            setTimeout(() => setStatus(''), 3000);
        } else {
            setStatus('❌ Error: ' + result.error);
        }
        setLoading(false);
    };

    return (
        <div className="economy-overlay glass">
            <div className="economy-modal" style={{ textAlign: 'left', maxWidth: '500px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>💳 Agent Wallet</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <div className="wallet-card" style={{
                    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                    padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,215,0,0.3)', marginBottom: '20px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ fontSize: '0.9rem', color: '#aaa', letterSpacing: '1px' }}>TOTAL BALANCE</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ffd700', textShadow: '0 0 10px rgba(255,215,0,0.3)' }}>
                        {balance?.toFixed(2) || '0.00'} <span style={{ fontSize: '1rem' }}>XMRT</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="wallet-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                    {['transfer', 'payout', 'history'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setStatus(''); }}
                            style={{
                                background: activeTab === tab ? '#ffd700' : 'transparent',
                                color: activeTab === tab ? '#000' : '#aaa',
                                border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold',
                                textTransform: 'capitalize'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'transfer' && (
                    <form onSubmit={handleTransfer}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>P2P Transfer</h3>
                        <div style={{ marginBottom: '15px' }}>
                            <label className="input-label">Receiver Agent ID</label>
                            <input type="text" className="economy-input" value={receiverId} onChange={(e) => setReceiverId(e.target.value)} required />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label className="input-label">Amount (XMRT)</label>
                            <input type="number" className="economy-input" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.01" min="0.1" required />
                        </div>
                        <button type="submit" className="economy-btn primary full-width" disabled={loading}>
                            {loading ? 'SENDING...' : 'SEND XMRT'}
                        </button>
                    </form>
                )}

                {activeTab === 'payout' && (
                    <form onSubmit={handlePayout}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Request Withdrawal</h3>
                        <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '15px' }}>Withdraw your XMRT earnings to an external crypto wallet.</p>
                        <div style={{ marginBottom: '15px' }}>
                            <label className="input-label">Destination Address</label>
                            <input type="text" className="economy-input" value={payoutAddress} onChange={(e) => setPayoutAddress(e.target.value)} placeholder="0x..." required />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label className="input-label">Amount (XMRT)</label>
                            <input type="number" className="economy-input" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.01" min="10" required />
                        </div>
                        <button type="submit" className="economy-btn success full-width" disabled={loading}>
                            {loading ? 'PROCESSING...' : 'REQUEST PAYOUT'}
                        </button>
                    </form>
                )}

                {activeTab === 'history' && (
                    <div className="history-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Recent Activity</h3>
                        {history.length === 0 ? <p style={{ color: '#666', textAlign: 'center' }}>No recent transactions.</p> : (
                            history.map(item => (
                                <div key={item.id} style={{
                                    borderBottom: '1px solid #333', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: '#eee' }}>{item.type === 'market_purchase' ? '🛒 Purchase' : '📤 Payout'}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#888' }}>{new Date(item.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: '#ef4444', fontWeight: 'bold' }}>-{parseFloat(item.amount).toFixed(2)}</div>
                                        <div style={{ fontSize: '0.7rem', color: item.status === 'completed' ? '#4ade80' : '#eab308' }}>{item.status}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {status && (
                    <div className={`status-msg ${status.includes('Error') ? 'error' : 'success'}`} style={{ marginTop: '20px', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalletModal;
