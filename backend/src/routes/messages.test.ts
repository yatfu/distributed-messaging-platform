import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import { pool } from "../db.js";

const testApp = app as unknown as Parameters<typeof request>[0];

beforeEach(async () => {
  // reset db before every test
  await pool.query("TRUNCATE messages, chatrooms, users CASCADE");
});

//create room and user to test endpoints
async function createTestRoom() {
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
    room: roomResponse.body,
  };
}
describe("POST /api/messages", () => {
  it("creates a message", async () => {
    const { agent, room } = await createTestRoom();

    const response = await agent
      .post("/api/messages")
      .send({
        room: room.id,
        message: "Hello",
      })
      .expect(201);

    expect(response.body.message.content).toBe("Hello");
    expect(response.body.message.chatroom_id).toBe(room.id);
  });

  it("rejects unauthenticated message creation", async () => {
    const { room } = await createTestRoom();

    await request(testApp)
      .post("/api/messages")
      .send({
        room: room.id,
        message: "Hello",
      })
      .expect(401);
  });
});

describe("GET /api/chatrooms/:chatroomId/messages", () => {
  it("rejects missing chatroom when retieving messages", async () => {
    const missingRoomId = crypto.randomUUID();
    await request(testApp)
      .get(`/api/chatrooms/${missingRoomId}/messages`)
      .expect(404);
  });

  it("retrieves chatroom messages", async () => {
    const { agent, room } = await createTestRoom();

    await agent
      .post("/api/messages")
      .send({
        room: room.id,
        message: "Hello",
      })
      .expect(201);

    const response = await request(testApp)
      .get(`/api/chatrooms/${room.id}/messages`)
      .expect(200);

    expect(response.body.messages).toHaveLength(1);
    expect(response.body.messages[0].content).toBe("Hello");
  });
});

describe("DELETE /api/messages/:messageId", () => {
  it("allows the sender to delete a message", async () => {
    const { agent, room } = await createTestRoom();

    const created = await agent
      .post("/api/messages")
      .send({
        room: room.id,
        message: "Hello",
      })
      .expect(201);

    await agent.delete(`/api/messages/${created.body.message.id}`).expect(200);
  });

  it("prevents another user from deleting a message", async () => {
    const { agent, room } = await createTestRoom();

    const created = await agent
      .post("/api/messages")
      .send({
        room: room.id,
        message: "Hello",
      })
      .expect(201);

    const otherUser = request.agent(testApp);

    await otherUser
      .post("/api/users/create")
      .send({ name: "Other User" })
      .expect(201);

    await otherUser
      .delete(`/api/messages/${created.body.message.id}`)
      .expect(404);
  });

  it("rejects deletion without authentication from session cookie", async () => {
    const messageId = crypto.randomUUID();
    await request(testApp)
    .delete(`/api/messages/${messageId}`)
    .expect(401);
  })
});
