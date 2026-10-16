import { ApiError } from "./Errors.js";
import { validate as isUuid } from "uuid";

//chatroom validation: accepts either chatroom or both chatroom and user id
export function validateString(
  value: unknown,
  maxLength?: number,
): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ApiError(400, "Value must be a non-empty string");
  }

  const trimmedValue = value.trim();

  if (maxLength !== undefined && trimmedValue.length > maxLength) {
    throw new ApiError(
      400,
      `Value must contain at most ${maxLength} characters`,
    );
  }

  return trimmedValue;
}

export function validateUuid(value: unknown): string {
  const validString = validateString(value);

  if (!isUuid(validString)) {
    throw new ApiError(400, "Value must be a valid UUID");
  }

  return validString;
}
