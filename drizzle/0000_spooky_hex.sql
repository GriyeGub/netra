CREATE TYPE "public"."business_verification_status" AS ENUM('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."profile_type" AS ENUM('consumer', 'creator', 'business');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_memberships" (
	"business_user_id" text NOT NULL,
	"user_id" text NOT NULL,
	"membership_role" text DEFAULT 'owner' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "business_memberships_business_user_id_user_id_pk" PRIMARY KEY("business_user_id","user_id"),
	CONSTRAINT "business_membership_role_check" CHECK ("business_memberships"."membership_role" in ('owner', 'admin', 'editor'))
);
--> statement-breakpoint
CREATE TABLE "business_profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"business_name" text DEFAULT '' NOT NULL,
	"handle" text,
	"discipline" text DEFAULT '' NOT NULL,
	"origin" text DEFAULT '' NOT NULL,
	"manifesto" text DEFAULT '' NOT NULL,
	"verification_status" "business_verification_status" DEFAULT 'UNVERIFIED' NOT NULL,
	"onboarding_step" text DEFAULT 'identity' NOT NULL,
	"onboarding_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_verification_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_user_id" text NOT NULL,
	"status" "business_verification_status" DEFAULT 'PENDING' NOT NULL,
	"business_email" text NOT NULL,
	"business_website" text,
	"registration_id" text,
	"reviewer_user_id" text,
	"review_reason" text,
	"email_status" text DEFAULT 'QUEUED' NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "consumer_profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"interests" text[] DEFAULT '{}'::text[] NOT NULL,
	"content_preferences" text[] DEFAULT '{}'::text[] NOT NULL,
	"active_intent" text DEFAULT 'I’m exploring' NOT NULL,
	"discovery_mode" text DEFAULT 'Interactive' NOT NULL,
	"buying_capacity" text DEFAULT '₹3,000 / month' NOT NULL,
	"radar" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creator_profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"onboarding_step" text DEFAULT 'identity' NOT NULL,
	"onboarding_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" text,
	"event_type" text NOT NULL,
	"target_type" text,
	"target_id" text,
	"request_id" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "onboarding_progress" (
	"user_id" text NOT NULL,
	"profile_type" "profile_type" NOT NULL,
	"current_step" text NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	CONSTRAINT "onboarding_progress_user_id_profile_type_pk" PRIMARY KEY("user_id","profile_type")
);
--> statement-breakpoint
CREATE TABLE "profile_memberships" (
	"user_id" text NOT NULL,
	"profile_type" "profile_type" NOT NULL,
	"activated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profile_memberships_user_id_profile_type_pk" PRIMARY KEY("user_id","profile_type")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"about" text DEFAULT '' NOT NULL,
	"onboarding_complete" boolean DEFAULT false NOT NULL,
	"onboarding_step" text DEFAULT 'personalization' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"active_profile" "profile_type" DEFAULT 'consumer' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"username" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_format" CHECK ("users"."username" ~ '^[a-z0-9_]{3,30}$')
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_memberships" ADD CONSTRAINT "business_memberships_business_user_id_business_profiles_user_id_fk" FOREIGN KEY ("business_user_id") REFERENCES "public"."business_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_memberships" ADD CONSTRAINT "business_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_profiles" ADD CONSTRAINT "business_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_verification_requests" ADD CONSTRAINT "business_verification_requests_business_user_id_business_profiles_user_id_fk" FOREIGN KEY ("business_user_id") REFERENCES "public"."business_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_verification_requests" ADD CONSTRAINT "business_verification_requests_reviewer_user_id_users_id_fk" FOREIGN KEY ("reviewer_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consumer_profiles" ADD CONSTRAINT "consumer_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_profiles" ADD CONSTRAINT "creator_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onboarding_progress" ADD CONSTRAINT "onboarding_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_memberships" ADD CONSTRAINT "profile_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "accounts_provider_account_idx" ON "accounts" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "business_profiles_handle_lower_uq" ON "business_profiles" USING btree (lower("handle"));--> statement-breakpoint
CREATE INDEX "business_verification_requests_business_idx" ON "business_verification_requests" USING btree ("business_user_id");--> statement-breakpoint
CREATE INDEX "events_actor_created_idx" ON "events" USING btree ("actor_user_id","created_at");--> statement-breakpoint
CREATE INDEX "events_type_created_idx" ON "events" USING btree ("event_type","created_at");--> statement-breakpoint
CREATE INDEX "profile_memberships_type_idx" ON "profile_memberships" USING btree ("profile_type");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_uq" ON "sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_lower_uq" ON "users" USING btree (lower("email"));--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_lower_uq" ON "users" USING btree (lower("username"));--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" USING btree ("identifier");