import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { events } from "./schema";

let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

export function getPool() {
  if (!_pool) {
    const isProduction = process.env.NODE_ENV === "production";

    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
      max: 2,
      idleTimeoutMillis: 5000,
      connectionTimeoutMillis: 10000,
      allowExitOnIdle: false,
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

export async function closePool() {
  if (_pool) {
    await _pool.end();
    _pool = null;
    _db = null;
  }
}
