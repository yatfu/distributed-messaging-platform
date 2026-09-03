CREATE TABLE messages (
    id UUID PRIMARY KEY,
    chatroom_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    edited_at TIMESTAMPTZ

    CONSTRAINT fk_chatroom
        FOREIGN KEY (chatroom_id)
        REFERENCES chatrooms(id)
        ON DELETE CASCADE
);

CREATE INDEX index_messages_chatroom_created
ON messages (chatroom_id, created_at);