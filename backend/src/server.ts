import express, { response } from "express";
import cors from "cors";
import "dotenv/config";
import { pool } from "./db.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health",  async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({status: "ok"});
  }
  catch (error) {
    res.status(500).json({status: "error", database: "disconnected"})
  }
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});