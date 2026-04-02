import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const dbUrl = process.env.DATABASE_URL;
const isSupabase =
  dbUrl.includes("supabase.co") ||
  dbUrl.includes("supabase.com");

// Log DB host (without password) for debugging
try {
  const url = new URL(dbUrl);
  console.log(`[DB] Connecting to: ${url.hostname}:${url.port || 5432} (SSL: ${isSupabase})`);
} catch {
  console.log("[DB] DATABASE_URL format issue");
}

export const pool = new Pool({
  connectionString: dbUrl,
  ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
  connectionTimeoutMillis: 15000,
});

// Test connection at startup and log actual error
pool.connect().then((client) => {
  console.log("[DB] Connection successful ✓");
  client.release();
}).catch((err: Error & { code?: string }) => {
  console.error(`[DB] Connection FAILED: ${err.message} (code: ${err.code})`);
});

pool.on("error", (err: Error) => {
  console.error("[DB] Pool error:", err.message);
});

export const db = drizzle(pool, { schema });

export * from "./schema";
