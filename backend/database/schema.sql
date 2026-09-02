CREATE TABLE chatrooms (
    id UUID PRIMARY KEY,
    admin_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE messages (
    id UUID PRIMARY KEY,
    chatroom_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_chatroom
        FOREIGN KEY (chatroom_id)
        REFERENCES chatrooms(id) -- chatroom_id must reference an actual chatroom
        ON DELETE CASCADE -- deletes messages on chatroom deletion
);