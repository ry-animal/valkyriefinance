import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/lib/env";
import * as auth from "./schema/auth";
import * as todo from "./schema/todo";
import * as portfolio from "./schema/portfolio";
import * as transactions from "./schema/transactions";
import * as vault from "./schema/vault";
import * as analytics from "./schema/analytics";

export const db = drizzle(env.DATABASE_URL, {
  schema: {
    ...auth,
    ...todo,
    ...portfolio,
    ...transactions,
    ...vault,
    ...analytics,
  },
});

export * from "./schema/auth";
export * from "./schema/todo";
export * from "./schema/portfolio";
export * from "./schema/transactions";
export * from "./schema/vault";
export * from "./schema/analytics";
