import express from "express";
import { pool } from "../db.js";
import { validateUuid, validateString } from "../lib/validate.js";
import { getUserFromToken } from "../lib/auth.js";
import crypto from "node:crypto";

const router = express.Router();

// CREATE message given user session token and chatroom id
router.post("/", async (req, res) => {
  //validate chatroom
  const validChatroomId = validateUuid(req.body?.room, "chatroomId"); // req.body? checks if body exists, if exists then gets room
  //validate user from token
  const validUser = await getUserFromToken(req.cookies.sessionToken);
  //validate message
  const validMessage = validateString(req.body?.message, "message");
  //create message
  const messageId = crypto.randomUUID();
  const result = await pool.query(`
    INSERT into MESSAGES (id, chatroom_id, sender_id, content)
    SELECT $1, id, $3, $4 FROM chatrooms
    WHERE id = $2
      AND expires_at > NOW()
    RETURNING id, chatroom_id, sender_id, content, created_at;
  `, [messageId, validChatroomId, validUser.id, validMessage]) // INSERT -> SELECT inserts only after select
  //check to see if message was inserted
  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Chatroom expired or not found"}); //404: chatroom not found or expired
  }
  return res.status(201).json({ message: result.rows[0]}); // 201: message created
});
// EDIT message given message id and user session token - NOT MVP STAGE

// DELETE message given message id and user session token from cookies
router.delete("/:messageId", async (req, res) => {
  //validate message id, token id
  const { messageId } = req.params;
  const validMessageId = validateUuid(messageId, "messageId");

  const token = req.cookies.sessionToken;
  const validUser = await getUserFromToken(token);
  const validUserId = validUser.id;

  const result = await pool.query(
    `DELETE FROM messages
     WHERE id = $1 AND sender_id = $2
     RETURNING id, chatroom_id, sender_id, content, created_at`,
    [validMessageId, validUserId]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Message not found" });
  }
  return res.status(200).json({ message: result.rows[0] });
});

export default router;
