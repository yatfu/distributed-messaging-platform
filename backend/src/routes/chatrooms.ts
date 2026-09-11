import express from "express";
import crypto from "node:crypto";
import { pool } from "../db";
import { nextTick } from "process";
const router = express.Router();
import { validateChatroom, validateString } from "../lib/validate";
import { ApiError } from "../lib/Errors";
import {getUserFromToken} from "../lib/auth";

router.get("/test", (req, res) => {
  res.json({ nessage: "test" });
});

// create chatroom given name and user id
router.post("/create", async (req, res) => {
  //validate user via sessionToken cookie
  const token = req.cookies.sessionToken;
  const validUser = await getUserFromToken(token);

  //validate name
  let validName;
  if (req.body?.name === undefined) {
    validName = "Chatroom";
  }
  else {
    validName = validateString(req.body.name, "name");
  }


  console.log("Passed Validation, generating data for chatroom creation");
  const validUserId = validUser.id;
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
  validateString(chatroomId, "chatroom"); // field required but no required value
  // query messages
  const result = await pool.query(
    `SELECT * FROM messages
    WHERE chatroom_id = $1`,
    [chatroomId]
  );
  //return result as json. SQL data ---(postgresql conversion)--> javascript object ----(json function)---> response
  return res.status(200).json({
    messages: result.rows,
  });
});

// delete chatroom given chatroom_id and userId
router.delete("/:chatroomId/users/:userId", async (req, res) => {
  const { chatroomId, userId } = req.params;
  //validate
  validateChatroom(chatroomId, userId);
  // query deletion
  const result = await pool.query(
    `DELETE FROM chatrooms 
    WHERE id = $1
    AND admin_id = $2`,
    [chatroomId, userId]
  );
  //check if chatroom was deleted
  if (result.rowCount === 0) {
    throw new ApiError(404, "Chatroom not found or access denied");
  }
  return res.status(204).send();
});

// dev: get all chatrooms
router.get("/", async (req, res) => {
  const result = await pool.query(`SELECT * from chatrooms`);
  res.json(result.rows);
});

export default router;
