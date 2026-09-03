import express from "express";
import crypto from "crypto";
import {pool} from '../db';

const router = express.Router();

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

export default router;