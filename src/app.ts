import Fastify, { type FastifyInstance, type FastifyRequest } from "fastify";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import { fromNodeHeaders } from "better-auth/node";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { join } from "node:path";
import type { Readable } from "node:stream";
import { createHash, randomUUID } from "node:crypto";
import type { AppConfig } from "./config.js";
import type { NetraDatabase } from "./db/client.js";
import type { AuthEmail } from "./email.js";
import {
  businessMemberships,
  businessProfiles,
  businessVerificationRequests,
  businessVerificationReviews,
  consumerProfiles,
  creatorProfiles,
  events,
  onboardingProgress,
  profileMemberships,
  profiles,
  sessions,
  mediaAssets,
  users,
  bites,
  biteInteractions,
  biteComments,
} from "./db/schema.js";
import type { createAuth } from "./auth.js";
import type { MediaStorage } from "./media-storage.js";
import { sniffMediaType, validateMediaFile, type MediaPurpose } from "./media-validation.js";

type Auth = ReturnType<typeof createAuth>;
type ProfileType = "consumer" | "creator" | "business";
type SessionData = NonNullable<Awaited<ReturnType<Auth["api"]["getSession"]>>>;

interface AppDependencies {
  config: AppConfig;
  db: NetraDatabase;
  auth: Auth;
  sendEmail: (message: AuthEmail) => Promise<void>;
  mediaStorage: MediaStorage;
  staticRoot?: string;
}

async function getSession(request: FastifyRequest, auth: Auth): Promise<SessionData | null> {
  return await auth.api.getSession({ headers: fromNodeHeaders(request.headers) }) as SessionData | null;
}

function profilePermissions(type: ProfileType): string[] {
  if (type === "consumer") return ["account:read", "consumer:read", "consumer:interact"];
  if (type === "creator") return ["account:read", "consumer:read", "creator:manage", "content:create", "cfund:participate"];
  return ["account:read", "consumer:read", "business:manage", "content:create", "cfund:manage"];
}

export function createApp({ config, db, auth, sendEmail, mediaStorage, staticRoot = join(process.cwd(), "outputs") }: AppDependencies): FastifyInstance {
  const app = Fastify({
    logger: {
      level: config.nodeEnv === "test" ? "silent" : "info",
      redact: {
        paths: ["req.headers.cookie", "req.headers.authorization", "res.headers.set-cookie"],
        censor: "[REDACTED]",
      },
    },
    bodyLimit: 2 * 1024 * 1024,
    requestIdHeader: "x-request-id",
    genReqId: () => crypto.randomUUID(),
    trustProxy: false,
    ajv: { customOptions: { removeAdditional: false } },
  });
  app.addContentTypeParser(
    ["application/octet-stream", "image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "video/quicktime"],
    (_request, payload, done) => done(null, payload),
  );

  app.register(fastifyHelmet, {
    // The approved static UI contains inline styles and loads Google Fonts.
    // Keep Helmet's other headers while avoiding a CSP that would alter it.
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  });
  app.register(fastifyRateLimit, { max: 240, timeWindow: "1 minute", allowList: (request) => !request.url.startsWith("/api/") });

  app.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error, requestId: request.id }, "Request failed");
    const typedError = error as Error & { statusCode?: number };
    const status = typedError.statusCode && typedError.statusCode >= 400 && typedError.statusCode < 600 ? typedError.statusCode : 500;
    const message = status >= 500 ? "The request could not be completed." : typedError.message;
    return reply.status(status).send({
      error: { code: status === 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR", message, requestId: request.id },
    });
  });

  app.route({
    method: ["GET", "POST"],
    url: "/api/auth/*",
    async handler(request, reply) {
      const url = new URL(request.raw.url ?? request.url, config.appUrl);
      const headers = fromNodeHeaders(request.headers);
      const body = request.body === undefined ? undefined : JSON.stringify(request.body);
      const authRequest = new Request(url, { method: request.method, headers, body });
      const response = await auth.handler(authRequest);
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() !== "set-cookie") reply.header(key, value);
      });
      const cookies = response.headers.getSetCookie?.() ?? [];
      if (cookies.length) reply.header("set-cookie", cookies);
      const responseBody = response.body ? await response.text() : null;
      return reply.status(response.status).send(responseBody);
    },
  });

  app.get("/api/health", async () => ({ status: "ok", service: "netra-api" }));
  app.get("/api/health/ready", async (_request, reply) => {
    try {
      await db.execute(sql`select 1`);
      return { status: "ready", database: "connected" };
    } catch (error) {
      app.log.error({ err: error }, "Readiness check failed");
      return reply.status(503).send({ status: "not_ready", database: "unavailable" });
    }
  });

  app.get("/api/v1/me", async (request, reply) => {
    const authSession = await getSession(request, auth);
    if (!authSession) return reply.status(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in to continue." } });

    const userId = authSession.user.id;
    const [user] = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      emailVerified: users.emailVerified,
      username: users.username,
      image: users.image,
      createdAt: users.createdAt,
    }).from(users).where(eq(users.id, userId)).limit(1);
    if (!user) return reply.status(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in to continue." } });

    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    const memberships = await db.select({ profileType: profileMemberships.profileType })
      .from(profileMemberships).where(eq(profileMemberships.userId, userId));
    const activeProfile = ((authSession.session as typeof authSession.session & { activeProfile?: ProfileType }).activeProfile ?? "consumer") as ProfileType;
    const [consumer] = await db.select().from(consumerProfiles).where(eq(consumerProfiles.userId, userId)).limit(1);
    const [creator] = activeProfile === "creator"
      ? await db.select({ onboardingStep: creatorProfiles.onboardingStep, onboardingData: creatorProfiles.onboardingData })
          .from(creatorProfiles).where(eq(creatorProfiles.userId, userId)).limit(1)
      : [];
    const [business] = activeProfile === "business"
      ? await db.select({ businessName: businessProfiles.businessName, handle: businessProfiles.handle, discipline: businessProfiles.discipline, origin: businessProfiles.origin, manifesto: businessProfiles.manifesto, onboardingStep: businessProfiles.onboardingStep, verificationStatus: businessProfiles.verificationStatus })
          .from(businessProfiles).where(eq(businessProfiles.userId, userId)).limit(1)
      : [];
    const [progress] = await db.select({ currentStep: onboardingProgress.currentStep, data: onboardingProgress.data, completedAt: onboardingProgress.completedAt })
      .from(onboardingProgress)
      .where(and(eq(onboardingProgress.userId, userId), eq(onboardingProgress.profileType, activeProfile)))
      .limit(1);
    const activatedProfiles = memberships.map((row) => row.profileType);
    return {
      user,
      profile,
      consumer,
      activatedProfiles,
      activeProfile,
      permissions: profilePermissions(activeProfile),
      profileSetup: activeProfile === "consumer"
        ? { ...(profile ?? {}), ...(progress ?? {}) }
        : { ...(creator ?? business ?? {}), ...(progress ?? {}) },
    };
  });

  app.put<{ Body: {
    interests?: string[];
    contentPreferences?: string[];
    activeIntent?: string;
    discoveryMode?: string;
    buyingCapacity?: string;
    radar?: string;
  } }>("/api/v1/me/preferences", {
    schema: {
      body: {
        type: "object",
        additionalProperties: false,
        properties: {
          interests: { type: "array", maxItems: 40, items: { type: "string", minLength: 1, maxLength: 80 } },
          contentPreferences: { type: "array", maxItems: 40, items: { type: "string", minLength: 1, maxLength: 80 } },
          activeIntent: { type: "string", maxLength: 200 },
          discoveryMode: { type: "string", maxLength: 80 },
          buyingCapacity: { type: "string", maxLength: 80 },
          radar: { type: "string", maxLength: 500 },
        },
      },
    },
  }, async (request, reply) => {
    const authSession = await getSession(request, auth);
    if (!authSession) return reply.status(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in to continue." } });
    const activeProfile = ((authSession.session as typeof authSession.session & { activeProfile?: ProfileType }).activeProfile ?? "consumer") as ProfileType;
    if (activeProfile !== "consumer") return reply.status(403).send({ error: { code: "PROFILE_CONTEXT_REQUIRED", message: "Consumer preferences can only be changed in the Consumer profile." } });
    const patch = Object.fromEntries(Object.entries(request.body).filter(([, value]) => value !== undefined)) as typeof request.body;
    if (patch.interests) patch.interests = [...new Set(patch.interests.map((item) => item.trim()))];
    if (patch.contentPreferences) patch.contentPreferences = [...new Set(patch.contentPreferences.map((item) => item.trim()))];
    if (!Object.keys(patch).length) return reply.status(400).send({ error: { code: "EMPTY_UPDATE", message: "Provide at least one preference to update." } });
    await db.insert(consumerProfiles).values({ userId: authSession.user.id }).onConflictDoNothing();
    await db.update(consumerProfiles).set({ ...patch, updatedAt: new Date() }).where(eq(consumerProfiles.userId, authSession.user.id));
    return reply.send({ ok: true });
  });

  app.patch<{ Body: { step: string; data: Record<string, unknown> } }>("/api/v1/me/onboarding", {
    schema: {
      body: {
        type: "object",
        additionalProperties: false,
        required: ["step", "data"],
        properties: {
          step: { type: "string", minLength: 1, maxLength: 80 },
          data: { type: "object", maxProperties: 80 },
        },
      },
    },
  }, async (request, reply) => {
    const authSession = await getSession(request, auth);
    if (!authSession) return reply.status(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in to continue." } });
    const activeProfile = ((authSession.session as typeof authSession.session & { activeProfile?: ProfileType }).activeProfile ?? "consumer") as ProfileType;
    const userId = authSession.user.id;
    const now = new Date();
    await db.insert(onboardingProgress).values({ userId, profileType: activeProfile, currentStep: request.body.step, data: request.body.data, updatedAt: now })
      .onConflictDoUpdate({ target: [onboardingProgress.userId, onboardingProgress.profileType], set: { currentStep: request.body.step, data: request.body.data, updatedAt: now } });
    if (activeProfile === "consumer") {
      await db.update(profiles).set({ onboardingStep: request.body.step, updatedAt: now }).where(eq(profiles.userId, userId));
    } else if (activeProfile === "creator") {
      await db.update(creatorProfiles).set({ onboardingStep: request.body.step, onboardingData: request.body.data, updatedAt: now }).where(eq(creatorProfiles.userId, userId));
    } else {
      const data = request.body.data;
      await db.update(businessProfiles).set({
        onboardingStep: request.body.step,
        onboardingData: data,
        businessName: typeof data.businessName === "string" ? data.businessName.trim().slice(0, 120) : undefined,
        handle: typeof data.handle === "string" ? data.handle.trim().replace(/^@/, "").toLowerCase().slice(0, 40) : undefined,
        discipline: typeof data.discipline === "string" ? data.discipline.trim().slice(0, 100) : undefined,
        origin: typeof data.origin === "string" ? data.origin.trim().slice(0, 280) : undefined,
        manifesto: typeof data.manifesto === "string" ? data.manifesto.trim().slice(0, 300) : undefined,
        updatedAt: now,
      }).where(eq(businessProfiles.userId, userId));
    }
    return reply.send({ ok: true, step: request.body.step });
  });

  app.post("/api/v1/me/onboarding/complete", async (request, reply) => {
    const authSession = await getSession(request, auth);
    if (!authSession) return reply.status(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in to continue." } });
    const activeProfile = ((authSession.session as typeof authSession.session & { activeProfile?: ProfileType }).activeProfile ?? "consumer") as ProfileType;
    const userId = authSession.user.id;
    const now = new Date();
    await db.transaction(async (tx) => {
      await tx.update(onboardingProgress).set({ completedAt: now, updatedAt: now })
        .where(and(eq(onboardingProgress.userId, userId), eq(onboardingProgress.profileType, activeProfile)));
      if (activeProfile === "consumer") {
        await tx.update(profiles).set({ onboardingComplete: true, onboardingStep: "complete", updatedAt: now }).where(eq(profiles.userId, userId));
      } else if (activeProfile === "creator") {
        await tx.update(creatorProfiles).set({ onboardingStep: "complete", updatedAt: now }).where(eq(creatorProfiles.userId, userId));
      } else {
        await tx.update(businessProfiles).set({ onboardingStep: "complete", updatedAt: now }).where(eq(businessProfiles.userId, userId));
      }
      await tx.insert(events).values({ actorUserId: userId, eventType: "ONBOARDING_COMPLETED", targetType: "profile", targetId: activeProfile });
    });
    return reply.send({ ok: true, activeProfile });
  });

  app.patch<{ Body: { name?: string; username?: string; about?: string; avatarMediaId?: string } }>("/api/v1/me/profile", {
    schema: {
      body: {
        type: "object",
        additionalProperties: false,
        minProperties: 1,
        properties: {
          name: { type: "string", minLength: 1, maxLength: 80 },
          username: { type: "string", minLength: 3, maxLength: 30, pattern: "^[A-Za-z0-9_@]+$" },
          about: { type: "string", maxLength: 160 },
          avatarMediaId: { type: "string", format: "uuid" },
        },
      },
    },
  }, async (request, reply) => {
    const authSession = await getSession(request, auth);
    if (!authSession) return reply.status(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in to continue." } });
    const userId = authSession.user.id;
    const body = request.body;
    try {
      await db.transaction(async (tx) => {
        const userUpdate: Partial<typeof users.$inferInsert> = { updatedAt: new Date() };
        if (body.name !== undefined) userUpdate.name = body.name.trim();
        if (body.username !== undefined) {
          userUpdate.username = body.username.trim().replace(/^@/, "").toLowerCase();
          if (!/^[a-z0-9_]{3,30}$/.test(userUpdate.username)) throw Object.assign(new Error("Username must be 3–30 letters, numbers, or underscores."), { statusCode: 400 });
        }
        if (body.avatarMediaId !== undefined) {
          const [asset] = await tx.select().from(mediaAssets).where(and(
            eq(mediaAssets.id, body.avatarMediaId), eq(mediaAssets.userId, userId),
            eq(mediaAssets.purpose, "profile_avatar"), eq(mediaAssets.status, "READY"),
          )).limit(1);
          if (!asset) throw Object.assign(new Error("Choose a completed profile photo upload."), { statusCode: 400 });
          userUpdate.image = mediaStorage.publicUrl(asset.objectKey, asset.id);
        }
        if (body.name !== undefined || body.username !== undefined || body.avatarMediaId !== undefined) {
          await tx.update(users).set(userUpdate).where(eq(users.id, userId));
        }
        if (body.about !== undefined) {
          await tx.update(profiles).set({ about: body.about.trim(), updatedAt: new Date() }).where(eq(profiles.userId, userId));
        }
      });
    } catch (error) {
      if ((error as { code?: string }).code === "23505") {
        return reply.status(409).send({ error: { code: "USERNAME_TAKEN", message: "That username is already in use." } });
      }
      throw error;
    }
    return reply.send({ ok: true });
  });

  app.post<{ Params: { profileType: "creator" | "business" } }>("/api/v1/me/profiles/:profileType/activate", {
    schema: { params: { type: "object", required: ["profileType"], properties: { profileType: { type: "string", enum: ["creator", "business"] } } } },
  }, async (request, reply) => {
    const authSession = await getSession(request, auth);
    if (!authSession) return reply.status(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in to continue." } });
    const userId = authSession.user.id;
    const profileType = request.params.profileType as ProfileType;

    await db.transaction(async (tx) => {
      await tx.insert(profileMemberships).values({ userId, profileType }).onConflictDoNothing();
      if (profileType === "creator") {
        await tx.insert(creatorProfiles).values({ userId }).onConflictDoNothing();
      } else {
        await tx.insert(businessProfiles).values({ userId }).onConflictDoNothing();
        await tx.insert(businessMemberships).values({ businessUserId: userId, userId, membershipRole: "owner" }).onConflictDoNothing();
      }
      await tx.update(sessions).set({ activeProfile: profileType, updatedAt: new Date() }).where(eq(sessions.id, authSession.session.id));
      await tx.insert(events).values({ actorUserId: userId, eventType: "PROFILE_ACTIVATED", targetType: "profile", targetId: profileType });
    });

    return reply.send({ ok: true, activeProfile: profileType, permissions: profilePermissions(profileType) });
  });

  app.put<{ Body: { profileType: ProfileType } }>("/api/v1/me/active-profile", {
    schema: {
      body: {
        type: "object",
        additionalProperties: false,
        required: ["profileType"],
        properties: { profileType: { type: "string", enum: ["consumer", "creator", "business"] } },
      },
    },
  }, async (request, reply) => {
    const authSession = await getSession(request, auth);
    if (!authSession) return reply.status(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in to continue." } });
    const membership = await db.select({ profileType: profileMemberships.profileType })
      .from(profileMemberships)
      .where(and(eq(profileMemberships.userId, authSession.user.id), eq(profileMemberships.profileType, request.body.profileType)))
      .limit(1);
    if (!membership.length) return reply.status(403).send({ error: { code: "PROFILE_NOT_ACTIVE", message: "Activate this profile before switching to it." } });
    await db.update(sessions)
      .set({ activeProfile: request.body.profileType, updatedAt: new Date() })
      .where(eq(sessions.id, authSession.session.id));
    return reply.send({ activeProfile: request.body.profileType, permissions: profilePermissions(request.body.profileType) });
  });

  app.post<{ Body: { businessEmail: string; businessWebsite?: string; registrationId?: string } }>("/api/v1/business/verification-requests", {
    schema: {
      body: {
        type: "object",
        additionalProperties: false,
        required: ["businessEmail"],
        properties: {
          businessEmail: { type: "string", format: "email", maxLength: 254 },
          businessWebsite: { type: "string", format: "uri", maxLength: 2048 },
          registrationId: { type: "string", minLength: 3, maxLength: 120 },
        },
      },
    },
  }, async (request, reply) => {
    const authSession = await getSession(request, auth);
    if (!authSession) return reply.status(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in to continue." } });
    const activeProfile = ((authSession.session as typeof authSession.session & { activeProfile?: ProfileType }).activeProfile ?? "consumer") as ProfileType;
    if (activeProfile !== "business") return reply.status(403).send({ error: { code: "PROFILE_CONTEXT_REQUIRED", message: "Switch to your Brand/Business profile before requesting verification." } });
    const existingRequest = await db.select({ id: businessVerificationRequests.id })
      .from(businessVerificationRequests)
      .where(and(eq(businessVerificationRequests.businessUserId, authSession.user.id), eq(businessVerificationRequests.status, "PENDING")))
      .limit(1);
    if (existingRequest.length) return reply.status(409).send({ error: { code: "VERIFICATION_PENDING", message: "A verification request is already being reviewed." } });

    let verificationRequest: typeof businessVerificationRequests.$inferSelect;
    try {
      verificationRequest = await db.transaction(async (tx) => {
        const [created] = await tx.insert(businessVerificationRequests).values({
          businessUserId: authSession.user.id,
          businessEmail: request.body.businessEmail.trim().toLowerCase(),
          businessWebsite: request.body.businessWebsite?.trim() || null,
          registrationId: request.body.registrationId?.trim() || null,
          emailStatus: "QUEUED",
        }).returning();
        if (!created) throw new Error("Could not create the verification request.");
        await tx.update(businessProfiles).set({ verificationStatus: "PENDING", updatedAt: new Date() })
          .where(eq(businessProfiles.userId, authSession.user.id));
        await tx.insert(businessVerificationReviews).values({
          requestId: created.id,
          previousStatus: "UNVERIFIED",
          nextStatus: "PENDING",
          source: "business_request",
          reason: "Business submitted a verification request.",
        });
        await tx.insert(events).values({ actorUserId: authSession.user.id, eventType: "BUSINESS_VERIFICATION_REQUESTED", targetType: "business_verification_request", targetId: created.id });
        return created;
      });
    } catch (error) {
      if ((error as { code?: string }).code === "23505") {
        return reply.status(409).send({ error: { code: "VERIFICATION_PENDING", message: "A verification request is already being reviewed." } });
      }
      throw error;
    }

    let emailStatus = config.emailMode === "console" ? "CONSOLE_ONLY" : "SENT";
    try {
      await sendEmail({
        to: verificationRequest.businessEmail,
        subject: "NETRA received your business verification request",
        url: config.appUrl,
        text: "NETRA received your business verification request. The request is pending review; only NETRA can change its verification status.",
      });
    } catch (error) {
      emailStatus = "FAILED";
      request.log.error({ err: error, requestId: request.id }, "Business verification email failed");
    }
    await db.update(businessVerificationRequests).set({ emailStatus }).where(eq(businessVerificationRequests.id, verificationRequest.id));
    return reply.status(201).send({
      id: verificationRequest.id,
      status: "PENDING",
      emailStatus,
      message: emailStatus === "FAILED" ? "Your request was saved, but the confirmation email could not be sent." : emailStatus === "CONSOLE_ONLY" ? "Your request was saved. Email delivery is disabled in this development environment." : "Your request was submitted and a confirmation email was sent.",
    });
  });

  const mediaPurposes: MediaPurpose[] = ["profile_avatar", "brand_logo", "brand_story", "bite", "story", "product", "creator_portfolio", "private_test_seed"];
  const mediaUrl = (id: string) => new URL(`/api/v1/media/${id}/content`, config.appUrl).toString();

  app.post<{ Body: { fileName: string; contentType: string; byteSize: number; purpose: MediaPurpose } }>("/api/v1/media/upload-intents", {
    schema: {
      body: {
        type: "object", additionalProperties: false, required: ["fileName", "contentType", "byteSize", "purpose"],
        properties: {
          fileName: { type: "string", minLength: 1, maxLength: 180 },
          contentType: { type: "string", minLength: 1, maxLength: 100 },
          byteSize: { type: "integer", minimum: 1, maximum: config.mediaMaxBytes },
          purpose: { type: "string", enum: mediaPurposes },
        },
      },
    },
  }, async (request, reply) => {
    const authSession = await getSession(request, auth);
    if (!authSession) return reply.status(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in to upload media." } });
    const userId = authSession.user.id;
    const purpose = request.body.purpose;
    const activeProfile = ((authSession.session as typeof authSession.session & { activeProfile?: ProfileType }).activeProfile ?? "consumer") as ProfileType;
    if (["brand_logo", "brand_story", "product"].includes(purpose) && activeProfile !== "business") {
      return reply.status(403).send({ error: { code: "PROFILE_CONTEXT_REQUIRED", message: "Switch to your Business profile to upload this media." } });
    }
    if (purpose === "creator_portfolio" && activeProfile !== "creator") {
      return reply.status(403).send({ error: { code: "PROFILE_CONTEXT_REQUIRED", message: "Switch to your Creator profile to upload this media." } });
    }
    if (["bite", "story"].includes(purpose) && !["creator", "business"].includes(activeProfile)) {
      return reply.status(403).send({ error: { code: "PROFILE_CONTEXT_REQUIRED", message: "Only Creator and Business profiles can upload public content." } });
    }
    if (purpose === "private_test_seed" && !config.mediaAdminUserIds.includes(userId)) {
      return reply.status(403).send({ error: { code: "ADMIN_REQUIRED", message: "Private test library uploads are restricted to NETRA admins." } });
    }
    const maxBytes = Math.min(config.mediaMaxBytes, purpose === "profile_avatar" || purpose === "brand_logo" || purpose === "product" ? 20 * 1024 * 1024 : 500 * 1024 * 1024);
    const validationError = validateMediaFile(request.body.fileName, request.body.contentType, request.body.byteSize, purpose, maxBytes);
    if (validationError) return reply.status(400).send({ error: { code: "INVALID_MEDIA", message: validationError } });

    const id = randomUUID();
    const extension = request.body.fileName.slice(request.body.fileName.lastIndexOf(".")).toLowerCase();
    const objectKey = `${createHash("sha256").update(userId).digest("hex").slice(0, 20)}/${id}${extension}`;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const uploadUrl = await mediaStorage.createUploadUrl(id, objectKey, request.body.contentType.toLowerCase(), expiresAt);
    const visibility = purpose === "profile_avatar" || purpose === "brand_logo" ? "PUBLIC" : purpose === "private_test_seed" ? "PRIVATE_TEST" : "PRIVATE";
    await db.insert(mediaAssets).values({
      id, userId, purpose, status: "PENDING", visibility, storageProvider: mediaStorage.provider,
      objectKey, originalName: request.body.fileName, contentType: request.body.contentType.toLowerCase(),
      byteSize: request.body.byteSize, expiresAt,
    });
    return reply.status(201).send({
      id, uploadUrl, uploadMethod: "PUT", uploadHeaders: { "Content-Type": request.body.contentType.toLowerCase() },
      expiresAt: expiresAt.toISOString(), status: "PENDING",
    });
  });

  app.put<{ Params: { id: string }; Querystring: { expires: string; signature: string } }>("/api/v1/media/local/:id", {
    schema: {
      params: { type: "object", required: ["id"], properties: { id: { type: "string", format: "uuid" } } },
      querystring: { type: "object", required: ["expires", "signature"], properties: { expires: { type: "string", pattern: "^[0-9]{10}$" }, signature: { type: "string", pattern: "^[a-f0-9]{64}$" } } },
    },
    bodyLimit: config.mediaMaxBytes,
  }, async (request, reply) => {
    if (!mediaStorage.storeLocalUpload || !mediaStorage.localSignatureValid) return reply.status(404).send({ error: { code: "NOT_FOUND", message: "Upload route not found." } });
    const expiresAt = Number(request.query.expires);
    if (expiresAt < Math.floor(Date.now() / 1000) || expiresAt > Math.floor(Date.now() / 1000) + 600 || !mediaStorage.localSignatureValid(request.params.id, expiresAt, request.query.signature)) {
      return reply.status(403).send({ error: { code: "UPLOAD_URL_EXPIRED", message: "This upload link has expired. Start the upload again." } });
    }
    const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, request.params.id)).limit(1);
    if (!asset || asset.status !== "PENDING" || asset.storageProvider !== "local" || asset.expiresAt.getTime() < Date.now()) {
      return reply.status(404).send({ error: { code: "UPLOAD_INTENT_NOT_FOUND", message: "This upload is no longer available." } });
    }
    const contentType = String(request.headers["content-type"] ?? "").split(";")[0].trim().toLowerCase();
    const contentLength = request.headers["content-length"] === undefined ? undefined : Number(request.headers["content-length"]);
    if (contentType !== asset.contentType || (contentLength !== undefined && contentLength !== asset.byteSize)) {
      return reply.status(400).send({ error: { code: "UPLOAD_METADATA_MISMATCH", message: "The file size or format changed. Choose the file again." } });
    }
    const inspection = await mediaStorage.storeLocalUpload(asset.objectKey, request.body as Readable, Math.min(asset.byteSize, config.mediaMaxBytes));
    if (inspection.byteSize !== asset.byteSize || sniffMediaType(inspection.prefix) !== asset.contentType) {
      await mediaStorage.deleteObject(asset.objectKey);
      return reply.status(400).send({ error: { code: "MEDIA_CONTENT_MISMATCH", message: "The uploaded file contents do not match the selected file type or size." } });
    }
    return reply.status(204).send();
  });

  app.post<{ Params: { id: string } }>("/api/v1/media/:id/complete", {
    schema: { params: { type: "object", required: ["id"], properties: { id: { type: "string", format: "uuid" } } } },
  }, async (request, reply) => {
    const authSession = await getSession(request, auth);
    if (!authSession) return reply.status(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in to complete this upload." } });
    const [asset] = await db.select().from(mediaAssets).where(and(eq(mediaAssets.id, request.params.id), eq(mediaAssets.userId, authSession.user.id))).limit(1);
    if (!asset) return reply.status(404).send({ error: { code: "MEDIA_NOT_FOUND", message: "This upload does not exist." } });
    if (asset.status === "READY") return reply.send({ id: asset.id, status: asset.status, url: mediaUrl(asset.id), purpose: asset.purpose });
    if (asset.status !== "PENDING" || asset.expiresAt.getTime() < Date.now()) return reply.status(409).send({ error: { code: "UPLOAD_INTENT_EXPIRED", message: "Start the upload again; this upload link expired." } });

    const stored = await mediaStorage.inspect(asset.objectKey);
    if (!stored) return reply.status(400).send({ error: { code: "UPLOAD_NOT_FOUND", message: "Upload the file before completing it." } });
    const actualType = stored.contentType || sniffMediaType(stored.prefix) || "";
    if (stored.byteSize !== asset.byteSize || actualType !== asset.contentType || sniffMediaType(stored.prefix) !== asset.contentType) {
      await mediaStorage.deleteObject(asset.objectKey);
      await db.update(mediaAssets).set({ status: "REJECTED", updatedAt: new Date() }).where(eq(mediaAssets.id, asset.id));
      return reply.status(400).send({ error: { code: "MEDIA_CONTENT_MISMATCH", message: "The uploaded file failed its size or content checks." } });
    }
    const now = new Date();
    const completed = await db.update(mediaAssets).set({ status: "READY", completedAt: now, updatedAt: now })
      .where(and(eq(mediaAssets.id, asset.id), eq(mediaAssets.userId, authSession.user.id), eq(mediaAssets.status, "PENDING")))
      .returning({ id: mediaAssets.id });
    if (completed.length) await db.insert(events).values({ actorUserId: authSession.user.id, eventType: "MEDIA_UPLOAD_COMPLETED", targetType: "media_asset", targetId: asset.id, requestId: request.id, metadata: { purpose: asset.purpose, byteSize: asset.byteSize, contentType: asset.contentType } });
    return reply.status(201).send({ id: asset.id, status: "READY", purpose: asset.purpose, url: mediaUrl(asset.id) });
  });

  app.get<{ Params: { id: string } }>("/api/v1/media/:id/content", {
    schema: { params: { type: "object", required: ["id"], properties: { id: { type: "string", format: "uuid" } } } },
  }, async (request, reply) => {
    const [asset] = await db.select().from(mediaAssets).where(and(eq(mediaAssets.id, request.params.id), eq(mediaAssets.status, "READY"))).limit(1);
    if (!asset) return reply.status(404).send({ error: { code: "MEDIA_NOT_FOUND", message: "Media not found." } });
    if (asset.visibility !== "PUBLIC") {
      const authSession = await getSession(request, auth);
      if (!authSession || (authSession.user.id !== asset.userId && !(asset.visibility === "PRIVATE_TEST" && config.mediaAdminUserIds.includes(authSession.user.id)))) {
        return reply.status(404).send({ error: { code: "MEDIA_NOT_FOUND", message: "Media not found." } });
      }
    }
    reply.header("X-Content-Type-Options", "nosniff").header("Cache-Control", asset.visibility === "PUBLIC" ? "public, max-age=86400" : "private, no-store");
    if (mediaStorage.provider === "s3") {
      return reply.redirect(await mediaStorage.createReadUrl(asset.objectKey, new Date(Date.now() + 5 * 60_000), asset.visibility === "PUBLIC"));
    }
    if (!mediaStorage.openLocalObject) return reply.status(503).send({ error: { code: "MEDIA_STORAGE_UNAVAILABLE", message: "Media storage is unavailable." } });
    reply.header("Content-Type", asset.contentType).header("Content-Length", String(asset.byteSize));
    return reply.send(mediaStorage.openLocalObject(asset.objectKey));
  });

  app.post<{ Body: { title?: string; description?: string; mediaAssetId?: string } }>("/api/v1/bites", {
    schema: {
      body: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string", maxLength: 200 },
          description: { type: "string", maxLength: 1000 },
          mediaAssetId: { type: "string", format: "uuid" },
        },
      }
    }
  }, async (request, reply) => {
    const authSession = await getSession(request, auth);
    if (!authSession) return reply.status(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in to continue." } });
    
    const [bite] = await db.insert(bites).values({
      creatorUserId: authSession.user.id,
      title: request.body.title?.trim() || "",
      description: request.body.description?.trim() || "",
      mediaAssetId: request.body.mediaAssetId || null,
      status: "DRAFT"
    }).returning();
    
    return reply.status(201).send(bite);
  });

  app.patch<{ Params: { id: string }; Body: { title?: string; description?: string; mediaAssetId?: string } }>("/api/v1/bites/:id", {
    schema: {
      params: { type: "object", required: ["id"], properties: { id: { type: "string", format: "uuid" } } },
      body: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string", maxLength: 200 },
          description: { type: "string", maxLength: 1000 },
          mediaAssetId: { type: "string", format: "uuid" },
        },
      }
    }
  }, async (request, reply) => {
    const authSession = await getSession(request, auth);
    if (!authSession) return reply.status(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in to continue." } });
    
    const [existing] = await db.select().from(bites).where(eq(bites.id, request.params.id)).limit(1);
    if (!existing) return reply.status(404).send({ error: { code: "NOT_FOUND", message: "Bite not found." } });
    if (existing.creatorUserId !== authSession.user.id) return reply.status(403).send({ error: { code: "FORBIDDEN", message: "You can only edit your own bites." } });
    
    const updateData: Partial<typeof bites.$inferInsert> = { updatedAt: new Date() };
    if (request.body.title !== undefined) updateData.title = request.body.title.trim();
    if (request.body.description !== undefined) updateData.description = request.body.description.trim();
    
    if (request.body.mediaAssetId) {
      const [asset] = await db.select().from(mediaAssets).where(and(
        eq(mediaAssets.id, request.body.mediaAssetId),
        eq(mediaAssets.userId, authSession.user.id),
        eq(mediaAssets.status, "READY")
      )).limit(1);
      if (!asset) return reply.status(400).send({ error: { code: "INVALID_MEDIA", message: "Valid ready media asset required." } });
      updateData.mediaAssetId = asset.id;
    }
    
    const [updated] = await db.update(bites).set(updateData).where(eq(bites.id, request.params.id)).returning();
    return reply.send(updated);
  });

  app.post<{ Params: { id: string } }>("/api/v1/bites/:id/publish", {
    schema: { params: { type: "object", required: ["id"], properties: { id: { type: "string", format: "uuid" } } } }
  }, async (request, reply) => {
    const authSession = await getSession(request, auth);
    if (!authSession) return reply.status(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in to continue." } });
    
    const [existing] = await db.select().from(bites).where(eq(bites.id, request.params.id)).limit(1);
    if (!existing) return reply.status(404).send({ error: { code: "NOT_FOUND", message: "Bite not found." } });
    if (existing.creatorUserId !== authSession.user.id) return reply.status(403).send({ error: { code: "FORBIDDEN", message: "You can only publish your own bites." } });
    if (existing.status === "PUBLISHED") return reply.status(409).send({ error: { code: "ALREADY_PUBLISHED", message: "Bite is already published." } });
    if (!existing.mediaAssetId) return reply.status(400).send({ error: { code: "MEDIA_REQUIRED", message: "A media asset is required to publish." } });
    
    const now = new Date();
    const [published] = await db.update(bites).set({ status: "PUBLISHED", publishedAt: now, updatedAt: now }).where(eq(bites.id, request.params.id)).returning();
    return reply.send(published);
  });

  app.get<{ Querystring: { limit?: number; offset?: number } }>("/api/v1/bites/feed", {
    schema: {
      querystring: {
        type: "object",
        properties: {
          limit: { type: "integer", minimum: 1, maximum: 20, default: 10 },
          offset: { type: "integer", minimum: 0, default: 0 },
        },
      }
    }
  }, async (request, reply) => {
    const authSession = await getSession(request, auth);
    const limit = request.query.limit || 10;
    const offset = request.query.offset || 0;
    
    const feed = await db.select({
      id: bites.id,
      title: bites.title,
      description: bites.description,
      mediaAssetId: bites.mediaAssetId,
      publishedAt: bites.publishedAt,
      creator: {
        id: users.id,
        name: users.name,
        username: users.username,
        image: users.image
      }
    }).from(bites)
      .innerJoin(users, eq(bites.creatorUserId, users.id))
      .where(eq(bites.status, "PUBLISHED"))
      .orderBy(desc(bites.publishedAt))
      .limit(limit)
      .offset(offset);
      
    const biteIds = feed.map(b => b.id);
    
    let userInteractions: Record<string, string[]> = {};
    let interactionCounts: Record<string, { likes: number; saves: number; views: number }> = {};
    let commentCounts: Record<string, number> = {};
    
    if (biteIds.length > 0) {
      const counts = await db.select({
        biteId: biteInteractions.biteId,
        interactionType: biteInteractions.interactionType,
        count: sql<number>`count(*)::int`
      }).from(biteInteractions)
        .where(inArray(biteInteractions.biteId, biteIds))
        .groupBy(biteInteractions.biteId, biteInteractions.interactionType);
        
      for (const row of counts) {
        if (!interactionCounts[row.biteId]) interactionCounts[row.biteId] = { likes: 0, saves: 0, views: 0 };
        if (row.interactionType === 'LIKE') interactionCounts[row.biteId].likes = row.count;
        if (row.interactionType === 'SAVE') interactionCounts[row.biteId].saves = row.count;
        if (row.interactionType === 'VIEW') interactionCounts[row.biteId].views = row.count;
      }
      
      const cCounts = await db.select({
        biteId: biteComments.biteId,
        count: sql<number>`count(*)::int`
      }).from(biteComments)
        .where(inArray(biteComments.biteId, biteIds))
        .groupBy(biteComments.biteId);
        
      for (const row of cCounts) {
        commentCounts[row.biteId] = row.count;
      }
      
      if (authSession) {
        const userInts = await db.select({
          biteId: biteInteractions.biteId,
          interactionType: biteInteractions.interactionType
        }).from(biteInteractions)
          .where(and(
            eq(biteInteractions.userId, authSession.user.id),
            inArray(biteInteractions.biteId, biteIds),
            inArray(biteInteractions.interactionType, ["LIKE", "SAVE"])
          ));
        for (const row of userInts) {
          if (!userInteractions[row.biteId]) userInteractions[row.biteId] = [];
          userInteractions[row.biteId].push(row.interactionType);
        }
      }
    }
    
    const results = feed.map(b => ({
      ...b,
      mediaUrl: b.mediaAssetId ? mediaUrl(b.mediaAssetId) : null,
      likeCount: interactionCounts[b.id]?.likes || 0,
      saveCount: interactionCounts[b.id]?.saves || 0,
      viewCount: interactionCounts[b.id]?.views || 0,
      commentCount: commentCounts[b.id] || 0,
      hasLiked: userInteractions[b.id]?.includes("LIKE") || false,
      hasSaved: userInteractions[b.id]?.includes("SAVE") || false,
    }));
    
    return reply.send({ items: results });
  });

  app.post<{ Params: { id: string }; Body: { type: "LIKE" | "SAVE" | "VIEW" } }>("/api/v1/bites/:id/interactions", {
    schema: {
      params: { type: "object", required: ["id"], properties: { id: { type: "string", format: "uuid" } } },
      body: { type: "object", required: ["type"], properties: { type: { type: "string", enum: ["LIKE", "SAVE", "VIEW"] } } }
    }
  }, async (request, reply) => {
    const authSession = await getSession(request, auth);
    if (!authSession) return reply.status(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in to continue." } });
    
    const [existing] = await db.select({ id: bites.id }).from(bites).where(eq(bites.id, request.params.id)).limit(1);
    if (!existing) return reply.status(404).send({ error: { code: "NOT_FOUND", message: "Bite not found." } });
    
    if (request.body.type === "VIEW") {
      await db.insert(biteInteractions).values({
        userId: authSession.user.id,
        biteId: request.params.id,
        interactionType: "VIEW"
      });
    } else {
      await db.insert(biteInteractions).values({
        userId: authSession.user.id,
        biteId: request.params.id,
        interactionType: request.body.type
      }).onConflictDoNothing();
    }
    
    return reply.send({ ok: true });
  });

  app.delete<{ Params: { id: string; type: "LIKE" | "SAVE" } }>("/api/v1/bites/:id/interactions/:type", {
    schema: {
      params: { 
        type: "object", 
        required: ["id", "type"], 
        properties: { 
          id: { type: "string", format: "uuid" },
          type: { type: "string", enum: ["LIKE", "SAVE"] }
        } 
      }
    }
  }, async (request, reply) => {
    const authSession = await getSession(request, auth);
    if (!authSession) return reply.status(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in to continue." } });
    
    await db.delete(biteInteractions).where(and(
      eq(biteInteractions.userId, authSession.user.id),
      eq(biteInteractions.biteId, request.params.id),
      eq(biteInteractions.interactionType, request.params.type)
    ));
    
    return reply.send({ ok: true });
  });

  app.post<{ Params: { id: string }; Body: { text: string } }>("/api/v1/bites/:id/comments", {
    schema: {
      params: { type: "object", required: ["id"], properties: { id: { type: "string", format: "uuid" } } },
      body: { type: "object", required: ["text"], properties: { text: { type: "string", minLength: 1, maxLength: 500 } } }
    }
  }, async (request, reply) => {
    const authSession = await getSession(request, auth);
    if (!authSession) return reply.status(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in to continue." } });
    
    const [existing] = await db.select({ id: bites.id }).from(bites).where(eq(bites.id, request.params.id)).limit(1);
    if (!existing) return reply.status(404).send({ error: { code: "NOT_FOUND", message: "Bite not found." } });
    
    const [comment] = await db.insert(biteComments).values({
      userId: authSession.user.id,
      biteId: request.params.id,
      text: request.body.text.trim()
    }).returning();
    
    return reply.status(201).send(comment);
  });

  app.get<{ Params: { id: string }; Querystring: { limit?: number; offset?: number } }>("/api/v1/bites/:id/comments", {
    schema: {
      params: { type: "object", required: ["id"], properties: { id: { type: "string", format: "uuid" } } },
      querystring: {
        type: "object",
        properties: {
          limit: { type: "integer", minimum: 1, maximum: 50, default: 20 },
          offset: { type: "integer", minimum: 0, default: 0 },
        },
      }
    }
  }, async (request, reply) => {
    const limit = request.query.limit || 20;
    const offset = request.query.offset || 0;
    
    const comments = await db.select({
      id: biteComments.id,
      text: biteComments.text,
      createdAt: biteComments.createdAt,
      user: {
        id: users.id,
        name: users.name,
        username: users.username,
        image: users.image
      }
    }).from(biteComments)
      .innerJoin(users, eq(biteComments.userId, users.id))
      .where(eq(biteComments.biteId, request.params.id))
      .orderBy(desc(biteComments.createdAt))
      .limit(limit)
      .offset(offset);
      
    return reply.send({ items: comments });
  });

  app.register(fastifyStatic, { root: staticRoot, prefix: "/", wildcard: true, decorateReply: true });
  app.get("/", async (_request, reply) => reply.sendFile("index.html"));

  return app;
}
