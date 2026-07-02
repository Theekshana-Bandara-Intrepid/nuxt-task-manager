// server/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// useDb() is called once per request in API routes
let _db: ReturnType<typeof drizzle> | null = null;

export function useDb() {
  if (!_db) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    _db = drizzle(pool, { schema });
  }
  return _db;
}
