import crypto from "node:crypto";
import { pool } from "../db.js";
import { ApiError } from "./Errors.js";

// this function is tested with api users/me test
export async function getUserFromToken(token: unknown) {
  if (typeof token !== "string" || token.trim() === "") {
    throw new ApiError(401, "Authentication required");
  }

  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const result = await pool.query(
    `SELECT id, name
     FROM users
     WHERE token_hash = $1
       AND expires_at > NOW()`,
    [tokenHash],
  );

  const user = result.rows[0];

  if (!user) {
    throw new ApiError(401, "Invalid or expired session");
  }

  return user;
}