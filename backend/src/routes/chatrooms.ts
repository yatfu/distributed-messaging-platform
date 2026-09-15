import express from "express";
import crypto from "node:crypto";
import { pool } from "../db.js";
const router = express.Router();
import { validateString, validateUuid } from "../lib/validate.js";
import { ApiError } from "../lib/Errors.js";
import { getUserFromToken } from "../lib/auth.js";

// create chatroom given name and user id
router.post("/", async (req, res) => {
  //validate user via sessionToken cookie
  const token = req.cookies.sessionToken;
  const user = await getUserFromToken(token);
  const validUserId = user.id;

  //validate name
  let validName;
  if (req.body?.name === undefined) {
    validName = "Chatroom";
  } else {
    validName = validateString(req.body.name, "name");
  }

  console.log("Passed Validation, generating data for chatroom creation");
  const roomId = crypto.randomUUID();

  //send db query (express 5 handles errors with our global error handler)
  const result = await pool.query(
    `INSERT INTO chatrooms (id, admin_id, name, expires_at) 
    VALUES ($1, $2, $3, NOW() + INTERVAL '1 day') 
    RETURNING id, name, created_at, expires_at`,
    [roomId, validUserId, validName]
  );

  return res.status(201).json(result.rows[0]);
});

// get messages from chatroom
router.get("/:chatroomId/messages", async (req, res) => {
  const { chatroomId } = req.params;
  // validate
  const validChatroomId = validateUuid(chatroomId, "chatroomId");

  const roomResult = await pool.query(
    `SELECT id
     FROM chatrooms
     WHERE id = $1
       AND expires_at > NOW()`,
    [validChatroomId]
  );

  if (roomResult.rowCount === 0) {
    throw new ApiError(404, "Chatroom not found or expired");
  }

  // query messages
  const result = await pool.query(
    `SELECT * FROM messages
    WHERE chatroom_id = $1`,
    [validChatroomId]
  );
  //return result as json. SQL data ---(postgresql conversion)--> javascript object ----(json function)---> response
  return res.status(200).json({
    messages: result.rows,
  });
});

// delete chatroom given chatroom_id and authenticated user
router.delete("/:chatroomId", async (req, res) => {
  const { chatroomId } = req.params;
  //validate
  const validChatroomId = validateUuid(chatroomId, "chatroomId");
  const user = await getUserFromToken(req.cookies.sessionToken);

  // query deletion
  const result = await pool.query(
    `DELETE FROM chatrooms 
    WHERE id = $1
    AND admin_id = $2`,
    [validChatroomId, user.id]
  );
  //check if chatroom was deleted
  if (result.rowCount === 0) {
    throw new ApiError(404, "Chatroom not found or access denied");
  }
  return res.status(204).send();
});

export default router;
