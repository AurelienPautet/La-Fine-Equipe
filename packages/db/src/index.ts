import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { events } from "./schema";

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
      max: 1,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
    });
    _db = drizzle(pool, { schema: { events } });
  }
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    return (getDb() as any)[prop];
  },
});
