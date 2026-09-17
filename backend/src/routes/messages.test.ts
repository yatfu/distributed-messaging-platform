import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import { pool } from "../db.js";

const testApp = app as unknown as Parameters<typeof request>[0];

beforeEach(async () => { // reset db before every test
  await pool.query("TRUNCATE messages, chatrooms, users CASCADE");
});

//create room and user to test endpoints
async function setupRoom() { 
  const agent = request.agent(testApp);

  const userResponse = await agent
    .post("/api/users/create")
    .send({ name: "Test User" })
    .expect(201);

  const roomResponse = await agent
    .post("/api/chatrooms")
    .send({ name: "Test Room" })
    .expect(201);

  return {
    agent,
    user: userResponse.body.user,
    room: roomResponse.body,
  };
}