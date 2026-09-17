import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
import { pool } from "./db.js";
import chatroomsRouter from "./routes/chatrooms.js";
import messagesRouter from "./routes/messages.js";
import usersRouter from "./routes/users.js";
import { ApiError } from "./lib/Errors.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    return res.json({ status: "ok" });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.use("/api/chatrooms", chatroomsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/users", usersRouter);
app.use(errorHandler);

function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  console.error(err);
  return res.status(500).json({
    error: "Internal server error",
  });
}

export default app;
