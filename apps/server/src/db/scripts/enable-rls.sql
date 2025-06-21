-- Enable Row Level Security on ALL tables
-- This MUST be run immediately to secure your database

-- Enable RLS on all tables
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first to make this script idempotent
DROP POLICY IF EXISTS "Service role bypass" ON "user";
DROP POLICY IF EXISTS "Service role bypass" ON portfolios;
DROP POLICY IF EXISTS "Service role bypass" ON portfolio_assets;
DROP POLICY IF EXISTS "Service role bypass" ON transactions;
DROP POLICY IF EXISTS "Service role bypass" ON vault_operations;
DROP POLICY IF EXISTS "Service role bypass" ON vault_strategies;
DROP POLICY IF EXISTS "Service role bypass" ON ai_recommendations;
DROP POLICY IF EXISTS "Service role bypass" ON market_data;

DROP POLICY IF EXISTS "Users can view own profile" ON "user";
DROP POLICY IF EXISTS "Users can update own profile" ON "user";
DROP POLICY IF EXISTS "Users can view own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Users can create own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Users can update own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Users can delete own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Users can view own portfolio assets" ON portfolio_assets;
DROP POLICY IF EXISTS "Users can manage own portfolio assets" ON portfolio_assets;
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can create own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can view own vault operations" ON vault_operations;
DROP POLICY IF EXISTS "Users can create own vault operations" ON vault_operations;
DROP POLICY IF EXISTS "Users can view own AI recommendations" ON ai_recommendations;
DROP POLICY IF EXISTS "Public read vault strategies" ON vault_strategies;
DROP POLICY IF EXISTS "Public read market data" ON market_data;

-- Temporary admin bypass policy (FOR TESTING ONLY - REMOVE IN PRODUCTION)
-- This allows the service role to bypass RLS during development
CREATE POLICY "Service role bypass" ON "user" TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON portfolios TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON portfolio_assets TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON transactions TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON vault_operations TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON vault_strategies TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON ai_recommendations TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON market_data TO service_role USING (true) WITH CHECK (true);

-- Basic user policies (users can only see their own data)
CREATE POLICY "Users can view own profile" ON "user"
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON "user"
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view own portfolios" ON portfolios
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own portfolios" ON portfolios
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own portfolios" ON portfolios
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own portfolios" ON portfolios
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Portfolio assets (must own the portfolio)
CREATE POLICY "Users can view own portfolio assets" ON portfolio_assets
  FOR SELECT TO authenticated
  USING (
    portfolio_id IN (
      SELECT id FROM portfolios WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own portfolio assets" ON portfolio_assets
  FOR ALL TO authenticated
  USING (
    portfolio_id IN (
      SELECT id FROM portfolios WHERE user_id = auth.uid()
    )
  );

-- Transactions (users can only see their own)
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own transactions" ON transactions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Vault operations (users can only see their own)
CREATE POLICY "Users can view own vault operations" ON vault_operations
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own vault operations" ON vault_operations
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- AI recommendations (users can only see their own, null user_id = public)
CREATE POLICY "Users can view own AI recommendations" ON ai_recommendations
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Vault strategies (public read for all authenticated users)
CREATE POLICY "Public read vault strategies" ON vault_strategies
  FOR SELECT TO authenticated
  USING (true);

-- Market data (public read for all authenticated users)
CREATE POLICY "Public read market data" ON market_data
  FOR SELECT TO authenticated
  USING (true);

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
