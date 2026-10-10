CREATE TYPE "public"."bite_interaction_type" AS ENUM('LIKE', 'SAVE', 'VIEW');--> statement-breakpoint
CREATE TYPE "public"."bite_status" AS ENUM('DRAFT', 'PUBLISHED');--> statement-breakpoint
CREATE TABLE "bite_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"bite_id" uuid NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bite_interactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"bite_id" uuid NOT NULL,
	"interaction_type" bite_interaction_type NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_user_id" text NOT NULL,
	"media_asset_id" uuid,
	"title" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"status" bite_status DEFAULT 'DRAFT' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bite_comments" ADD CONSTRAINT "bite_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bite_comments" ADD CONSTRAINT "bite_comments_bite_id_bites_id_fk" FOREIGN KEY ("bite_id") REFERENCES "public"."bites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bite_interactions" ADD CONSTRAINT "bite_interactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bite_interactions" ADD CONSTRAINT "bite_interactions_bite_id_bites_id_fk" FOREIGN KEY ("bite_id") REFERENCES "public"."bites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bites" ADD CONSTRAINT "bites_creator_user_id_users_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bites" ADD CONSTRAINT "bites_media_asset_id_media_assets_id_fk" FOREIGN KEY ("media_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bite_comments_bite_created_idx" ON "bite_comments" USING btree ("bite_id","created_at");--> statement-breakpoint
CREATE INDEX "bite_comments_user_created_idx" ON "bite_comments" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "bite_interactions_bite_type_idx" ON "bite_interactions" USING btree ("bite_id","interaction_type");--> statement-breakpoint
CREATE UNIQUE INDEX "bite_interactions_user_bite_type_uq" ON "bite_interactions" USING btree ("user_id","bite_id","interaction_type") WHERE "bite_interactions"."interaction_type" IN ('LIKE', 'SAVE');--> statement-breakpoint
CREATE INDEX "bites_creator_idx" ON "bites" USING btree ("creator_user_id");--> statement-breakpoint
CREATE INDEX "bites_published_idx" ON "bites" USING btree ("status","published_at");