CREATE TABLE
  IF NOT EXISTS user_credentials (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users (id),
    credential_type VARCHAR(20) NOT NULL,
    credential_value TEXT NOT NULL,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT NOW ()
  );

CREATE TRIGGER set_updated_at_user_credentials_trigger BEFORE
UPDATE ON user_credentials FOR EACH ROW WHEN (
  OLD.* IS DISTINCT
  FROM
    NEW.*
) EXECUTE FUNCTION set_updated_at ()