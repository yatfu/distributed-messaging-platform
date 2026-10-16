import { describe, expect, it } from "vitest";
import { validateString, validateUuid } from "./validate.js";

describe("validateString", () => {
  it("returns a trimmed non-empty string", () => {
    expect(validateString(" hello ")).toBe("hello");
  });

  it("rejects validating an empty string", () => {
    expect(() => validateString("")).toThrow();
  });

  it("rejects validating a non-string value", () => {
    expect(() => validateString(67)).toThrow();
  });

  it("rejects a string longer than the maximum length", () => {
    expect(() => validateString("hello", 4)).toThrow(
      "Value must contain at most 4 characters",
    );
  });
});

describe("validateUuid", () => {
  it("returns a string when it contains a valid UUID", () => {
    const id="550e8400-e29b-41d4-a716-446655440000";
    expect(validateUuid(id)).toBe(id);
  });
  it("rejects validating an invalid UUID", () => {
    expect(() => validateUuid("67")).toThrow();
  });
});
