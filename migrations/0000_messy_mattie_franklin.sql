CREATE TABLE "bookings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" varchar NOT NULL,
	"stylist_id" varchar NOT NULL,
	"service_id" varchar NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"duration" integer NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"total_amount" numeric(8, 2) NOT NULL,
	"client_address" text NOT NULL,
	"client_phone" varchar,
	"special_requests" text,
	"payment_intent_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" varchar NOT NULL,
	"client_id" varchar NOT NULL,
	"stylist_id" varchar NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"professionalism_rating" integer,
	"quality_rating" integer,
	"punctuality_rating" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stylist_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"price" numeric(8, 2) NOT NULL,
	"duration" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"phone" varchar,
	"user_type" varchar NOT NULL,
	"address" text,
	"bio" text,
	"years_experience" integer,
	"specializations" text[],
	"service_area" varchar,
	"license_number" varchar,
	"travel_radius" integer,
	"is_available" boolean DEFAULT true,
	"rating" numeric(3, 2) DEFAULT '0.00',
	"total_reviews" integer DEFAULT 0,
	"total_earnings" numeric(10, 2) DEFAULT '0.00',
	"stripe_customer_id" varchar,
	"stripe_account_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_stylist_id_users_id_fk" FOREIGN KEY ("stylist_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_stylist_id_users_id_fk" FOREIGN KEY ("stylist_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_stylist_id_users_id_fk" FOREIGN KEY ("stylist_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;