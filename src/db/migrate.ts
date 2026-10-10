import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("Set DATABASE_URL before running migrations.");

const pool = new pg.Pool({ connectionString: databaseUrl, max: 1, application_name: "netra-migrations" });
try {
  await migrate(drizzle(pool), { migrationsFolder: "./drizzle" });
  console.info("NETRA PostgreSQL migrations are up to date.");
} finally {
  await pool.end();
}
