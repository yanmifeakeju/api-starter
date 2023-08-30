ALTER TABLE "users"
ALTER COLUMN "updated_at"
SET DEFAULT now ();

--> statement-breakpoint
UPDATE "users"
SET
  "updated_at" = now ()
WHERE
  "updated_at" IS NULL
  --> statement-breakpoint
ALTER TABLE "users"
ALTER COLUMN "updated_at"
SET
  NOT NULL;