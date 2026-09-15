import { pool } from "../db.js";
import express from "express";
import crypto from "node:crypto";
import { ApiError } from "../lib/Errors.js";
import { getUserFromToken } from "../lib/auth.js";

const router = express.Router();

//GET /api/users/me

// create user: REQUIRES COOKIES ENABLED
router.post("/create", async (req, res) => {
  // validate user id
  const name = req.body?.name;
  const nameLength = 20;
  const maxCookieAge = 24 * 60 * 60 * 1000 // max age of cookie in miliseconds
  if (
    typeof name !== "string" ||
    name.trim() === "" ||
    name.trim().length > nameLength
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
    maxAge: maxCookieAge,
    path: "/",
  });
  return res.status(201).json({
    user: result.rows[0],
  });
});

router.get('/me', async (req, res) => {
  const user = await getUserFromToken(req.cookies.sessionToken);
  return res.status(200).json({ user }); // 200: succeeded, 201: created
});

export default router;
