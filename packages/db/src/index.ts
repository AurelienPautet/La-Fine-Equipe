import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { events } from "./schema";

let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

export function getPool() {
  if (!_pool) {
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 30000,
    });
  }
  return _pool;
}

export function getDb() {
  if (!_db) {
    const pool = getPool();
    _db = drizzle(pool, { schema: { events } });
  }
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    return (getDb() as any)[prop];
  },
});
