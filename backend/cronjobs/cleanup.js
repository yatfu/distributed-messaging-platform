import db from "./db.js";

try {
  const result = await db.query(`
    DELETE FROM chatrooms
    WHERE expires_at < NOW()
  `);
  console.log(
    `Cleaned ${result.rowCount} chatrooms, at ${new Date().toISOString()}`
  );
} catch (err) {
  console.error("Chatroom cleanup failed:", err);
  process.exitCode = 1;

} finally {
  try {
    await db.end();
  } catch (err) {
    console.error("Failed to close database connection:", err);
    process.exitCode = 1;
  }
}
