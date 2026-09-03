import express from "express";
import crypto from "crypto";
import {pool} from '../db';
import { nextTick } from "process";
const router = express.Router();

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

export default router;
