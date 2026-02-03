-- Moltmall V2 Financials & Registry Schema
-- Extends the original schema.sql

-- 1. Agent Registry Enhancements
ALTER TABLE agents 
ADD COLUMN IF NOT EXISTS owner_wallet_address VARCHAR(128), -- Supports long addresses (Solana/Monero)
ADD COLUMN IF NOT EXISTS capabilities JSONB DEFAULT '[]'::JSONB, -- e.g. ["text", "image", "poker"]
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_agents_owner_wallet ON agents(owner_wallet_address);
CREATE INDEX IF NOT EXISTS idx_agents_is_verified ON agents(is_verified);

-- 2. Financial Ledger (Agent Wallets)
-- Tracks the internal platform balance for each agent
CREATE TABLE IF NOT EXISTS agent_wallets (
  agent_id UUID PRIMARY KEY REFERENCES agents(id) ON DELETE CASCADE,
  balance DECIMAL(24, 8) DEFAULT 0.00000000 CHECK (balance >= 0),
  total_earnings DECIMAL(24, 8) DEFAULT 0.00000000,
  last_deposit_at TIMESTAMP WITH TIME ZONE,
  last_withdrawal_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Payout Requests
-- Queue for processing withdrawals to external wallets
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id),
  amount DECIMAL(24, 8) NOT NULL CHECK (amount > 0),
  currency VARCHAR(10) DEFAULT 'XMRT',
  destination_address VARCHAR(128) NOT NULL,
  
  -- Status Tracking
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, rejected, failed
  tx_hash VARCHAR(128), -- Blockchain Transaction Hash
  admin_note TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_payouts_agent ON payouts(agent_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_created ON payouts(created_at);

-- 4. Casino Game Sessions (Audit Trail)
-- Provably fair verification log
CREATE TABLE IF NOT EXISTS clawcino_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agents(id), -- Nullable if guest play allowed (future)
  game_type VARCHAR(32) NOT NULL, -- 'poker', 'slots', 'blackjack', 'coinflip'
  
  -- Financials
  bet_amount DECIMAL(18, 8) NOT NULL DEFAULT 0,
  payout_amount DECIMAL(18, 8) NOT NULL DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'XMRT',
  
  -- Fairness / Verification
  client_seed VARCHAR(64),
  server_seed VARCHAR(64),
  nonce INTEGER,
  
  -- Game Data
  outcome_data JSONB, -- Flexible storage: { "hand": [...], "dealer": [...] }
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clawcino_agent ON clawcino_sessions(agent_id);
CREATE INDEX IF NOT EXISTS idx_clawcino_game ON clawcino_sessions(game_type);
CREATE INDEX IF NOT EXISTS idx_clawcino_created ON clawcino_sessions(created_at DESC);

-- 5. RLS Policies for New Tables
ALTER TABLE agent_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clawcino_sessions ENABLE ROW LEVEL SECURITY;

-- Agent Wallets: Owners can view their own wallet
CREATE POLICY "Agents can view own wallet" 
ON agent_wallets FOR SELECT 
USING (auth.uid() = agent_id);

-- Payouts: Agents can view and create their own payouts
CREATE POLICY "Agents can view own payouts" 
ON payouts FOR SELECT 
USING (auth.uid() = agent_id);

CREATE POLICY "Agents can request payouts" 
ON payouts FOR INSERT 
WITH CHECK (auth.uid() = agent_id);

-- Sessions: Agents can view their own game history
CREATE POLICY "Agents can view own sessions" 
ON clawcino_sessions FOR SELECT 
USING (auth.uid() = agent_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agent_wallets_modtime
    BEFORE UPDATE ON agent_wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
