import express from "express";
import crypto from "crypto";
import {pool} from '../db';

const router = express.Router();

// GET messages
router.get("/:chatroomId", async (req, res) => {
  const { chatroomId } = req.params;
  // check if chatroom exists, if not throw 404
  const chatroom = await pool.query(
    `SELECT 1 FROM chatrooms WHERE id = $1`, [chatroomId]
  )
  if (chatroom.rowCount === 0) {
    return res.status(404).json({error: "Chatroom not found"}); // returning to end the process
  }

  //get all messages from chatroom
  const result = await pool.query(
    `SELECT * FROM messages WHERE chatroom_id = $1`, [chatroomId]
  );
  res.json(result.rows);
});

// DELETE message given id
router.delete("/:messageId", async (req, res) => {
  const { messageId } = req.params;
  const result = await pool.query(
    `DELETE FROM messages WHERE id = $1 RETURNING *`, [messageId]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({error: "Message not found"});
  }
  res.status(204).send();
})

export default router;