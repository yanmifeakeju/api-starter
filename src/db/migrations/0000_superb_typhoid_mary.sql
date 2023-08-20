CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(20) NOT NULL,
	"phone" varchar(30),
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (3),
	"last_login" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "users_user_uuid_unique" UNIQUE("user_uuid"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
