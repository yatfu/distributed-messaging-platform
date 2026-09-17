import { describe, expect, it } from "vitest";
import { validateString, validateUuid } from "./validate.js";

describe("validateString", () => {
  it("returns a trimmed string", () => {
    expect(validateString(" hello ","message with trailing spaces")).toBe("hello");
  });

  it("rejects an empty string", () => {
    expect(() => validateString("", "empty message")).toThrow();
  });

  it("rejects a non string", () => {
    expect(() => validateString(67, "non-string message")).toThrow();
  });
});

describe("validateUuid", () => {
  it("returns a valid UUID", () => {
    const id="550e8400-e29b-41d4-a716-446655440000";
    expect(validateUuid(id, "valid-uuid")).toBe(id);
  });
  it("rejects an invalid UUID", () => {
    expect(() => validateUuid("67", "invalid-uuid")).toThrow();
  });
});