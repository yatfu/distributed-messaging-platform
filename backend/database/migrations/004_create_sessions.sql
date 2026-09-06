CREATE TABLE
  sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL 
      CONSTRAINT fk_user 
      FOREIGN KEY (user_id) 
      REFERENCES users (id) 
      ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 day'
  )