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

describe("Milestone 1 Bites Integration Test Suite", () => {
  const config: AppConfig = {
    nodeEnv: "test",
    host: "127.0.0.1",
    port: 4174,
    appUrl: "http://127.0.0.1:4174",
    databaseUrl: "postgres://test:test@127.0.0.1/test_bites",
    authSecret: "bites-test-secret-with-32-characters-minimum-length",
    emailMode: "console",
    mediaStorageMode: "local",
    mediaStorageRoot: "/tmp/netra-v1-vitest-bites-media",
    mediaMaxBytes: 524288000,
    s3ForcePathStyle: false,
    mediaAdminUserIds: [],
  };

  let client: PGlite;
  let db: NetraDatabase;
  let app: ReturnType<typeof createApp>;
  const sentEmails: AuthEmail[] = [];

  let userACookie: string;
  let userBCookie: string;
  let biteId: string;
  let mediaId: string;

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

  const extractCookie = (res: { headers: Record<string, any> }) => {
    const cookieHeader = res.headers["set-cookie"];
    return (Array.isArray(cookieHeader) ? cookieHeader : cookieHeader ? [cookieHeader] : [])
      .map((cookie: string) => cookie.split(";")[0])
      .join("; ");
  };

  it("registers User A (Creator) and User B (Consumer)", async () => {
    const signupA = await app.inject({
      method: "POST",
      url: "/api/auth/sign-up/email",
      headers: { "content-type": "application/json", origin: config.appUrl },
      payload: {
        name: "Creator Alpha",
        username: "@creator_alpha",
        email: "creator.alpha@example.test",
        password: "very-secure-test-password-123",
      },
    });
    expect(signupA.statusCode).toBeLessThan(400);
    userACookie = extractCookie(signupA);
    expect(userACookie).toContain("better-auth");

    const activateA = await app.inject({
      method: "POST",
      url: "/api/v1/me/profiles/creator/activate",
      headers: { cookie: userACookie },
    });
    expect(activateA.statusCode).toBe(200);

    const signupB = await app.inject({
      method: "POST",
      url: "/api/auth/sign-up/email",
      headers: { "content-type": "application/json", origin: config.appUrl },
      payload: {
        name: "Consumer Beta",
        username: "@consumer_beta",
        email: "consumer.beta@example.test",
        password: "very-secure-test-password-456",
      },
    });
    expect(signupB.statusCode).toBeLessThan(400);
    userBCookie = extractCookie(signupB);
    expect(userBCookie).toContain("better-auth");
  });

  it("blocks unauthenticated users from creating a Bite", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/bites",
      headers: { "content-type": "application/json" },
      payload: { title: "Unauthenticated Bite" },
    });
    expect(res.statusCode).toBe(401);
  });

  it("allows User A to create a draft Bite", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/bites",
      headers: { cookie: userACookie, "content-type": "application/json" },
      payload: {
        title: "Alpha's First Craft Bite",
        description: "A showcase of handmade artisanal copper kettles.",
      },
    });
    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.id).toBeDefined();
    expect(body.status).toBe("DRAFT");
    expect(body.title).toBe("Alpha's First Craft Bite");
    expect(body.mediaAssetId).toBeNull();
    biteId = body.id;
  });

  it("prevents User B from updating User A's draft", async () => {
    const res = await app.inject({
      method: "PATCH",
      url: `/api/v1/bites/${biteId}`,
      headers: { cookie: userBCookie, "content-type": "application/json" },
      payload: { title: "Hijacked Title" },
    });
    expect(res.statusCode).toBe(403);
  });

  it("allows User A to update their draft", async () => {
    const res = await app.inject({
      method: "PATCH",
      url: `/api/v1/bites/${biteId}`,
      headers: { cookie: userACookie, "content-type": "application/json" },
      payload: { title: "Updated Copper Kettle Journey" },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().title).toBe("Updated Copper Kettle Journey");
  });

  it("prevents publishing without valid ready media", async () => {
    const res = await app.inject({
      method: "POST",
      url: `/api/v1/bites/${biteId}/publish`,
      headers: { cookie: userACookie },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().error.code).toBe("MEDIA_REQUIRED");
  });

  it("uploads a valid media asset and attaches it to User A's draft", async () => {
    // 1. Get media upload intent
    const videoBytes = Buffer.from([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d, 0x00, 0x00, 0x02, 0x00, 0x69, 0x73, 0x6f, 0x6d, 0x69, 0x73, 0x6f, 0x32]);
    const intentRes = await app.inject({
      method: "POST",
      url: "/api/v1/media/upload-intents",
      headers: { cookie: userACookie, "content-type": "application/json" },
      payload: {
        fileName: "craft_kettle.mp4",
        contentType: "video/mp4",
        byteSize: videoBytes.byteLength,
        purpose: "bite",
      },
    });
    expect(intentRes.statusCode).toBe(201);
    const intent = intentRes.json();
    mediaId = intent.id;

    // 2. Put file to upload URL
    const uploadUrl = new URL(intent.uploadUrl);
    const putRes = await app.inject({
      method: "PUT",
      url: `${uploadUrl.pathname}${uploadUrl.search}`,
      headers: { "content-type": "video/mp4", "content-length": String(videoBytes.byteLength) },
      payload: videoBytes,
    });
    expect(putRes.statusCode).toBe(204);

    // 3. Complete media asset
    const completeRes = await app.inject({
      method: "POST",
      url: `/api/v1/media/${mediaId}/complete`,
      headers: { cookie: userACookie },
    });
    expect(completeRes.statusCode).toBe(201);
    expect(completeRes.json().status).toBe("READY");

    // 4. Attach to draft
    const patchRes = await app.inject({
      method: "PATCH",
      url: `/api/v1/bites/${biteId}`,
      headers: { cookie: userACookie, "content-type": "application/json" },
      payload: { mediaAssetId: mediaId },
    });
    expect(patchRes.statusCode).toBe(200);
    expect(patchRes.json().mediaAssetId).toBe(mediaId);
  });

  it("prevents User B from publishing User A's Bite", async () => {
    const res = await app.inject({
      method: "POST",
      url: `/api/v1/bites/${biteId}/publish`,
      headers: { cookie: userBCookie },
    });
    expect(res.statusCode).toBe(403);
  });

  it("verifies draft Bite does NOT appear in feed", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/bites/feed",
      headers: { cookie: userBCookie },
    });
    expect(res.statusCode).toBe(200);
    const items = res.json().items;
    expect(items.some((b: any) => b.id === biteId)).toBe(false);
  });

  it("allows User A to publish the Bite and prevents duplicate publishing", async () => {
    const res = await app.inject({
      method: "POST",
      url: `/api/v1/bites/${biteId}/publish`,
      headers: { cookie: userACookie },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.status).toBe("PUBLISHED");
    expect(body.publishedAt).toBeDefined();

    // Duplicate publish request returns 409
    const dupRes = await app.inject({
      method: "POST",
      url: `/api/v1/bites/${biteId}/publish`,
      headers: { cookie: userACookie },
    });
    expect(dupRes.statusCode).toBe(409);
  });

  it("verifies published Bite appears in feed with media and creator info", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/bites/feed",
      headers: { cookie: userBCookie },
    });
    expect(res.statusCode).toBe(200);
    const items = res.json().items;
    const item = items.find((b: any) => b.id === biteId);
    expect(item).toBeDefined();
    expect(item.title).toBe("Updated Copper Kettle Journey");
    expect(item.creator.username).toBe("creator_alpha");
    expect(item.creator.name).toBe("Creator Alpha");
    expect(item.mediaUrl).toContain(`/api/v1/media/${mediaId}/content`);
    expect(item.likeCount).toBe(0);
    expect(item.saveCount).toBe(0);
    expect(item.viewCount).toBe(0);
    expect(item.commentCount).toBe(0);
    expect(item.hasLiked).toBe(false);
    expect(item.hasSaved).toBe(false);
  });

  it("allows recording a VIEW interaction", async () => {
    const res = await app.inject({
      method: "POST",
      url: `/api/v1/bites/${biteId}/interactions`,
      headers: { cookie: userBCookie, "content-type": "application/json" },
      payload: { type: "VIEW" },
    });
    expect(res.statusCode).toBe(200);

    // Second view from user B (views can occur multiple times)
    const res2 = await app.inject({
      method: "POST",
      url: `/api/v1/bites/${biteId}/interactions`,
      headers: { cookie: userBCookie, "content-type": "application/json" },
      payload: { type: "VIEW" },
    });
    expect(res2.statusCode).toBe(200);

    const feedRes = await app.inject({
      method: "GET",
      url: "/api/v1/bites/feed",
      headers: { cookie: userBCookie },
    });
    const item = feedRes.json().items.find((b: any) => b.id === biteId);
    expect(item.viewCount).toBe(2);
  });

  it("handles LIKE and prevents duplicate LIKEs from the same user", async () => {
    // Like by User B
    const likeRes1 = await app.inject({
      method: "POST",
      url: `/api/v1/bites/${biteId}/interactions`,
      headers: { cookie: userBCookie, "content-type": "application/json" },
      payload: { type: "LIKE" },
    });
    expect(likeRes1.statusCode).toBe(200);

    // Duplicate like attempt
    const likeRes2 = await app.inject({
      method: "POST",
      url: `/api/v1/bites/${biteId}/interactions`,
      headers: { cookie: userBCookie, "content-type": "application/json" },
      payload: { type: "LIKE" },
    });
    expect(likeRes2.statusCode).toBe(200);

    // Verify count in feed
    const feedRes = await app.inject({
      method: "GET",
      url: "/api/v1/bites/feed",
      headers: { cookie: userBCookie },
    });
    const item = feedRes.json().items.find((b: any) => b.id === biteId);
    expect(item.likeCount).toBe(1);
    expect(item.hasLiked).toBe(true);
  });

  it("handles SAVE and prevents duplicate SAVEs", async () => {
    const saveRes = await app.inject({
      method: "POST",
      url: `/api/v1/bites/${biteId}/interactions`,
      headers: { cookie: userBCookie, "content-type": "application/json" },
      payload: { type: "SAVE" },
    });
    expect(saveRes.statusCode).toBe(200);

    const dupSave = await app.inject({
      method: "POST",
      url: `/api/v1/bites/${biteId}/interactions`,
      headers: { cookie: userBCookie, "content-type": "application/json" },
      payload: { type: "SAVE" },
    });
    expect(dupSave.statusCode).toBe(200);

    const feedRes = await app.inject({
      method: "GET",
      url: "/api/v1/bites/feed",
      headers: { cookie: userBCookie },
    });
    const item = feedRes.json().items.find((b: any) => b.id === biteId);
    expect(item.saveCount).toBe(1);
    expect(item.hasSaved).toBe(true);
  });

  it("allows User B to post comments and fetch them with creator info", async () => {
    const commentRes = await app.inject({
      method: "POST",
      url: `/api/v1/bites/${biteId}/comments`,
      headers: { cookie: userBCookie, "content-type": "application/json" },
      payload: { text: "Stunning craftsmanship! Where is the copper sourced?" },
    });
    expect(commentRes.statusCode).toBe(201);
    const comment = commentRes.json();
    expect(comment.id).toBeDefined();
    expect(comment.text).toBe("Stunning craftsmanship! Where is the copper sourced?");

    const fetchComments = await app.inject({
      method: "GET",
      url: `/api/v1/bites/${biteId}/comments`,
    });
    expect(fetchComments.statusCode).toBe(200);
    const commentsList = fetchComments.json().items;
    expect(commentsList).toHaveLength(1);
    expect(commentsList[0].text).toBe("Stunning craftsmanship! Where is the copper sourced?");
    expect(commentsList[0].user.username).toBe("consumer_beta");
    expect(commentsList[0].user.name).toBe("Consumer Beta");
  });

  it("verifies User A (Creator) sees the aggregated multi-user KPIs", async () => {
    const feedA = await app.inject({
      method: "GET",
      url: "/api/v1/bites/feed",
      headers: { cookie: userACookie },
    });
    expect(feedA.statusCode).toBe(200);
    const item = feedA.json().items.find((b: any) => b.id === biteId);
    expect(item.likeCount).toBe(1);
    expect(item.saveCount).toBe(1);
    expect(item.viewCount).toBe(2);
    expect(item.commentCount).toBe(1);
    // User A has not liked or saved it yet
    expect(item.hasLiked).toBe(false);
    expect(item.hasSaved).toBe(false);
  });

  it("allows User B to UNLIKE and UNSAVE", async () => {
    const unlike = await app.inject({
      method: "DELETE",
      url: `/api/v1/bites/${biteId}/interactions/LIKE`,
      headers: { cookie: userBCookie },
    });
    expect(unlike.statusCode).toBe(200);

    const unsave = await app.inject({
      method: "DELETE",
      url: `/api/v1/bites/${biteId}/interactions/SAVE`,
      headers: { cookie: userBCookie },
    });
    expect(unsave.statusCode).toBe(200);

    const feedRes = await app.inject({
      method: "GET",
      url: "/api/v1/bites/feed",
      headers: { cookie: userBCookie },
    });
    const item = feedRes.json().items.find((b: any) => b.id === biteId);
    expect(item.likeCount).toBe(0);
    expect(item.saveCount).toBe(0);
    expect(item.hasLiked).toBe(false);
    expect(item.hasSaved).toBe(false);
  });

  it("verifies feed pagination", async () => {
    // Create and publish a second bite by User A
    const b2Draft = await app.inject({
      method: "POST",
      url: "/api/v1/bites",
      headers: { cookie: userACookie, "content-type": "application/json" },
      payload: { title: "Second Bite" },
    });
    const b2Id = b2Draft.json().id;

    await app.inject({
      method: "PATCH",
      url: `/api/v1/bites/${b2Id}`,
      headers: { cookie: userACookie, "content-type": "application/json" },
      payload: { mediaAssetId: mediaId },
    });

    await app.inject({
      method: "POST",
      url: `/api/v1/bites/${b2Id}/publish`,
      headers: { cookie: userACookie },
    });

    // Query with limit=1, offset=0
    const page1 = await app.inject({
      method: "GET",
      url: "/api/v1/bites/feed?limit=1&offset=0",
      headers: { cookie: userBCookie },
    });
    expect(page1.json().items).toHaveLength(1);
    expect(page1.json().items[0].id).toBe(b2Id); // newest published first

    // Query with limit=1, offset=1
    const page2 = await app.inject({
      method: "GET",
      url: "/api/v1/bites/feed?limit=1&offset=1",
      headers: { cookie: userBCookie },
    });
    expect(page2.json().items).toHaveLength(1);
    expect(page2.json().items[0].id).toBe(biteId);
  });
});
