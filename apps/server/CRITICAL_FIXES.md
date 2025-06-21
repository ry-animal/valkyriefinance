# Server Application - Critical Security & Performance Fixes

## 🚨 IMMEDIATE ACTION REQUIRED

The following critical issues have been identified and must be fixed before production:

### 1. Enable Row Level Security (RLS) - CRITICAL SECURITY

**Run this immediately in your Supabase dashboard:**

```bash
# From apps/server directory
pnpm db:apply-rls
```

Or manually run the SQL script in Supabase SQL Editor:
- Location: `src/db/scripts/enable-rls.sql`

⚠️ **WARNING**: Your database is currently completely exposed. Anyone with the public anon key can access all data!

### 2. Switch to Migrations (Production Safety)

We've updated from `db:push` to proper migrations:

```bash
# Generate new migrations
pnpm db:generate

# Apply migrations
pnpm db:migrate
```

### 3. Critical Code Updates Applied

✅ **Transactions Added**: Multi-step operations now use transactions
- `updatePortfolioAssets` - Atomic portfolio updates
- `rebalanceVaultStrategies` - Atomic strategy rebalancing

✅ **Relations Defined**: All schema files now have proper relations
- Enables Drizzle's relational query API
- Better type safety and performance

## Updated Scripts

```json
{
  "db:generate": "drizzle-kit generate",      // Generate migration files
  "db:migrate": "tsx src/db/migrate.ts",      // Apply migrations
  "db:migrate:make": "drizzle-kit generate",  // Alias for generate
  "db:apply-rls": "tsx src/db/scripts/apply-rls.ts", // Apply RLS
  "db:studio": "drizzle-kit studio",          // Database UI
  "db:push": "drizzle-kit push"               // ONLY for local dev
}
```

## Migration Workflow

1. **Development**: Make schema changes
2. **Generate**: `pnpm db:generate`
3. **Test**: Apply locally with `pnpm db:migrate`
4. **Deploy**: Migrations run automatically in CI/CD

## Performance Optimizations TODO

After fixing critical security issues:

1. **Add Prepared Statements**:
   ```typescript
   const getUserByIdStmt = db.select().from(user)
     .where(eq(user.id, placeholder('userId')))
     .prepare();
   ```

2. **Optimize Selects**:
   ```typescript
   // Instead of: db.select().from(table)
   // Use: db.select({ id: table.id, name: table.name }).from(table)
   ```

3. **Connection Pooling**: Configure in production

## Testing

Run transactions test:
```bash
pnpm test:transactions
```

## Next Steps

1. ✅ Enable RLS (TODAY)
2. ✅ Switch to migrations
3. ✅ Add transactions
4. ✅ Define relations
5. ⏳ Add prepared statements
6. ⏳ Optimize queries
7. ⏳ Configure connection pooling
