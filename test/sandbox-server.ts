import "dotenv/config";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { join } from "node:path";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import * as schema from "../src/db/schema.js";
import { createAuth } from "../src/auth.js";
import { createApp } from "../src/app.js";
import { createAuthEmailSender } from "../src/email.js";
import type { AppConfig } from "../src/config.js";
import type { NetraDatabase } from "../src/db/client.js";
import { createMediaStorage } from "../src/media-storage.js";

if (process.env.NODE_ENV === "production") throw new Error("The PGlite sandbox must never run in production.");

const port = Number(process.env.PORT ?? 4173);
const appUrl = process.env.APP_URL ?? `http://127.0.0.1:${port}`;
const mediaRoot = await mkdtemp(join(tmpdir(), "netra-sandbox-media-"));
const config: AppConfig = {
  nodeEnv: "test",
  host: "127.0.0.1",
  port,
  appUrl,
  databaseUrl: "postgres://sandbox:sandbox@localhost/netra_sandbox",
  authSecret: "netra-local-sandbox-only-secret-change-for-real-deployments",
  // The sandbox uses real SMTP for account verification. It must not report
  // terminal-only links as delivered email.
  emailMode: "smtp",
  emailFrom: process.env.EMAIL_FROM,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
  smtpUser: process.env.SMTP_USER,
  smtpPassword: process.env.SMTP_PASSWORD,
  mediaStorageMode: "local",
  mediaStorageRoot: mediaRoot,
  mediaMaxBytes: 524288000,
  s3ForcePathStyle: false,
  mediaAdminUserIds: [],
};

const client = new PGlite();
const db = drizzle(client, { schema }) as unknown as NetraDatabase;
await migrate(db as never, { migrationsFolder: join(process.cwd(), "drizzle") });
const sendEmail = createAuthEmailSender(config);
const auth = createAuth(db, config, sendEmail);
const mediaStorage = createMediaStorage(config);
const app = createApp({ config, db, auth, sendEmail, mediaStorage });

const close = async () => {
  await app.close();
  await client.close();
  await rm(mediaRoot, { recursive: true, force: true });
};
process.once("SIGINT", () => void close().then(() => process.exit(0)));
process.once("SIGTERM", () => void close().then(() => process.exit(0)));
await app.listen({ host: config.host, port: config.port });
app.log.info({ host: config.host, port: config.port }, "NETRA isolated PGlite sandbox is ready");
