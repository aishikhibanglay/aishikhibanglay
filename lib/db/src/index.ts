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

// Parse URL manually to avoid %40 encoding ambiguity with pg's internal parser
let poolConfig: pg.PoolConfig;
try {
  const url = new URL(dbUrl);
  const user = decodeURIComponent(url.username);
  const password = decodeURIComponent(url.password);
  const host = url.hostname;
  const port = Number(url.port) || 5432;
  const database = url.pathname.replace(/^\//, "");

  console.log(`[DB] host=${host}:${port} user=${user} db=${database} ssl=${isSupabase}`);

  poolConfig = {
    host,
    port,
    database,
    user,
    password,
    ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 15000,
  };
} catch {
  console.log("[DB] URL parse failed, using connectionString fallback");
  poolConfig = {
    connectionString: dbUrl,
    ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 15000,
  };
}

export const pool = new Pool(poolConfig);

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
