CREATE TABLE IF NOT EXISTS "users_credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"password" text NOT NULL,
	"user_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_credentials" ADD CONSTRAINT "users_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
