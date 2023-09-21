CREATE TABLE
  IF NOT EXISTS user_credentials (
    id SERIAL NOT NULL PRIMARY KEY,
    password TEXT NOT NULL
  );