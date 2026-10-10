import { readConfig } from "./config.js";
import { createAuth } from "./auth.js";
import { createApp } from "./app.js";
import { createAuthEmailSender } from "./email.js";
import { createDatabase } from "./db/client.js";
import { createMediaStorage } from "./media-storage.js";

const config = readConfig();
const { pool, db } = createDatabase(config);
const sendEmail = createAuthEmailSender(config);
const auth = createAuth(db, config, sendEmail);
const mediaStorage = createMediaStorage(config);
const app = createApp({ config, db, auth, sendEmail, mediaStorage });

const close = async (signal: string) => {
  app.log.info({ signal }, "Shutting down NETRA");
  await app.close();
  await pool.end();
  process.exit(0);
};
process.once("SIGINT", () => void close("SIGINT"));
process.once("SIGTERM", () => void close("SIGTERM"));

try {
  await app.listen({ host: config.host, port: config.port });
  app.log.info({ host: config.host, port: config.port }, "NETRA is ready");
} catch (error) {
  app.log.error({ err: error }, "NETRA failed to start");
  await pool.end();
  process.exitCode = 1;
}
