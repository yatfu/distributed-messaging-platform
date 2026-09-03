import express from "express";
import cors from "cors";
import "dotenv/config";

import { pool } from "./db.js";
import chatroomsRouter from "./routes/chatrooms.js";
import type { Request, Response, NextFunction } from "express"; // for error handling middlewrae


const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  }),
);
app.use(express.json()); // parses incoming json

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

app.use("/api/chatrooms", chatroomsRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});

// Error handler
function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);
  return res.status(500).json({
    error: "Internal server error"
  });
}
