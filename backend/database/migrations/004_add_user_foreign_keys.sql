ALTER TABLE chatrooms
ADD CONSTRAINT fk_chatrooms_admin
FOREIGN KEY (admin_id)
REFERENCES users(id);

ALTER TABLE messages
ADD CONSTRAINT fk_messages_sender
FOREIGN KEY (sender_id)
REFERENCES users(id);
