import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import { pool } from "../db.js";
import crypto from "node:crypto";

const testApp = app as unknown as Parameters<typeof request>[0];

beforeEach(async () => {
  // reset db before every test
  await pool.query("TRUNCATE messages, chatrooms, users CASCADE");
});

//create room and user to test endpoints
async function createTestRoom() {
  const agent = request.agent(testApp);

  await agent
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
  it("creates a message in an existing chatroom", async () => {
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

  it("rejects creating a message without authentication", async () => {
    const { room } = await createTestRoom();

    await request(testApp)
      .post("/api/messages")
      .send({
        room: room.id,
        message: "Hello",
      })
      .expect(401);
  });
  it("rejects creating a message without content", async () => {
    const { agent, room } = await createTestRoom();

    await agent
      .post("/api/messages")
      .send({
        room: room.id,
      })
      .expect(400);
  });
  it("rejects creating a message with empty content", async () => {
    const { agent, room } = await createTestRoom();
    const message = "";
    await agent
      .post("/api/messages")
      .send({
        room: room.id,
        message: message,
      })
      .expect(400);
  });
  it("rejects creating a message with an invalid chatroom UUID", async () => {
    const { agent } = await createTestRoom();
    const message = "test message";
    await agent
      .post("/api/messages")
      .send({
        room: "invalid room",
        message: message,
      })
      .expect(400);
  });
  it("rejects creating a message in an expired chatroom", async () => {
    const { agent, room } = await createTestRoom();

    await pool.query(
      `UPDATE chatrooms
       SET expires_at = NOW() - INTERVAL '1 minute'
       WHERE id = $1`,
      [room.id],
    );

    await agent
      .post(`/api/messages`)
      .send({
        room: room.id,
        message: "valid message",
      })
      .expect(404);
  });
  it("rejects creating a message in a nonexistent chatroom", async () => {
    const { agent } = await createTestRoom();
    const roomId = crypto.randomUUID();
    await agent
      .post(`/api/messages`)
      .send({
        room: roomId,
        message: "valid message"
      })
      .expect(404);
  });
});

describe("GET /api/chatrooms/:chatroomId/messages", () => {
  it("rejects retrieving messages from a nonexistent chatroom", async () => {
    const missingRoomId = crypto.randomUUID();
    await request(testApp)
      .get(`/api/chatrooms/${missingRoomId}/messages`)
      .expect(404);
  });

  it("returns messages from an existing chatroom", async () => {
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
  it("allows the sender to delete their message", async () => {
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

  it("rejects deleting a message sent by another user", async () => {
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

  it("rejects deleting a message without authentication", async () => {
    const messageId = crypto.randomUUID();
    await request(testApp).delete(`/api/messages/${messageId}`).expect(401);
  });
  it("rejects deleting a message with an invalid UUID", async () => {
    const messageId = "invalid id";
    await request(testApp).delete(`/api/messages/${messageId}`).expect(400);
  });
  it("removes a message after the sender deletes it", async () => {
    const { agent, room } = await createTestRoom();

    //send message
    const response = await agent
      .post(`/api/messages`)
      .send({ room: room.id, message: "valid message" })
      .expect(201);

    const message = response.body.message;
    // delete sent message
    await agent.delete(`/api/messages/${message.id}`).expect(200);
    // check that message doesnt exist
    const secondResponse = await agent
      .get(`/api/chatrooms/${room.id}/messages`)
      .expect(200);

    expect(secondResponse.body.messages).toHaveLength(0);
  });
});
