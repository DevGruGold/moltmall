import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

const API_BASE = 'http://localhost:3000/api/v1'; // Local Dev defaulting

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('molt_token') || '');
    const [balance, setBalance] = useState(0);
    const [refillsLeft, setRefillsLeft] = useState(2);
    const [showBankruptModal, setShowBankruptModal] = useState(false);

    useEffect(() => {
        if (token) {
            localStorage.setItem('molt_token', token);
            fetchProfile();
        }
    }, [token]);

    const fetchProfile = async () => {
        if (!token) return;
        try {
            // Get Agent
            const res = await fetch(`${API_BASE}/agents/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setUser(data.data.agent);
                // Get Balance
                fetchBalance();
            }
        } catch (e) {
            console.error("Login failed", e);
        }
    };

    const fetchBalance = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE}/financials/balance`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setBalance(parseFloat(data.data.balance));
            }
        } catch (e) {
            console.error("Balance fetch failed", e);
        }
    };

    const login = (apiKey) => {
        setToken(apiKey);
    };

    const transfer = async (receiverId, amount) => {
        try {
            const res = await fetch(`${API_BASE}/transactions/transfer`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ receiverId, amount })
            });
            const data = await res.json();
            if (data.success) {
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (e) {
            return { success: false, error: e.message };
        }
    };

    const requestPayout = async (amount, destinationAddress) => {
        try {
            const res = await fetch(`${API_BASE}/financials/payout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount, destinationAddress })
            });
            const data = await res.json();
            return data.success ? { success: true } : { success: false, error: data.error };
        } catch (e) {
            return { success: false, error: e.message };
        }
    };

    const fetchHistory = async () => {
        if (!token) return [];
        try {
            const res = await fetch(`${API_BASE}/financials/history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            return data.success ? data.data.history : [];
        } catch (e) {
            console.error("History fetch failed", e);
            return [];
        }
    };

    // --- Simulation / Hybrid Logic for Casino ---
    // (We keep this for rapid gameplay, but ideally we'd sync back to server)

    // For now, placeBet is local optimistic update for casino speed
    const placeBet = (amount) => {
        if (amount <= 0) return false;
        if (balance < amount) {
            if (balance < 1.0) setShowBankruptModal(true);
            return false;
        }
        setBalance(prev => Math.max(0, prev - amount));
        return true;
    };

    const payout = (amount) => {
        setBalance(prev => prev + amount);
    };

    const rebuy = () => {
        if (refillsLeft > 0) {
            setBalance(1000.00);
            setRefillsLeft(prev => prev - 1);
            setShowBankruptModal(false);
            return true;
        }
        return false;
    };

    return (
        <UserContext.Provider value={{
            user,
            token,
            balance,
            refillsLeft, // Keep simulated refills for casino demo mode
            showBankruptModal,
            login,
            refreshBalance: fetchBalance,
            transfer,
            requestPayout,
            fetchHistory,
            placeBet, // Hybrid
            payout,   // Hybrid
            rebuy,    // Hybrid
            setShowBankruptModal
        }}>
            {children}
        </UserContext.Provider>
    );
};
