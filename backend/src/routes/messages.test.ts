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
    room: roomResponse.body,
  };
}
describe("Message endpoints", () => {
  it("creates a message", async () => {
    const { agent, room } = await setupRoom();

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
    const { room } = await setupRoom();

    await request(testApp)
      .post("/api/messages")
      .send({
        room: room.id,
        message: "Hello",
      })
      .expect(401);
  });

  it("retrieves chatroom messages", async () => {
    const { agent, room } = await setupRoom();

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

  it("allows the sender to delete a message", async () => {
    const { agent, room } = await setupRoom();

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
    const { agent, room } = await setupRoom();

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
});
