CREATE TABLE
  IF NOT EXISTS users (
    id SERIAL NOT NULL PRIMARY KEY,
    user_id UUID DEFAULT gen_random_uuid () UNIQUE,
    email TEXT NOT NULL UNIQUE,
    username VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    last_login TIMESTAMP(3),
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP(3)
  );