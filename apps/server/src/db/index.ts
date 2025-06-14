import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/lib/env";
import * as user from "./schema/user";
import * as portfolio from "./schema/portfolio";
import * as transactions from "./schema/transactions";
import * as vault from "./schema/vault";
import * as analytics from "./schema/analytics";

export const db = drizzle(env.DATABASE_URL, {
  schema: {
    ...user,
    ...portfolio,
    ...transactions,
    ...vault,
    ...analytics,
  },
});

export * from "./schema/user";
export * from "./schema/portfolio";
export * from "./schema/transactions";
export * from "./schema/vault";
export * from "./schema/analytics";
