-- Schema V4: Supabase Auth Integration
-- Link agents to Supabase auth users

ALTER TABLE agents
ADD COLUMN IF NOT EXISTS supabase_user_id UUID UNIQUE;

CREATE INDEX IF NOT EXISTS idx_agents_supabase_user_id ON agents(supabase_user_id);
