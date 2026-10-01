BEGIN;

DELETE FROM chatrooms
WHERE expires_at <= NOW();

DELETE FROM users
WHERE expires_at <= NOW()
  AND NOT EXISTS (
    SELECT 1
    FROM chatrooms
    WHERE chatrooms.admin_id = users.id
  )
  AND NOT EXISTS (
    SELECT 1
    FROM messages
    WHERE messages.sender_id = users.id
  );

COMMIT;