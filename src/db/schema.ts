import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const profileType = pgEnum("profile_type", ["consumer", "creator", "business"]);
export const businessVerificationStatus = pgEnum("business_verification_status", [
  "UNVERIFIED",
  "PENDING",
  "VERIFIED",
  "REJECTED",
]);
export const mediaPurpose = pgEnum("media_purpose", [
  "profile_avatar", "brand_logo", "brand_story", "bite", "story", "product", "creator_portfolio", "private_test_seed",
]);
export const mediaAssetStatus = pgEnum("media_asset_status", ["PENDING", "READY", "REJECTED", "DELETED"]);
export const mediaVisibility = pgEnum("media_visibility", ["PRIVATE", "PRIVATE_TEST", "PUBLIC"]);

// Better Auth owns password, verification, and session lifecycle. NETRA keeps
// the single-account identity in this row and attaches all product data to it.
export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    username: text("username").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    emailUnique: uniqueIndex("users_email_lower_uq").on(sql`lower(${table.email})`),
    usernameUnique: uniqueIndex("users_username_lower_uq").on(sql`lower(${table.username})`),
    usernameFormat: check("users_username_format", sql`${table.username} ~ '^[a-z0-9_]{3,30}$'`),
  }),
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    activeProfile: profileType("active_profile").notNull().default("consumer"),
  },
  (table) => ({
    tokenUnique: uniqueIndex("sessions_token_uq").on(table.token),
    userIdx: index("sessions_user_id_idx").on(table.userId),
  }),
);

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("accounts_user_id_idx").on(table.userId),
    providerIdx: index("accounts_provider_account_idx").on(table.providerId, table.accountId),
  }),
);

export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({ identifierIdx: index("verifications_identifier_idx").on(table.identifier) }),
);

export const profiles = pgTable(
  "profiles",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    about: text("about").notNull().default(""),
    onboardingComplete: boolean("onboarding_complete").notNull().default(false),
    onboardingStep: text("onboarding_step").notNull().default("personalization"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
);

export const profileMemberships = pgTable(
  "profile_memberships",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    profileType: profileType("profile_type").notNull(),
    activatedAt: timestamp("activated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.profileType] }),
    typeIdx: index("profile_memberships_type_idx").on(table.profileType),
  }),
);

export const consumerProfiles = pgTable(
  "consumer_profiles",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    interests: text("interests").array().notNull().default(sql`'{}'::text[]`),
    contentPreferences: text("content_preferences").array().notNull().default(sql`'{}'::text[]`),
    activeIntent: text("active_intent").notNull().default("I’m exploring"),
    discoveryMode: text("discovery_mode").notNull().default("Interactive"),
    buyingCapacity: text("buying_capacity").notNull().default("₹3,000 / month"),
    radar: text("radar").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
);

export const creatorProfiles = pgTable(
  "creator_profiles",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    onboardingStep: text("onboarding_step").notNull().default("identity"),
    onboardingData: jsonb("onboarding_data").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
);

export const businessProfiles = pgTable(
  "business_profiles",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    businessName: text("business_name").notNull().default(""),
    handle: text("handle"),
    discipline: text("discipline").notNull().default(""),
    origin: text("origin").notNull().default(""),
    manifesto: text("manifesto").notNull().default(""),
    verificationStatus: businessVerificationStatus("verification_status").notNull().default("UNVERIFIED"),
    onboardingStep: text("onboarding_step").notNull().default("identity"),
    onboardingData: jsonb("onboarding_data").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({ handleUnique: uniqueIndex("business_profiles_handle_lower_uq").on(sql`lower(${table.handle})`) }),
);

export const businessVerificationRequests = pgTable(
  "business_verification_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    businessUserId: text("business_user_id")
      .notNull()
      .references(() => businessProfiles.userId, { onDelete: "cascade" }),
    status: businessVerificationStatus("status").notNull().default("PENDING"),
    businessEmail: text("business_email").notNull(),
    businessWebsite: text("business_website"),
    registrationId: text("registration_id"),
    reviewerUserId: text("reviewer_user_id").references(() => users.id, { onDelete: "set null" }),
    reviewReason: text("review_reason"),
    emailStatus: text("email_status").notNull().default("QUEUED"),
    requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  },
  (table) => ({
    businessIdx: index("business_verification_requests_business_idx").on(table.businessUserId),
    onePendingRequest: uniqueIndex("business_verification_requests_one_pending_uq")
      .on(table.businessUserId)
      .where(sql`${table.status} = 'PENDING'`),
  }),
);

export const businessVerificationReviews = pgTable(
  "business_verification_reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requestId: uuid("request_id")
      .notNull()
      .references(() => businessVerificationRequests.id, { onDelete: "cascade" }),
    reviewerUserId: text("reviewer_user_id").references(() => users.id, { onDelete: "set null" }),
    previousStatus: businessVerificationStatus("previous_status"),
    nextStatus: businessVerificationStatus("next_status").notNull(),
    reason: text("reason"),
    source: text("source").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({ requestCreatedIdx: index("business_verification_reviews_request_created_idx").on(table.requestId, table.createdAt) }),
);

export const businessMemberships = pgTable(
  "business_memberships",
  {
    businessUserId: text("business_user_id")
      .notNull()
      .references(() => businessProfiles.userId, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    membershipRole: text("membership_role").notNull().default("owner"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.businessUserId, table.userId] }),
    ownerRoleCheck: check("business_membership_role_check", sql`${table.membershipRole} in ('owner', 'admin', 'editor')`),
  }),
);

export const onboardingProgress = pgTable(
  "onboarding_progress",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    profileType: profileType("profile_type").notNull(),
    currentStep: text("current_step").notNull(),
    data: jsonb("data").notNull().default(sql`'{}'::jsonb`),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => ({ pk: primaryKey({ columns: [table.userId, table.profileType] }) }),
);

export const events = pgTable(
  "events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorUserId: text("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    eventType: text("event_type").notNull(),
    targetType: text("target_type"),
    targetId: text("target_id"),
    requestId: text("request_id"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    actorCreatedIdx: index("events_actor_created_idx").on(table.actorUserId, table.createdAt),
    typeCreatedIdx: index("events_type_created_idx").on(table.eventType, table.createdAt),
  }),
);

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    purpose: mediaPurpose("purpose").notNull(),
    status: mediaAssetStatus("status").notNull().default("PENDING"),
    visibility: mediaVisibility("visibility").notNull().default("PRIVATE"),
    storageProvider: text("storage_provider").notNull(),
    objectKey: text("object_key").notNull().unique(),
    originalName: text("original_name").notNull(),
    contentType: text("content_type").notNull(),
    byteSize: integer("byte_size").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userCreatedIdx: index("media_assets_user_created_idx").on(table.userId, table.createdAt),
    purposeStatusIdx: index("media_assets_purpose_status_idx").on(table.purpose, table.status),
    visibilityStatusIdx: index("media_assets_visibility_status_idx").on(table.visibility, table.status),
  }),
);

export const biteStatus = pgEnum("bite_status", ["DRAFT", "PUBLISHED"]);
export const biteInteractionType = pgEnum("bite_interaction_type", ["LIKE", "SAVE", "VIEW"]);

export const bites = pgTable(
  "bites",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creatorUserId: text("creator_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    mediaAssetId: uuid("media_asset_id").references(() => mediaAssets.id, { onDelete: "set null" }),
    title: text("title").notNull().default(""),
    description: text("description").notNull().default(""),
    status: biteStatus("status").notNull().default("DRAFT"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    creatorIdx: index("bites_creator_idx").on(table.creatorUserId),
    publishedIdx: index("bites_published_idx").on(table.status, table.publishedAt),
  }),
);

export const biteInteractions = pgTable(
  "bite_interactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    biteId: uuid("bite_id").notNull().references(() => bites.id, { onDelete: "cascade" }),
    interactionType: biteInteractionType("interaction_type").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    biteInteractionIdx: index("bite_interactions_bite_type_idx").on(table.biteId, table.interactionType),
    userInteractionUnique: uniqueIndex("bite_interactions_user_bite_type_uq")
      .on(table.userId, table.biteId, table.interactionType)
      .where(sql`${table.interactionType} IN ('LIKE', 'SAVE')`),
  }),
);

export const biteComments = pgTable(
  "bite_comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    biteId: uuid("bite_id").notNull().references(() => bites.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    biteCreatedIdx: index("bite_comments_bite_created_idx").on(table.biteId, table.createdAt),
    userCreatedIdx: index("bite_comments_user_created_idx").on(table.userId, table.createdAt),
  }),
);
