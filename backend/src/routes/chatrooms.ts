import express from "express";
import crypto from "crypto";
import {pool} from '../db';
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ nessage: "test" });
});

// given name for chatroom, create a chatroom: generate url, send sql query to database
router.post("/create", async (req, res) => {
  let name = req.body.name;
  if (typeof name !== "string") {
    name = "Chatroom";
  }
  try {
    const result = await pool.query("INSERT INTO chatrooms (name) VALUES ($1) RETURNING *", [name]);
    return res.status(201).json(result.rows[0]);
  }

  catch {
    res.status(500).json({error: "Internal server error, failed to create chatroom"});
  }
});

module.exports = router;
