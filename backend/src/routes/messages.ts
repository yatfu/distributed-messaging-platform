import express from "express";
import { pool } from "../db";
import { validateUuid } from "../lib/validate";
import { getUserFromToken } from "../lib/auth.js";

const router = express.Router();

// CREATE message given user session token and chatroom id
router.post("/", async (req, res) => {
  const 
});
// EDIT message given message id and user session token

// DELETE message given message id and user session token from cookies
router.delete("/:messageId", async (req, res) => {
  //validate message id, token id
  const { messageId } = req.params;
  const validMessageId = validateUuid(messageId, "message");

  const token = req.cookies.sessionToken;
  const validUser = await getUserFromToken(token);
  const validUserId = validUser.id;

  const result = await pool.query(
    `DELETE FROM messages WHERE id = $1 AND sender_id = $2 RETURNING *`,
    [validMessageId, validUserId]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Message not found" });
  }
  return res.status(200).json({ message: result.rows[0] });
});

export default router;
