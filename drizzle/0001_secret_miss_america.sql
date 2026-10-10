CREATE TABLE "business_verification_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"reviewer_user_id" text,
	"previous_status" "business_verification_status",
	"next_status" "business_verification_status" NOT NULL,
	"reason" text,
	"source" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "business_verification_reviews" ADD CONSTRAINT "business_verification_reviews_request_id_business_verification_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."business_verification_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_verification_reviews" ADD CONSTRAINT "business_verification_reviews_reviewer_user_id_users_id_fk" FOREIGN KEY ("reviewer_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "business_verification_reviews_request_created_idx" ON "business_verification_reviews" USING btree ("request_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "business_verification_requests_one_pending_uq" ON "business_verification_requests" USING btree ("business_user_id") WHERE "business_verification_requests"."status" = 'PENDING';