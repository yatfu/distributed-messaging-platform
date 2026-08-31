CREATE TABLE chatrooms (
    id UUID PRIMARY KEY,
    admin_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);