import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import crypto from "node:crypto";
import app from "../app.js";
import { pool } from "../db.js";

const testApp = app as unknown as Parameters<typeof request>[0]; // workaround fix for typescript bug

beforeEach(async () => {
  // clear database before each test
  await pool.query("TRUNCATE messages, chatrooms, users CASCADE");
});

describe("GET /api/users/me", () => {
  it("returns 401 without a cookie", async () => {
    const res = await request(testApp).get("/api/users/me");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Authentication required");
  });

  it("returns 401 with invalid cookie", async () => {
    const res = await request(testApp)
      .get("/api/users/me")
      .set("Cookie", "sessionToken=invalid-token");
    expect(res.status).toBe(401);
  });

  it("returns 401 for expired user", async () => {
    const agent = request.agent(testApp);
    const created = await agent
      .post("/api/users/create")
      .send({ name: "Test User" })
      .expect(201);

    await pool.query(
      `UPDATE users
      SET expires_at = NOW() - INTERVAL '1 minute'
      WHERE id = $1`,
      [created.body.user.id],
    );
    await agent.get("/api/users/me").expect(401);
  });

  it("returns authenticated user", async () => {
    const agent = request.agent(testApp);

    const created = await agent
      .post("/api/users/create")
      .send({ name: "Test User" })
      .expect(201);

    const res = await agent.get("/api/users/me").expect(200);

    expect(res.body.user).toEqual({
      id: created.body.user.id,
      name: "Test User",
    });

    expect(res.body.user).not.toHaveProperty("token_hash"); // test if response exposes user token
  });
});

describe("POST /api/users/create", () => {
  it("rejects a missing name", async () => {
    const res = await request(testApp)
      .post("/api/users/create")
      .send({});
    expect(res.status).toBe(400);
  });

  it("rejects non-string name", async () => {
    const res = await request(testApp)
      .post("/api/users/create")
      .send({ name: 67 });
    expect(res.status).toBe(400);
  });

  it("rejects empty string name", async () => {
    const res = await request(testApp)
      .post("/api/users/create")
      .send({ name: " " });
    expect(res.status).toBe(400);
  });

  it("rejects names longer than 20 chars", async () => {
    const res = await request(testApp)
      .post("/api/users/create")
      .send({ name: "abcdefghijklmnopqrstuvwxyz" });
    expect(res.status).toBe(400);
  });

  it("trims name", async () => {
    const res = await request(testApp)
      .post("/api/users/create")
      .send({ name: " Test User " });
    expect(res.status).toBe(201);
    expect(res.body.user.name).toBe("Test User");
  });

  it("creates a user and sets a cookie", async () => {
    // only checks if a cookie was set, no additional checks on cookie itself
    const res = await request(testApp)
      .post("/api/users/create")
      .send({ name: "Test User" });
    expect(res.status).toBe(201);

    const cookies = res.headers["set-cookie"]; // checks cookie existence
    expect(cookies).toBeDefined();
  });
});
