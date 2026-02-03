import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const UserContext = createContext();

// Use relative path for proxy
const API_BASE = '/api/v1';

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [localToken, setLocalToken] = useState(null); // Backwards compatibility for demo
    const [balance, setBalance] = useState(0);
    const [refillsLeft, setRefillsLeft] = useState(2);
    const [showBankruptModal, setShowBankruptModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize Session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchProfile(session.access_token);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchProfile(session.access_token);
            } else if (!localToken) {
                // Only clear user if no local token (demo mode) exists
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [localToken]);

    const fetchProfile = async (token) => {
        if (!token) return;
        try {
            // New Auth Sync route
            const res = await fetch(`${API_BASE}/auth/sync`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                if (data.data.status === 'authenticated') {
                    setUser(data.data.agent);
                    fetchBalance(token);
                } else if (data.data.status === 'profile_required') {
                    // Handle new user case - for now we treat as partial login
                    console.log("Profile required for", data.data.user.email);
                }
            }
        } catch (e) {
            console.error("Login sync failed", e);
        }
    };

    const fetchBalance = async (tokenArg) => {
        const t = tokenArg || session?.access_token;
        if (!t) return;
        try {
            const res = await fetch(`${API_BASE}/financials/balance`, {
                headers: { 'Authorization': `Bearer ${t}` }
            });
            const data = await res.json();
            if (data.success) {
                setBalance(parseFloat(data.data.balance));
            }
        } catch (e) {
            console.error("Balance fetch failed", e);
        }
    };

    const loginWithProvider = async (provider) => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) console.error("Auth error", error);
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    };

    // Legacy manual login (Restored for Demo Mode)
    const login = (name, apiKey) => {
        // In demo mode, we just set the user locally to simulate access
        setUser({
            name: name,
            display_name: name,
            is_demo: true
        });
        setLocalToken(apiKey || 'demo_token');
        setBalance(1000); // Demo starting balance
    };

    const transfer = async (receiverId, amount) => {
        if (!session && !localToken) return { success: false, error: "Not logged in" };
        if (localToken) return { success: true }; // Mock success for demo

        try {
            const res = await fetch(`${API_BASE}/transactions/transfer`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ receiverId, amount })
            });
            const data = await res.json();
            return data.success ? { success: true } : { success: false, error: data.error };
        } catch (e) {
            return { success: false, error: e.message };
        }
    };

    const requestPayout = async (amount, destinationAddress) => {
        if (!session && !localToken) return { success: false, error: "Not logged in" };
        if (localToken) return { success: true }; // Mock

        try {
            const res = await fetch(`${API_BASE}/financials/payout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
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
        if (!session && !localToken) return [];
        if (localToken) return []; // Empty history for demo

        try {
            const res = await fetch(`${API_BASE}/financials/history`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            const data = await res.json();
            return data.success ? data.data.history : [];
        } catch (e) {
            return [];
        }
    };

    // Hybrid Casino Logic
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
            session,
            token: session?.access_token || localToken,
            balance,
            refillsLeft,
            showBankruptModal,
            loginWithProvider, // New
            logout,            // New
            login,             // Deprecated
            refreshBalance: () => fetchBalance(),
            transfer,
            requestPayout,
            fetchHistory,
            placeBet,
            payout,
            rebuy,
            setShowBankruptModal,
            loading
        }}>
            {children}
        </UserContext.Provider>
    );
};
