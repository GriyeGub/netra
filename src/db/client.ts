import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";
import type { AppConfig } from "../config.js";

const { Pool } = pg;

export function createDatabase(config: AppConfig) {
  const pool = new Pool({
    connectionString: config.databaseUrl,
    max: 12,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    application_name: "netra-v1",
    ssl: config.nodeEnv === "production" ? { rejectUnauthorized: true } : undefined,
  });
  pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL pool error", error);
  });
  return { pool, db: drizzle(pool, { schema }) };
}

export type NetraDatabase = ReturnType<typeof createDatabase>["db"];
