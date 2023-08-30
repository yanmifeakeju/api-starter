ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (3);--> statement-breakpoint

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP(3);
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_update_updated_at
BEFORE UPDATE ON "users"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
