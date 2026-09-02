import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Database URL is not defined");
}

export const pool = new Pool({
  connectionString: databaseUrl,
});