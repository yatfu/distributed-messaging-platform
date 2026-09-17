import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import { pool } from "../db.js";

const testApp =
  app as unknown as Parameters<typeof request>[0];

beforeEach(async () => {
  await pool.query(
    "TRUNCATE messages, chatrooms, users CASCADE",
  );
});

async function createUserAndRoom() {
  const agent = request.agent(testApp);

  await agent
    .post("/api/users/create")
    .send({ name: "Test User" })
    .expect(201);

  const response = await agent
    .post("/api/chatrooms")
    .send({ name: "Test Room" })
    .expect(201);

  return {
    agent,
    room: response.body,
  };
}

describe("Chatroom endpoints", () => {
  it("rejects unauthenticated room creation", async () => {
    await request(testApp)
      .post("/api/chatrooms")
      .send({ name: "Test Room" })
      .expect(401);
  });

  it("creates a chatroom", async () => {
    const { room } = await createUserAndRoom();

    expect(room.name).toBe("Test Room");
    expect(room.id).toBeDefined();
  });

  it("retrieves a chatroom", async () => {
    const { room } = await createUserAndRoom();

    const response = await request(testApp)
      .get(`/api/chatrooms/${room.id}`)
      .expect(200);

    expect(response.body.chatroom.name).toBe("Test Room");
  });

  it("rejects an invalid chatroom UUID", async () => {
    await request(testApp)
      .get("/api/chatrooms/not-a-uuid")
      .expect(400);
  });

  it("allows the owner to delete the room", async () => {
    const { agent, room } = await createUserAndRoom();

    await agent
      .delete(`/api/chatrooms/${room.id}`)
      .expect(204);
  });

  it("prevents another user from deleting the room", async () => {
    const { room } = await createUserAndRoom();

    const otherUser = request.agent(testApp);

    await otherUser
      .post("/api/users/create")
      .send({ name: "Other User" })
      .expect(201);

    await otherUser
      .delete(`/api/chatrooms/${room.id}`)
      .expect(404);
  });
});