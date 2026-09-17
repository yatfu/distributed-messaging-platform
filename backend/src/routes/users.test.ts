import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("GET /api/users/me", () => {
  it("returns 401 without a cookie", async () => {
    const res = await request(
      app as unknown as Parameters<typeof request>[0] // workaround fix for typescript bug
    ).get("/api/users/me");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Authentication required");
  });

  it("returns authenticated user", async () => {
    const agent = request.agent(
      app as unknown as Parameters<typeof request>[0]
    ); // workaround fix for typescript bug

    const created = await agent
      .post("/api/users/create")
      .send({ name: "Test User" })
      .expect(201);

    const res = await agent.get("/api/users/me").expect(200);

    expect(res.body.user).toEqual({
      id: created.body.user.id,
      name: "Test User",
    });
  });
});
