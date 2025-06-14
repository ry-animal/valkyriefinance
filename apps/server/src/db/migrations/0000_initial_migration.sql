CREATE TYPE "public"."transaction_status" AS ENUM('pending', 'confirmed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('swap', 'deposit', 'withdrawal', 'bridge', 'approve', 'liquidity_add', 'liquidity_remove');--> statement-breakpoint
CREATE TYPE "public"."vault_operation_type" AS ENUM('deposit', 'withdrawal', 'rebalance', 'harvest', 'emergency_exit');--> statement-breakpoint
CREATE TABLE "ai_recommendations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"confidence" numeric(3, 2),
	"expected_return" numeric(5, 4),
	"risk_level" integer,
	"recommendation" jsonb NOT NULL,
	"is_executed" boolean DEFAULT false,
	"executed_at" timestamp,
	"execution_result" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "market_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_address" text NOT NULL,
	"chain_id" integer NOT NULL,
	"symbol" text NOT NULL,
	"price_usd" numeric(18, 8) NOT NULL,
	"market_cap" numeric(20, 2),
	"volume_24h" numeric(20, 2),
	"price_change_24h" numeric(5, 4),
	"liquidity_usd" numeric(20, 2),
	"source" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "portfolio_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_id" uuid NOT NULL,
	"token_address" text NOT NULL,
	"token_symbol" text NOT NULL,
	"token_decimals" integer NOT NULL,
	"chain_id" integer NOT NULL,
	"balance" numeric(36, 18) NOT NULL,
	"value_usd" numeric(18, 2),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"total_value" numeric(36, 18) DEFAULT '0',
	"currency" text DEFAULT 'USD' NOT NULL,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "todo" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"hash" text NOT NULL,
	"type" "transaction_type" NOT NULL,
	"status" "transaction_status" DEFAULT 'pending' NOT NULL,
	"chain_id" integer NOT NULL,
	"block_number" integer,
	"gas_used" numeric(20, 0),
	"gas_price" numeric(20, 0),
	"value" numeric(36, 18),
	"from_address" text NOT NULL,
	"to_address" text,
	"token_address" text,
	"token_amount" numeric(36, 18),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
CREATE TABLE "vault_operations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"vault_address" text NOT NULL,
	"operation_type" "vault_operation_type" NOT NULL,
	"asset_amount" numeric(36, 18) NOT NULL,
	"share_amount" numeric(36, 18) NOT NULL,
	"transaction_hash" text NOT NULL,
	"block_number" integer NOT NULL,
	"share_price" numeric(36, 18),
	"gas_used" numeric(20, 0),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vault_strategies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vault_address" text NOT NULL,
	"strategy_address" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"allocation" numeric(5, 4) NOT NULL,
	"expected_apy" numeric(5, 4),
	"actual_apy" numeric(5, 4),
	"total_assets" numeric(36, 18) DEFAULT '0',
	"is_active" boolean DEFAULT true,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_recommendations" ADD CONSTRAINT "ai_recommendations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_assets" ADD CONSTRAINT "portfolio_assets_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vault_operations" ADD CONSTRAINT "vault_operations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_recommendations_user_type_idx" ON "ai_recommendations" USING btree ("user_id","type");--> statement-breakpoint
CREATE INDEX "ai_recommendations_confidence_idx" ON "ai_recommendations" USING btree ("confidence");--> statement-breakpoint
CREATE INDEX "ai_recommendations_execution_idx" ON "ai_recommendations" USING btree ("is_executed");--> statement-breakpoint
CREATE INDEX "market_data_token_chain_idx" ON "market_data" USING btree ("token_address","chain_id");--> statement-breakpoint
CREATE INDEX "market_data_price_idx" ON "market_data" USING btree ("price_usd");--> statement-breakpoint
CREATE INDEX "market_data_timestamp_idx" ON "market_data" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "portfolio_assets_portfolio_token_idx" ON "portfolio_assets" USING btree ("portfolio_id","token_address","chain_id");--> statement-breakpoint
CREATE INDEX "portfolios_user_id_idx" ON "portfolios" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "portfolios_default_idx" ON "portfolios" USING btree ("user_id","is_default");--> statement-breakpoint
CREATE INDEX "transactions_user_hash_idx" ON "transactions" USING btree ("user_id","hash");--> statement-breakpoint
CREATE INDEX "transactions_status_idx" ON "transactions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "transactions_type_idx" ON "transactions" USING btree ("type");--> statement-breakpoint
CREATE INDEX "transactions_chain_idx" ON "transactions" USING btree ("chain_id");--> statement-breakpoint
CREATE INDEX "vault_operations_user_vault_idx" ON "vault_operations" USING btree ("user_id","vault_address");--> statement-breakpoint
CREATE INDEX "vault_operations_type_idx" ON "vault_operations" USING btree ("operation_type");--> statement-breakpoint
CREATE INDEX "vault_operations_block_idx" ON "vault_operations" USING btree ("block_number");--> statement-breakpoint
CREATE INDEX "vault_strategies_vault_idx" ON "vault_strategies" USING btree ("vault_address");--> statement-breakpoint
CREATE INDEX "vault_strategies_active_idx" ON "vault_strategies" USING btree ("vault_address","is_active");