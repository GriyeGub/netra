import { readConfig } from "../src/config.js";
import { createAuth } from "../src/auth.js";
import { createApp } from "../src/app.js";
import { createAuthEmailSender } from "../src/email.js";
import { createDatabase } from "../src/db/client.js";
import { createMediaStorage } from "../src/media-storage.js";

const config = readConfig();
const { db } = createDatabase(config);
const sendEmail = createAuthEmailSender(config);
const auth = createAuth(db, config, sendEmail);
const mediaStorage = createMediaStorage(config);

const app = createApp({ config, db, auth, sendEmail, mediaStorage });

export default async function handler(req: any, res: any) {
  await app.ready();
  app.server.emit('request', req, res);
}
