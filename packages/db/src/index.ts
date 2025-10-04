import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { articles } from "./schema";

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    _db = drizzle(pool, { schema: { articles } });
  }
  return _db;
}

// For backwards compatibility
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    return (getDb() as any)[prop];
  }
});
