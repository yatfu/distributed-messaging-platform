import { pool } from "../db";
import express from "express";
import crypto from "node:crypto";
import { ApiError } from "../lib/Errors";

const router = express.Router();

// create user

router.post("/create", async (req, res) => {
  // validate user id
  const name = req.body?.name;
  if (
    typeof name !== "string" ||
    name.trim() === "" ||
    name.trim().length > 20
  ) {
    throw new ApiError(400, "Display name must contain 1–20 characters");
  }
  const userId = crypto.randomUUID(); //generate id
  const token = crypto.randomBytes(32).toString("hex"); //generate token

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex"); // hash token

  const result = await pool.query(//insert user
    `INSERT INTO users (
       id,
       name,
       token_hash
     )
     VALUES ($1, $2, $3)
     RETURNING
       id,
       name,
       created_at AS "createdAt",
       expires_at AS "expiresAt"`,
    [userId, name.trim(), tokenHash],
  );
  res.cookie("sessionToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });
  return res.status(201).json({
    user: result.rows[0],
  });
});
