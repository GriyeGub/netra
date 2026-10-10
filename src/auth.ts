import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import type { NetraDatabase } from "./db/client.js";
import * as schema from "./db/schema.js";
import {
  accounts,
  businessMemberships,
  businessProfiles,
  consumerProfiles,
  events,
  profileMemberships,
  profiles,
  sessions,
  users,
  verifications,
} from "./db/schema.js";
import type { AppConfig } from "./config.js";
import type { AuthEmail } from "./email.js";

export function createAuth(
  db: NetraDatabase,
  config: AppConfig,
  sendEmail: (message: AuthEmail) => Promise<void>,
) {
  // Verification remains available in the auth provider, but V1 has disabled
  // both the gate and outbound verification mail. Re-enable with real email
  // delivery and restore the frontend pending-verification step.
  const emailVerificationRequired = false;
  return betterAuth({
    appName: "NETRA",
    baseURL: config.appUrl,
    secret: config.authSecret,
    trustedOrigins: [config.appUrl],
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        ...schema,
        user: users,
        session: sessions,
        account: accounts,
        verification: verifications,
      },
    }),
    user: {
      modelName: "users",
      additionalFields: {
        username: { type: "string", required: true, input: true, returned: true },
      },
    },
    session: {
      modelName: "sessions",
      additionalFields: {
        activeProfile: { type: "string", required: false, defaultValue: "consumer", input: false },
      },
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24 * 7,
      cookieCache: { enabled: false },
    },
    account: { modelName: "accounts" },
    verification: { modelName: "verifications" },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: emailVerificationRequired,
      minPasswordLength: 10,
      maxPasswordLength: 128,
      revokeSessionsOnPasswordReset: true,
      resetPasswordTokenExpiresIn: 60 * 60,
      sendResetPassword: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Reset your NETRA password",
          url,
          text: `Use this secure link to choose a new NETRA password. The link expires in one hour.\n\n${url}`,
        });
      },
    },
    emailVerification: {
      sendOnSignUp: emailVerificationRequired,
      sendOnSignIn: emailVerificationRequired,
      autoSignInAfterVerification: true,
      expiresIn: 60 * 60,
      sendVerificationEmail: async ({ user, url }) => {
        if (!emailVerificationRequired) {
          throw new APIError("BAD_REQUEST", { message: "Email verification is disabled for NETRA V1." });
        }
        try {
          await sendEmail({
            to: user.email,
            subject: "Verify your NETRA email",
            url,
            text: `Welcome to NETRA. Verify your email to finish creating your account. This link expires in one hour.\n\n${url}`,
          });
        } catch (error) {
          const mailError = error as Error & { code?: unknown };
          const reason = mailError.message?.startsWith("Email delivery is unavailable")
            ? "SMTP_CONFIGURATION_MISSING"
            : typeof mailError.code === "string" && /^[A-Z0-9_-]{1,32}$/.test(mailError.code)
              ? mailError.code
              : "EMAIL_DELIVERY_FAILED";
          // Provider diagnostics only: never log recipient addresses, links,
          // tokens, SMTP credentials, or provider response bodies.
          console.error("NETRA verification email delivery failed", { reason });
          throw new APIError("SERVICE_UNAVAILABLE", {
            message: "NETRA couldn't send the verification email. Please try again later or contact support.",
          });
        }
      },
    },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 100,
      storage: "memory",
      customRules: {
        "/sign-up/email": { window: 60, max: 5 },
        "/sign-in/email": { window: 60, max: 10 },
        "/request-password-reset": { window: 60, max: 3 },
        "/send-verification-email": { window: 60, max: 3 },
      },
    },
    advanced: {
      useSecureCookies: config.nodeEnv === "production",
      database: { generateId: () => crypto.randomUUID() },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (input) => {
            const user = input as typeof input & { username?: string };
            const username = String(user.username ?? "").trim().replace(/^@/, "").toLowerCase();
            if (!/^[a-z0-9_]{3,30}$/.test(username)) {
              throw new APIError("BAD_REQUEST", { message: "Username must be 3–30 letters, numbers, or underscores." });
            }
            return { data: { ...user, username } };
          },
          after: async (user) => {
            const username = (user as typeof user & { username?: string }).username;
            if (!username) throw new Error("New NETRA accounts must have a username.");
            await db.transaction(async (tx) => {
              await tx.insert(profiles).values({ userId: user.id }).onConflictDoNothing();
              await tx.insert(consumerProfiles).values({ userId: user.id }).onConflictDoNothing();
              await tx
                .insert(profileMemberships)
                .values({ userId: user.id, profileType: "consumer" })
                .onConflictDoNothing();
              await tx
                .insert(events)
                .values({ actorUserId: user.id, eventType: "ACCOUNT_CREATED", metadata: { username } });
            });
          },
        },
      },
    },
  });
}
