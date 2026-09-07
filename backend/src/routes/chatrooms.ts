import express from "express";
import crypto from "crypto";
import {pool} from '../db';
import { nextTick } from "process";
const router = express.Router();
import validate from '../lib/validate';
import { ApiError } from '../lib/Errors';

router.get("/test", (req, res) => {
  res.json({ nessage: "test" });
});

// given name for chatroom, create a chatroom: generate url, send sql query to database
router.post("/create", async (req, res) => {
  let name = req.body.name;
  //validate
  if (typeof name !== "string") {
    name = "Chatroom";
  }
  console.log("Passed Validation, generating data for chatroom creation")
  const roomId = crypto.randomUUID();
  const creatorId = crypto.randomUUID();
  //send db query (express 5 handles errors with our global error handler)
  const result = await pool.query(
    "INSERT INTO chatrooms (id, admin_id, name, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL '1 day') RETURNING *", 
  [roomId, creatorId, name]);

  return res.status(201).json(result.rows[0]);
});

// get messages from chatroom
router.get("/:chatroomId/messages", async (req, res) => {
  const { chatroomId } = req.params;
  // validate
  validate(chatroomId)
  // query messages
  const result = await pool.query(
    `SELECT * FROM messages
    WHERE chatroom_id = $1`,
      [chatroomId])
  //return result as json. SQL data ---(postgresql conversion)--> javascript object ----(json function)---> response
  return res.status(200).json({
    messages: result.rows
  })
});


// delete chatroom given chatroom_id and userId
router.delete("/:chatroomId/users/:userId", async (req, res ) => {
  const { chatroomId, userId } = req.params;
  //validate
  validate(chatroomId, userId);
  // query deletion
  const result = await pool.query(
    `DELETE FROM chatrooms 
    WHERE id = $1
    AND admin_id = $2`, 
    [chatroomId, userId]
  );
//check if chatroom was deleted
  if (result.rowCount === 0) {
    throw new ApiError(404, "Chatroom not found or access denied")
  }
  res.status(204).send();
});

export default router;
