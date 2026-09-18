import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import { pool } from "../db.js";
import crypto from "node:crypto";

const testApp = app as unknown as Parameters<typeof request>[0];

beforeEach(async () => {
  await pool.query("TRUNCATE messages, chatrooms, users CASCADE");
});

async function createTestRoom() {
  const agent = request.agent(testApp);

  await agent.post("/api/users/create").send({ name: "Test User" }).expect(201);

  const response = await agent
    .post("/api/chatrooms")
    .send({ name: "Test Room" })
    .expect(201);

  return {
    agent,
    room: response.body,
  };
}

describe("POST /api/chatrooms", () => {
  it("rejects creating a chatroom without authentication", async () => {
    await request(testApp)
      .post("/api/chatrooms")
      .send({ name: "Test Room" })
      .expect(401);
  });

  it("creates a chatroom for an authenticated user", async () => {
    const { room } = await createTestRoom();

    expect(room.name).toBe("Test Room");
    expect(room.id).toBeDefined();
  });

  it("uses a default name when creating a chatroom without a name", async () => {
    const agent = request.agent(testApp);
    await agent
      .post("/api/users/create")
      .send({ name: "Test User" })
      .expect(201);

    const response = await agent.post("/api/chatrooms").send({}).expect(201);

    expect(response.body.name).toBe("Chatroom");
  });
});

describe("GET /api/chatrooms/:chatroomId", () => {
  it("returns an existing chatroom", async () => {
    const { room } = await createTestRoom();

    const response = await request(testApp)
      .get(`/api/chatrooms/${room.id}`)
      .expect(200);

    expect(response.body.chatroom.name).toBe("Test Room");
  });

  it("rejects getting a chatroom with an invalid UUID", async () => {
    await request(testApp).get("/api/chatrooms/not-a-uuid").expect(400);
  });

  it("rejects getting an expired chatroom", async () => {
    const { room } = await createTestRoom();

    await pool.query(
      `UPDATE chatrooms
       SET expires_at = NOW() - INTERVAL '1 minute'
       WHERE id = $1`,
      [room.id],
    );

    await request(testApp)
      .get(`/api/chatrooms/${room.id}`)
      .expect(404);
  });
  it("rejects getting a nonexistent chatroom", async () => {
    const roomId = crypto.randomUUID();
    await request(testApp)
      .get(`/api/chatrooms/${roomId}`)
      .expect(404);
  });
});

describe("DELETE /api/chatrooms/:chatroomId", () => {
  it("allows the owner to delete a chatroom", async () => {
    const { agent, room } = await createTestRoom();

    await agent.delete(`/api/chatrooms/${room.id}`).expect(204);
  });

  it("rejects deleting a chatroom owned by another user", async () => {
    const { room } = await createTestRoom();

    const otherUser = request.agent(testApp);

    await otherUser
      .post("/api/users/create")
      .send({ name: "Other User" })
      .expect(201);

    await otherUser.delete(`/api/chatrooms/${room.id}`).expect(404);
  });

  it("rejects deleting a chatroom without authentication", async () => {
    const chatroomId = crypto.randomUUID();
    await request(testApp).delete(`/api/chatrooms/${chatroomId}`).expect(401);
  });
  it("rejects deleting a chatroom with an invalid UUID", async () => {
    const chatroomId = "invalid id";
    await request(testApp).delete(`/api/chatrooms/${chatroomId}`).expect(400);
  })
});
