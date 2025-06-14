-- Drop all better-auth related tables
DROP TABLE IF EXISTS "account" CASCADE;
DROP TABLE IF EXISTS "session" CASCADE;
DROP TABLE IF EXISTS "verification" CASCADE;
DROP TABLE IF EXISTS "todo" CASCADE;

-- Drop the old user table completely
DROP TABLE IF EXISTS "user" CASCADE;

-- Create new wallet-based user table
CREATE TABLE "user" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "wallet_address" text NOT NULL UNIQUE,
  "ens_name" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create other tables that depend on user
CREATE TABLE "portfolios" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "description" text,
  "total_value" numeric(36,18) DEFAULT '0',
  "currency" text DEFAULT 'USD' NOT NULL,
  "is_default" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX "portfolios_user_id_idx" ON "portfolios" ("user_id");
CREATE INDEX "portfolios_default_idx" ON "portfolios" ("user_id", "is_default");

CREATE TABLE "portfolio_assets" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "portfolio_id" uuid NOT NULL REFERENCES "portfolios"("id") ON DELETE CASCADE,
  "token_address" text NOT NULL,
  "token_symbol" text NOT NULL,
  "token_decimals" integer NOT NULL,
  "chain_id" integer NOT NULL,
  "balance" numeric(36,18) NOT NULL,
  "value_usd" numeric(18,2),
  "last_updated" timestamp DEFAULT now() NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX "portfolio_assets_portfolio_token_idx" ON "portfolio_assets" ("portfolio_id", "token_address", "chain_id");

CREATE TYPE "transaction_type" AS ENUM('swap', 'deposit', 'withdrawal', 'bridge', 'approve', 'liquidity_add', 'liquidity_remove');
CREATE TYPE "transaction_status" AS ENUM('pending', 'confirmed', 'failed', 'cancelled');

CREATE TABLE "transactions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "hash" text NOT NULL UNIQUE,
  "type" "transaction_type" NOT NULL,
  "status" "transaction_status" DEFAULT 'pending' NOT NULL,
  "chain_id" integer NOT NULL,
  "block_number" integer,
  "gas_used" numeric(20,0),
  "gas_price" numeric(20,0),
  "value" numeric(36,18),
  "from_address" text NOT NULL,
  "to_address" text,
  "token_address" text,
  "token_amount" numeric(36,18),
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX "transactions_user_hash_idx" ON "transactions" ("user_id", "hash");
CREATE INDEX "transactions_status_idx" ON "transactions" ("status");
CREATE INDEX "transactions_type_idx" ON "transactions" ("type");
CREATE INDEX "transactions_chain_idx" ON "transactions" ("chain_id");

CREATE TYPE "vault_operation_type" AS ENUM('deposit', 'withdrawal', 'rebalance', 'harvest', 'emergency_exit');

CREATE TABLE "vault_operations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "vault_address" text NOT NULL,
  "operation_type" "vault_operation_type" NOT NULL,
  "asset_amount" numeric(36,18) NOT NULL,
  "share_amount" numeric(36,18) NOT NULL,
  "transaction_hash" text NOT NULL,
  "block_number" integer NOT NULL,
  "share_price" numeric(36,18),
  "gas_used" numeric(20,0),
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX "vault_operations_user_vault_idx" ON "vault_operations" ("user_id", "vault_address");
CREATE INDEX "vault_operations_type_idx" ON "vault_operations" ("operation_type");
CREATE INDEX "vault_operations_block_idx" ON "vault_operations" ("block_number");

CREATE TABLE "vault_strategies" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "vault_address" text NOT NULL,
  "strategy_address" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "allocation" numeric(5,4) NOT NULL,
  "expected_apy" numeric(5,4),
  "actual_apy" numeric(5,4),
  "total_assets" numeric(36,18) DEFAULT '0',
  "is_active" boolean DEFAULT true,
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX "vault_strategies_vault_idx" ON "vault_strategies" ("vault_address");
CREATE INDEX "vault_strategies_active_idx" ON "vault_strategies" ("vault_address", "is_active");

CREATE TABLE "ai_recommendations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid REFERENCES "user"("id"),
  "type" text NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "confidence" numeric(3,2),
  "expected_return" numeric(5,4),
  "risk_level" integer,
  "recommendation" jsonb NOT NULL,
  "is_executed" boolean DEFAULT false,
  "executed_at" timestamp,
  "execution_result" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX "ai_recommendations_user_type_idx" ON "ai_recommendations" ("user_id", "type");
CREATE INDEX "ai_recommendations_confidence_idx" ON "ai_recommendations" ("confidence");
CREATE INDEX "ai_recommendations_execution_idx" ON "ai_recommendations" ("is_executed");

CREATE TABLE "market_data" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "token_address" text NOT NULL,
  "chain_id" integer NOT NULL,
  "symbol" text NOT NULL,
  "price_usd" numeric(18,8) NOT NULL,
  "market_cap" numeric(20,2),
  "volume_24h" numeric(20,2),
  "price_change_24h" numeric(5,4),
  "liquidity_usd" numeric(20,2),
  "source" text NOT NULL,
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX "market_data_token_chain_idx" ON "market_data" ("token_address", "chain_id");
CREATE INDEX "market_data_price_idx" ON "market_data" ("price_usd");
CREATE INDEX "market_data_timestamp_idx" ON "market_data" ("created_at"); 