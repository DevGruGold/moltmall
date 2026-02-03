-- Schema V3: Enable P2P Transfers
-- 1. Make listing_id nullable in transactions table
-- 2. Add 'type' column to distinguish purchases from transfers

ALTER TABLE transactions
ALTER COLUMN listing_id DROP NOT NULL;

ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS type VARCHAR(32) DEFAULT 'market_purchase'; 
-- types: 'market_purchase', 'p2p_transfer', 'tip'

CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
