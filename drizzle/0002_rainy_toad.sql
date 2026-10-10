CREATE TYPE "public"."media_asset_status" AS ENUM('PENDING', 'READY', 'REJECTED', 'DELETED');--> statement-breakpoint
CREATE TYPE "public"."media_purpose" AS ENUM('profile_avatar', 'brand_logo', 'brand_story', 'bite', 'story', 'product', 'creator_portfolio', 'private_test_seed');--> statement-breakpoint
CREATE TYPE "public"."media_visibility" AS ENUM('PRIVATE', 'PRIVATE_TEST', 'PUBLIC');--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"purpose" "media_purpose" NOT NULL,
	"status" "media_asset_status" DEFAULT 'PENDING' NOT NULL,
	"visibility" "media_visibility" DEFAULT 'PRIVATE' NOT NULL,
	"storage_provider" text NOT NULL,
	"object_key" text NOT NULL,
	"original_name" text NOT NULL,
	"content_type" text NOT NULL,
	"byte_size" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_assets_object_key_unique" UNIQUE("object_key")
);
--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "media_assets_user_created_idx" ON "media_assets" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "media_assets_purpose_status_idx" ON "media_assets" USING btree ("purpose","status");--> statement-breakpoint
CREATE INDEX "media_assets_visibility_status_idx" ON "media_assets" USING btree ("visibility","status");