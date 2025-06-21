# Database Security & Performance Next Steps

## 🚨 Critical Security Issues - MUST FIX BEFORE PRODUCTION

### 1. Enable Row-Level Security (RLS) on ALL Tables

**Current Status**: ❌ No tables have RLS enabled
**Risk Level**: CRITICAL - Data is completely exposed to anyone with the public anon key
**Time Required**: 30 minutes

```sql
-- Run this immediately in Supabase SQL Editor
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
```

### 2. Create RLS Policies for User Data Protection

**Current Status**: ❌ No RLS policies exist
**Risk Level**: CRITICAL - Tables are inaccessible after enabling RLS without policies
**Time Required**: 2 hours

Create a migration file: `apps/server/src/db/migrations/0002_add_rls_policies.sql`

```sql
-- User policies (wallet-based auth)
CREATE POLICY "Users can view own profile"
  ON "user" FOR SELECT
  USING (wallet_address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "Users can update own profile"
  ON "user" FOR UPDATE
  USING (wallet_address = auth.jwt() ->> 'wallet_address')
  WITH CHECK (wallet_address = auth.jwt() ->> 'wallet_address');

-- Portfolio policies
CREATE POLICY "Users can view own portfolios"
  ON portfolios FOR SELECT
  USING (user_id = (
    SELECT id FROM "user"
    WHERE wallet_address = auth.jwt() ->> 'wallet_address'
  ));

CREATE POLICY "Users can create portfolios"
  ON portfolios FOR INSERT
  WITH CHECK (user_id = (
    SELECT id FROM "user"
    WHERE wallet_address = auth.jwt() ->> 'wallet_address'
  ));

CREATE POLICY "Users can update own portfolios"
  ON portfolios FOR UPDATE
  USING (user_id = (
    SELECT id FROM "user"
    WHERE wallet_address = auth.jwt() ->> 'wallet_address'
  ));

CREATE POLICY "Users can delete own portfolios"
  ON portfolios FOR DELETE
  USING (user_id = (
    SELECT id FROM "user"
    WHERE wallet_address = auth.jwt() ->> 'wallet_address'
  ));

-- Portfolio assets policies (inherit from portfolio ownership)
CREATE POLICY "Users can view portfolio assets"
  ON portfolio_assets FOR SELECT
  USING (portfolio_id IN (
    SELECT id FROM portfolios
    WHERE user_id = (
      SELECT id FROM "user"
      WHERE wallet_address = auth.jwt() ->> 'wallet_address'
    )
  ));

CREATE POLICY "Users can manage portfolio assets"
  ON portfolio_assets FOR ALL
  USING (portfolio_id IN (
    SELECT id FROM portfolios
    WHERE user_id = (
      SELECT id FROM "user"
      WHERE wallet_address = auth.jwt() ->> 'wallet_address'
    )
  ));

-- Transaction policies
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (user_id = (
    SELECT id FROM "user"
    WHERE wallet_address = auth.jwt() ->> 'wallet_address'
  ));

CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  WITH CHECK (user_id = (
    SELECT id FROM "user"
    WHERE wallet_address = auth.jwt() ->> 'wallet_address'
  ));

-- Vault operations policies
CREATE POLICY "Users can view own vault operations"
  ON vault_operations FOR SELECT
  USING (user_id = (
    SELECT id FROM "user"
    WHERE wallet_address = auth.jwt() ->> 'wallet_address'
  ));

CREATE POLICY "Users can create vault operations"
  ON vault_operations FOR INSERT
  WITH CHECK (user_id = (
    SELECT id FROM "user"
    WHERE wallet_address = auth.jwt() ->> 'wallet_address'
  ));

-- Public data policies
CREATE POLICY "Market data is public read"
  ON market_data FOR SELECT
  USING (true);

CREATE POLICY "Vault strategies are public read"
  ON vault_strategies FOR SELECT
  USING (true);

-- AI recommendations policies
CREATE POLICY "Users can view own AI recommendations"
  ON ai_recommendations FOR SELECT
  USING (user_id = (
    SELECT id FROM "user"
    WHERE wallet_address = auth.jwt() ->> 'wallet_address'
  ));
```

## ⚡ Performance Optimizations - HIGH PRIORITY

### 3. Add Critical Indexes for RLS Performance

**Current Status**: ⚠️ Missing indexes that will cause severe performance issues
**Risk Level**: HIGH - Queries will be 100x slower without these
**Time Required**: 30 minutes

```sql
-- Critical for RLS performance
CREATE INDEX user_wallet_address_idx ON "user"(wallet_address);

-- Optimize user lookups in RLS policies
CREATE OR REPLACE FUNCTION auth.user_id()
RETURNS UUID AS $$
  SELECT id FROM "user"
  WHERE wallet_address = auth.jwt() ->> 'wallet_address'
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '';

-- Now update policies to use this function for better performance
-- Example: USING (user_id = auth.user_id())
```

### 4. Fix Timestamp Types

**Current Status**: ❌ Using timezone-unaware timestamps
**Risk Level**: MEDIUM - Will cause issues with global users
**Time Required**: 1 hour

Create migration: `apps/server/src/db/migrations/0003_fix_timestamps.sql`

```sql
-- Convert all timestamp columns to timestamptz
ALTER TABLE "user"
  ALTER COLUMN created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE timestamptz USING updated_at AT TIME ZONE 'UTC';

ALTER TABLE portfolios
  ALTER COLUMN created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE timestamptz USING updated_at AT TIME ZONE 'UTC';

-- Repeat for all tables...
```

## 🔧 Schema Improvements - MEDIUM PRIORITY

### 5. Add Update Triggers

**Current Status**: ❌ No automatic updated_at maintenance
**Risk Level**: LOW - But important for data integrity
**Time Required**: 30 minutes

```sql
-- Create a reusable function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_user_updated_at
  BEFORE UPDATE ON "user"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Repeat for all tables with updated_at...
```

### 6. Fix User Table ID Consistency

**Current Status**: ⚠️ Mismatch between schema (uuid) and migration (text)
**Risk Level**: MEDIUM - Will cause type errors
**Time Required**: 2 hours (requires data migration)

This is complex - needs careful migration. Consider for next major version.

## 📈 Advanced Optimizations - FUTURE

### 7. Optimize RLS with Security Definer Functions

For complex queries, create optimized functions:

```sql
CREATE OR REPLACE FUNCTION get_user_portfolio_value(p_user_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  total NUMERIC;
BEGIN
  SELECT COALESCE(SUM(pa.balance * md.price_usd), 0)
  INTO total
  FROM portfolio_assets pa
  JOIN portfolios p ON pa.portfolio_id = p.id
  LEFT JOIN LATERAL (
    SELECT price_usd
    FROM market_data
    WHERE token_address = pa.token_address
      AND chain_id = pa.chain_id
    ORDER BY created_at DESC
    LIMIT 1
  ) md ON true
  WHERE p.user_id = p_user_id;

  RETURN total;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '';

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION get_user_portfolio_value TO authenticated;
```

### 8. Consider BRIN Indexes for Time-Series Data

```sql
-- Much smaller index for append-only tables
CREATE INDEX market_data_created_at_brin
  ON market_data USING brin(created_at);

CREATE INDEX transactions_created_at_brin
  ON transactions USING brin(created_at);
```

## 🔧 Drizzle ORM Best Practices Audit

### Critical Issues Found

#### 9. Missing Drizzle Relations ❌
**Current Status**: Foreign keys defined but NO relations() helpers
**Risk Level**: HIGH - Cannot use convenient db.query API
**Time Required**: 1 hour

Add to each schema file:
```typescript
// In user.ts
export const userRelations = relations(user, ({ many }) => ({
  portfolios: many(portfolios),
  transactions: many(transactions),
  vaultOperations: many(vaultOperations),
  aiRecommendations: many(aiRecommendations),
}));

// In portfolio.ts
export const portfoliosRelations = relations(portfolios, ({ one, many }) => ({
  user: one(user, {
    fields: [portfolios.userId],
    references: [user.id],
  }),
  assets: many(portfolioAssets),
}));

export const portfolioAssetsRelations = relations(portfolioAssets, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [portfolioAssets.portfolioId],
    references: [portfolios.id],
  }),
}));
```

#### 10. SELECT * Anti-Pattern ❌
**Current Status**: Using `db.select().from()` which fetches ALL columns
**Risk Level**: MEDIUM - Performance degradation on wide tables
**Time Required**: 2 hours

Fix all occurrences:
```typescript
// BAD - Current code
db.select().from(portfolios).where(eq(portfolios.userId, input.userId));

// GOOD - Select only needed columns
db.select({
  id: portfolios.id,
  name: portfolios.name,
  totalValue: portfolios.totalValue,
  isDefault: portfolios.isDefault,
  createdAt: portfolios.createdAt,
}).from(portfolios).where(eq(portfolios.userId, input.userId));
```

#### 11. No Connection Pooling ❌
**Current Status**: Direct database URL usage without pooling
**Risk Level**: CRITICAL for production - Will exhaust connections
**Time Required**: 2 hours

Update `apps/server/src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@/lib/env';

// For serverless/edge: Use connection pooler URL from Supabase
const connectionString = env.DATABASE_URL; // Should be the pooler URL
const client = postgres(connectionString, {
  max: 10, // Maximum connections in pool
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, {
  schema: { ...allSchemas },
});
```

#### 12. Using push Command (Anti-Pattern) ❌
**Current Status**: `db:push` script in package.json
**Risk Level**: HIGH - No migration history for production
**Time Required**: 30 minutes

Update `package.json`:
```json
{
  "scripts": {
    // Remove this line:
    // "db:push": "drizzle-kit push",

    // Use proper migration workflow:
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push:local": "drizzle-kit push" // Only for local dev
  }
}
```

#### 13. No Prepared Statements ❌
**Current Status**: No prepared statements for frequent queries
**Risk Level**: MEDIUM - Missing performance optimization
**Time Required**: 1 hour

Add prepared statements for common queries:
```typescript
// In a new file: src/db/prepared.ts
import { db } from './index';
import { eq } from 'drizzle-orm';
import { portfolios, user } from './schema';

export const getUserById = db
  .select()
  .from(user)
  .where(eq(user.id, sql.placeholder('userId')))
  .prepare('getUserById');

export const getUserPortfolios = db
  .select()
  .from(portfolios)
  .where(eq(portfolios.userId, sql.placeholder('userId')))
  .prepare('getUserPortfolios');

// Usage:
const user = await getUserById.execute({ userId: '123' });
```

#### 14. No Transaction Usage ❌
**Current Status**: Multi-step operations not wrapped in transactions
**Risk Level**: HIGH - Data integrity issues possible
**Time Required**: 2 hours

Wrap related operations:
```typescript
// Example: Creating user with default portfolio
await db.transaction(async (tx) => {
  const [newUser] = await tx.insert(user).values({
    walletAddress: input.address,
    ensName: input.ensName,
  }).returning();

  await tx.insert(portfolios).values({
    userId: newUser.id,
    name: 'Default Portfolio',
    isDefault: true,
  });
});
```

#### 15. Missing Timestamp Helpers ❌
**Current Status**: Repeating timestamp definitions
**Risk Level**: LOW - Code duplication
**Time Required**: 30 minutes

Create shared helpers:
```typescript
// src/db/schema/_shared.ts
import { timestamp, uuid } from 'drizzle-orm/pg-core';

export const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
};

export const primaryKey = {
  id: uuid('id').primaryKey().defaultRandom(),
};

// Use in schemas:
export const users = pgTable('users', {
  ...primaryKey,
  walletAddress: text('wallet_address').notNull().unique(),
  ...timestamps,
});
```

## 🚀 Implementation Plan

### Week 1 (Critical Security)
- [ ] Day 1: Enable RLS on all tables
- [ ] Day 2-3: Implement and test RLS policies
- [ ] Day 4: Add performance indexes
- [ ] Day 5: Deploy to staging and test thoroughly

### Week 2 (Performance & Stability)
- [ ] Day 1-2: Fix timestamp types
- [ ] Day 3: Add update triggers
- [ ] Day 4-5: Performance testing and optimization

### Week 3 (Advanced Features)
- [ ] Implement security definer functions
- [ ] Add BRIN indexes
- [ ] Set up monitoring and alerts

### Week 4 (Drizzle ORM Improvements)
- [ ] Day 1: Add relations() helpers
- [ ] Day 2: Fix SELECT * anti-patterns
- [ ] Day 3: Implement connection pooling
- [ ] Day 4: Add prepared statements
- [ ] Day 5: Wrap multi-step operations in transactions

## 🧪 Testing Checklist

Before deploying each change:

1. **Test RLS policies locally**:
   ```sql
   -- In Supabase SQL Editor, use user impersonation
   -- Test as anonymous user
   SELECT * FROM portfolios; -- Should return nothing

   -- Test as authenticated user
   -- Should only see their own data
   ```

2. **Performance test critical queries**:
   ```sql
   EXPLAIN ANALYZE
   SELECT * FROM portfolios WHERE user_id = 'some-uuid';
   ```

3. **Verify no data leaks**:
   - Create two test users
   - Ensure User A cannot see User B's data
   - Test all CRUD operations

4. **Test Drizzle queries**:
   - Verify relations work with db.query API
   - Test prepared statement performance
   - Ensure transactions rollback on error

## 📊 Monitoring Post-Deployment

1. **Set up alerts for**:
   - Slow queries (>100ms)
   - Failed RLS policy checks
   - High database CPU/memory usage
   - Connection pool exhaustion

2. **Regular audits**:
   - Weekly: Review slow query logs
   - Monthly: Check for missing indexes
   - Quarterly: Full security audit

## 🔗 Resources

- [Supabase RLS Guide](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Drizzle Best Practices Guide](https://orm.drizzle.team/docs/best-practices)

## 💡 Pro Tips

1. **Always wrap auth functions in RLS**:
   ```sql
   -- Bad: Can be called for every row
   USING (auth.uid() = user_id)

   -- Good: Called once per query
   USING ((SELECT auth.uid()) = user_id)
   ```

2. **Test RLS policies with different scenarios**:
   - Anonymous users
   - Authenticated users
   - Users with different roles
   - Edge cases (null values, etc.)

3. **Monitor query performance**:
   - Use `pg_stat_statements` extension
   - Set up slow query logging
   - Regular EXPLAIN ANALYZE on critical paths

4. **Drizzle-specific tips**:
   - Always use both foreign keys AND relations()
   - Prefer db.query for nested reads
   - Use prepared statements for hot paths
   - Batch independent queries when possible

---

**Remember**: Security is not optional. Fix RLS issues before any other optimizations!

## 🔍 Monitoring & Maintenance

- Monitor RLS policy execution time using `pg_stat_statements`
- Set up alerts for:
  - Failed authentication attempts
  - High query latency (>100ms)
  - RLS policy violations
  - Unusual data access patterns

- Regular maintenance:
  - Weekly: Review slow query logs
  - Monthly: Update table statistics (`ANALYZE`)
  - Quarterly: Review and optimize RLS policies

## 📊 Drizzle ORM Best Practices Audit

### Critical Issues Found

#### 1. ❌ Using `drizzle-kit push` Instead of Migrations
**Location**: `package.json` scripts
**Risk**: HIGH - No version control for schema changes, risky for production
**Finding**: Scripts use `db:push` which directly modifies database without migration files
```json
// Current (BAD)
"db:push": "drizzle-kit push"

// Should be (GOOD)
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate"
```

#### 2. ❌ Missing Relations Definitions
**Location**: All schema files
**Risk**: MEDIUM - Cannot use Drizzle's relational query API effectively
**Finding**: No `relations()` defined despite clear foreign key relationships
```typescript
// Example: Missing in portfolio.ts
export const portfoliosRelations = relations(portfolios, ({ many, one }) => ({
  user: one(user, {
    fields: [portfolios.userId],
    references: [user.id],
  }),
  assets: many(portfolioAssets),
}));
```

#### 3. ⚠️ No Prepared Statements for High-Frequency Queries
**Location**: All routers
**Risk**: MEDIUM - Missing performance optimization
**Finding**: No use of `.prepare()` for frequently executed queries
```typescript
// Should prepare common queries like:
const getUserByIdStmt = db.select().from(user)
  .where(eq(user.id, placeholder('userId')))
  .prepare();
```

#### 4. ❌ No Transaction Usage for Multi-Step Operations
**Location**: `portfolio.ts`, `vault.ts` routers
**Risk**: HIGH - Data consistency issues
**Finding**: Multi-step operations not wrapped in transactions
```typescript
// Current: Separate operations (BAD)
await db.delete(portfolioAssets).where(...);
await db.insert(portfolioAssets).values(...);

// Should be: Transactional (GOOD)
await db.transaction(async (tx) => {
  await tx.delete(portfolioAssets).where(...);
  await tx.insert(portfolioAssets).values(...);
});
```

#### 5. ⚠️ Direct Full Table Selects
**Location**: Multiple routers
**Risk**: LOW-MEDIUM - Performance issue as data grows
**Finding**: Using `db.select()` without column selection
```typescript
// Current (fetches all columns)
db.select().from(portfolios)

// Better (fetch only needed columns)
db.select({
  id: portfolios.id,
  name: portfolios.name,
  totalValue: portfolios.totalValue
}).from(portfolios)
```

#### 6. ⚠️ No Connection Pooling Configuration
**Location**: `db/index.ts`
**Risk**: MEDIUM - Potential connection exhaustion
**Finding**: Using default Supabase connection without pool configuration
```typescript
// Should configure connection pooling:
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Good Practices Observed ✅

1. **Type Safety**: Good use of Drizzle's type inference
2. **Schema Organization**: Well-structured schema files
3. **Consistent Naming**: Snake_case in database, proper mapping
4. **Index Usage**: Good indexing strategy (though needs RLS consideration)

### Immediate Action Items

1. **Switch to Migration Workflow** (Critical)
   ```bash
   # Generate migration from current state
   pnpm db:generate

   # Apply migrations in CI/CD
   pnpm db:migrate
   ```

2. **Add Relations to All Schemas** (High Priority)
   - Define relations for query API
   - Enables efficient nested queries
   - Better type safety

3. **Implement Transactions** (Critical for Data Integrity)
   - Portfolio updates
   - Vault operations
   - Any multi-step operations

4. **Create Prepared Statements** (Performance)
   - User lookups
   - Portfolio fetches
   - Frequently used queries

5. **Optimize Select Queries** (Performance)
   - Select only needed columns
   - Use proper joins via relations
   - Implement pagination

### Performance Impact Estimates

- Prepared statements: 20-30% faster for repeated queries
- Column selection: 10-50% less data transfer
- Proper relations: 50-70% fewer queries (eliminates N+1)
- Connection pooling: Handles 10x more concurrent users

### Updated Implementation Timeline

#### Week 1 (Updated)
- Day 1-2: Enable RLS + Fix Drizzle migrations
- Day 3-4: Create RLS policies + Add relations
- Day 5: Implement transactions + Test

#### Week 2
- Prepared statements for high-frequency queries
- Optimize all select queries
- Connection pool configuration

#### Week 3
- Performance testing with prepared statements
- Monitor and optimize based on metrics
- Documentation updates
