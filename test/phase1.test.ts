import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { join } from "node:path";
import { rm } from "node:fs/promises";
import * as schema from "../src/db/schema.js";
import { createAuth } from "../src/auth.js";
import { createApp } from "../src/app.js";
import type { AppConfig } from "../src/config.js";
import type { AuthEmail } from "../src/email.js";
import type { NetraDatabase } from "../src/db/client.js";
import { createMediaStorage } from "../src/media-storage.js";

describe("Phase 1 account and authentication journey", () => {
  const config: AppConfig = {
    nodeEnv: "test",
    host: "127.0.0.1",
    port: 4173,
    appUrl: "http://127.0.0.1:4173",
    databaseUrl: "postgres://test:test@127.0.0.1/test",
    authSecret: "phase-one-test-secret-with-32-characters-minimum",
    emailMode: "console",
    mediaStorageMode: "local",
    mediaStorageRoot: "/tmp/netra-v1-vitest-media",
    mediaMaxBytes: 524288000,
    s3ForcePathStyle: false,
    mediaAdminUserIds: [],
  };

  let client: PGlite;
  let db: NetraDatabase;
  let app: ReturnType<typeof createApp>;
  const sentEmails: AuthEmail[] = [];

  beforeAll(async () => {
    await rm(config.mediaStorageRoot, { recursive: true, force: true });
    client = new PGlite();
    db = drizzle(client, { schema }) as unknown as NetraDatabase;
    await migrate(db as never, { migrationsFolder: join(process.cwd(), "drizzle") });
    const sendEmail = async (email: AuthEmail) => { sentEmails.push(email); };
    const auth = createAuth(db, config, sendEmail);
    const mediaStorage = createMediaStorage(config);
    app = createApp({ config, db, auth, sendEmail, mediaStorage, staticRoot: join(process.cwd(), "outputs") });
    await app.ready();
  });

  afterAll(async () => {
    await app?.close();
    await client?.close();
    await rm(config.mediaStorageRoot, { recursive: true, force: true });
  });

  it("creates an unverified account, activates and switches profiles, and persists sessions", async () => {
    const signup = await app.inject({
      method: "POST",
      url: "/api/auth/sign-up/email",
      headers: { "content-type": "application/json", origin: config.appUrl },
      payload: {
        name: "Ayush Test",
        username: "@ayush_test",
        email: "ayush-test@example.com",
        password: "very-secure-test-password",
        callbackURL: `${config.appUrl}/?activateProfile=creator`,
      },
    });
    expect(signup.statusCode).toBeLessThan(400);
    expect(sentEmails).toHaveLength(0);
    const cookieHeader = signup.headers["set-cookie"];
    const cookies = (Array.isArray(cookieHeader) ? cookieHeader : cookieHeader ? [cookieHeader] : [])
      .map((cookie) => cookie.split(";")[0])
      .join("; ");
    expect(cookies).toContain("better-auth");

    const me = await app.inject({ method: "GET", url: "/api/v1/me", headers: { cookie: cookies } });
    expect(me.statusCode).toBe(200);
    const account = me.json();
    expect(account.user.emailVerified).toBe(false);
    expect(account.user.username).toBe("ayush_test");
    expect(account.activatedProfiles).toEqual(["consumer"]);
    expect(account.activeProfile).toBe("consumer");

    const unauthorizedMedia = await app.inject({ method: "POST", url: "/api/v1/media/upload-intents", payload: { fileName: "avatar.png", contentType: "image/png", byteSize: 1, purpose: "profile_avatar" } });
    expect(unauthorizedMedia.statusCode).toBe(401);
    const imageBytes = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j6WQAAAAASUVORK5CYII=", "base64");
    const mediaIntent = await app.inject({
      method: "POST", url: "/api/v1/media/upload-intents",
      headers: { cookie: cookies, "content-type": "application/json" },
      payload: { fileName: "avatar.png", contentType: "image/png", byteSize: imageBytes.byteLength, purpose: "profile_avatar" },
    });
    expect(mediaIntent.statusCode).toBe(201);
    const intent = mediaIntent.json();
    const uploadUrl = new URL(intent.uploadUrl);
    const uploaded = await app.inject({
      method: "PUT", url: `${uploadUrl.pathname}${uploadUrl.search}`,
      headers: { "content-type": "image/png", "content-length": String(imageBytes.byteLength) }, payload: imageBytes,
    });
    expect(uploaded.statusCode).toBe(204);
    const completedMedia = await app.inject({ method: "POST", url: `/api/v1/media/${intent.id}/complete`, headers: { cookie: cookies } });
    expect(completedMedia.statusCode).toBe(201);
    expect(completedMedia.json().status).toBe("READY");
    const attachedPhoto = await app.inject({
      method: "PATCH", url: "/api/v1/me/profile", headers: { cookie: cookies, "content-type": "application/json" },
      payload: { avatarMediaId: intent.id },
    });
    expect(attachedPhoto.statusCode).toBe(200);
    const publicAvatar = await app.inject({ method: "GET", url: `/api/v1/media/${intent.id}/content` });
    expect(publicAvatar.statusCode).toBe(200);
    expect(publicAvatar.rawPayload.equals(imageBytes)).toBe(true);
    const untrustedImageUrl = await app.inject({
      method: "PATCH", url: "/api/v1/me/profile", headers: { cookie: cookies, "content-type": "application/json" },
      payload: { image: "https://example.test/fake-avatar.png" },
    });
    expect(untrustedImageUrl.statusCode).toBe(400);

    const activated = await app.inject({ method: "POST", url: "/api/v1/me/profiles/creator/activate", headers: { cookie: cookies } });
    expect(activated.statusCode).toBe(200);
    expect(activated.json().activeProfile).toBe("creator");

    const creatorMe = await app.inject({ method: "GET", url: "/api/v1/me", headers: { cookie: cookies } });
    expect(creatorMe.json().activatedProfiles).toContain("creator");
    expect(creatorMe.json().activeProfile).toBe("creator");

    const switched = await app.inject({
      method: "PUT",
      url: "/api/v1/me/active-profile",
      headers: { cookie: cookies, "content-type": "application/json" },
      payload: { profileType: "consumer" },
    });
    expect(switched.statusCode).toBe(200);
    expect(switched.json().activeProfile).toBe("consumer");

    const preferences = await app.inject({
      method: "PUT",
      url: "/api/v1/me/preferences",
      headers: { cookie: cookies, "content-type": "application/json" },
      payload: { interests: ["Coffee", "Home"], contentPreferences: ["Reviews"], activeIntent: "I’m looking to buy", discoveryMode: "Simple", buyingCapacity: "₹7,500+", radar: "A quiet espresso maker" },
    });
    expect(preferences.statusCode).toBe(200);
    const savedProgress = await app.inject({
      method: "PATCH",
      url: "/api/v1/me/onboarding",
      headers: { cookie: cookies, "content-type": "application/json" },
      payload: { step: "details", data: { about: "A real saved test profile." } },
    });
    expect(savedProgress.statusCode).toBe(200);
    const savedMe = await app.inject({ method: "GET", url: "/api/v1/me", headers: { cookie: cookies } });
    expect(savedMe.json().consumer.interests).toEqual(["Coffee", "Home"]);
    expect(savedMe.json().consumer.activeIntent).toBe("I’m looking to buy");
    expect(savedMe.json().profileSetup.currentStep).toBe("details");
    const completed = await app.inject({ method: "POST", url: "/api/v1/me/onboarding/complete", headers: { cookie: cookies } });
    expect(completed.statusCode).toBe(200);
    const completedMe = await app.inject({ method: "GET", url: "/api/v1/me", headers: { cookie: cookies } });
    expect(completedMe.json().profile.onboardingComplete).toBe(true);

    const refused = await app.inject({
      method: "PUT",
      url: "/api/v1/me/active-profile",
      headers: { cookie: cookies, "content-type": "application/json" },
      payload: { profileType: "business" },
    });
    expect(refused.statusCode).toBe(403);

    const businessActivated = await app.inject({ method: "POST", url: "/api/v1/me/profiles/business/activate", headers: { cookie: cookies } });
    expect(businessActivated.statusCode).toBe(200);
    const businessRequest = await app.inject({
      method: "POST", url: "/api/v1/business/verification-requests",
      headers: { cookie: cookies, "content-type": "application/json" },
      payload: { businessEmail: "brand@example.test", businessWebsite: "https://brand.example.test", registrationId: "TEST-REG-001" },
    });
    expect(businessRequest.statusCode).toBe(201);
    expect(businessRequest.json().status).toBe("PENDING");
    expect(businessRequest.json().emailStatus).toBe("CONSOLE_ONLY");
    expect(sentEmails.at(-1)?.to).toBe("brand@example.test");
    const duplicateBusinessRequest = await app.inject({
      method: "POST", url: "/api/v1/business/verification-requests",
      headers: { cookie: cookies, "content-type": "application/json" },
      payload: { businessEmail: "brand@example.test" },
    });
    expect(duplicateBusinessRequest.statusCode).toBe(409);
    const businessMe = await app.inject({ method: "GET", url: "/api/v1/me", headers: { cookie: cookies } });
    expect(businessMe.json().activeProfile).toBe("business");
    expect(businessMe.json().profileSetup.verificationStatus).toBe("PENDING");
    const backToConsumer = await app.inject({
      method: "PUT", url: "/api/v1/me/active-profile",
      headers: { cookie: cookies, "content-type": "application/json" }, payload: { profileType: "consumer" },
    });
    expect(backToConsumer.statusCode).toBe(200);
    const businessRequestFromConsumer = await app.inject({
      method: "POST", url: "/api/v1/business/verification-requests",
      headers: { cookie: cookies, "content-type": "application/json" },
      payload: { businessEmail: "brand@example.test" },
    });
    expect(businessRequestFromConsumer.statusCode).toBe(403);

    const signedOut = await app.inject({ method: "POST", url: "/api/auth/sign-out", headers: { cookie: cookies } });
    expect(signedOut.statusCode).toBeLessThan(400);
    const loggedOutMe = await app.inject({ method: "GET", url: "/api/v1/me", headers: { cookie: cookies } });
    expect(loggedOutMe.statusCode).toBe(401);

    const signin = await app.inject({
      method: "POST",
      url: "/api/auth/sign-in/email",
      headers: { "content-type": "application/json", origin: config.appUrl },
      payload: { email: "ayush-test@example.com", password: "very-secure-test-password", rememberMe: true },
    });
    expect(signin.statusCode).toBeLessThan(400);
    const signinCookies = (Array.isArray(signin.headers["set-cookie"]) ? signin.headers["set-cookie"] : [signin.headers["set-cookie"]])
      .filter(Boolean)
      .map((cookie) => String(cookie).split(";")[0])
      .join("; ");
    const persistentMe = await app.inject({ method: "GET", url: "/api/v1/me", headers: { cookie: signinCookies } });
    expect(persistentMe.statusCode).toBe(200);
    expect(persistentMe.json().user.id).toBe(account.user.id);

    const oldEmailCount = sentEmails.length;
    const resetRequest = await app.inject({
      method: "POST",
      url: "/api/auth/request-password-reset",
      headers: { "content-type": "application/json", origin: config.appUrl },
      payload: { email: "ayush-test@example.com", redirectTo: `${config.appUrl}/?reset=1` },
    });
    expect(resetRequest.statusCode).toBe(200);
    expect(sentEmails).toHaveLength(oldEmailCount + 1);
    expect(sentEmails.at(-1)?.subject).toContain("Reset");

    const resetLink = new URL(sentEmails.at(-1)!.url);
    const resetRedirect = await app.inject({ method: "GET", url: `${resetLink.pathname}${resetLink.search}` });
    expect([302, 303, 307, 308]).toContain(resetRedirect.statusCode);
    const callback = new URL(String(resetRedirect.headers.location));
    const resetToken = callback.searchParams.get("token");
    expect(resetToken).toBeTruthy();
    const resetPassword = await app.inject({
      method: "POST", url: "/api/auth/reset-password",
      headers: { "content-type": "application/json", origin: config.appUrl },
      payload: { token: resetToken, newPassword: "another-secure-test-password" },
    });
    expect(resetPassword.statusCode).toBe(200);
    const revokedSession = await app.inject({ method: "GET", url: "/api/v1/me", headers: { cookie: signinCookies } });
    expect(revokedSession.statusCode).toBe(401);
    const oldPasswordSignin = await app.inject({
      method: "POST", url: "/api/auth/sign-in/email",
      headers: { "content-type": "application/json", origin: config.appUrl },
      payload: { email: "ayush-test@example.com", password: "very-secure-test-password" },
    });
    expect(oldPasswordSignin.statusCode).toBeGreaterThanOrEqual(400);
    const newPasswordSignin = await app.inject({
      method: "POST", url: "/api/auth/sign-in/email",
      headers: { "content-type": "application/json", origin: config.appUrl },
      payload: { email: "ayush-test@example.com", password: "another-secure-test-password" },
    });
    expect(newPasswordSignin.statusCode).toBeLessThan(400);
  });

  it("allows signup, onboarding, sign-out, and sign-in without email verification", async () => {
    const before = sentEmails.length;
    const signup = await app.inject({
      method: "POST", url: "/api/auth/sign-up/email",
      headers: { "content-type": "application/json", origin: config.appUrl },
      payload: { name: "Unverified Test", username: "unverified_test", email: "unverified-test@example.com", password: "very-secure-test-password" },
    });
    expect(signup.statusCode).toBeLessThan(400);
    expect(sentEmails).toHaveLength(before);
    const signupCookies = (Array.isArray(signup.headers["set-cookie"]) ? signup.headers["set-cookie"] : [signup.headers["set-cookie"]])
      .filter(Boolean).map((cookie) => String(cookie).split(";")[0]).join("; ");
    expect(signupCookies).toContain("better-auth");

    const me = await app.inject({ method: "GET", url: "/api/v1/me", headers: { cookie: signupCookies } });
    expect(me.statusCode).toBe(200);
    expect(me.json().user.emailVerified).toBe(false);
    const progress = await app.inject({
      method: "PATCH", url: "/api/v1/me/onboarding",
      headers: { cookie: signupCookies, "content-type": "application/json" },
      payload: { step: "personalization", data: { interests: ["Coffee"] } },
    });
    expect(progress.statusCode).toBe(200);

    const signout = await app.inject({ method: "POST", url: "/api/auth/sign-out", headers: { cookie: signupCookies } });
    expect(signout.statusCode).toBeLessThan(400);
    const signin = await app.inject({
      method: "POST", url: "/api/auth/sign-in/email",
      headers: { "content-type": "application/json", origin: config.appUrl },
      payload: { email: "unverified-test@example.com", password: "very-secure-test-password" },
    });
    expect(signin.statusCode).toBeLessThan(400);
    const signinCookies = (Array.isArray(signin.headers["set-cookie"]) ? signin.headers["set-cookie"] : [signin.headers["set-cookie"]])
      .filter(Boolean).map((cookie) => String(cookie).split(";")[0]).join("; ");
    const returnedMe = await app.inject({ method: "GET", url: "/api/v1/me", headers: { cookie: signinCookies } });
    expect(returnedMe.statusCode).toBe(200);
    expect(returnedMe.json().user.emailVerified).toBe(false);
    expect(returnedMe.json().profileSetup.currentStep).toBe("personalization");

    const disabledResend = await app.inject({
      method: "POST", url: "/api/auth/send-verification-email",
      headers: { "content-type": "application/json", origin: config.appUrl },
      payload: { email: "unverified-test@example.com" },
    });
    expect(disabledResend.statusCode).toBeGreaterThanOrEqual(400);
    expect(sentEmails).toHaveLength(before);
  });

  it("serves the existing frontend and readiness reports the database", async () => {
    const home = await app.inject({ method: "GET", url: "/" });
    expect(home.statusCode).toBe(200);
    expect(home.body).toContain("NETRA");
    const ready = await app.inject({ method: "GET", url: "/api/health/ready" });
    expect(ready.statusCode).toBe(200);
    expect(ready.json().database).toBe("connected");
  });
});
