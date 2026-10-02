import { ApiError } from "./Errors.js";
import { validate as isUuid } from "uuid";

//chatroom validation: accepts either chatroom or both chatroom and user id
export function validateString(
  value: unknown,
  field: string,
  maxLength?: number,
): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ApiError(400, `${field} must be a non-empty string`);
  }

  const trimmedValue = value.trim();

  if (maxLength !== undefined && trimmedValue.length > maxLength) {
    throw new ApiError(
      400,
      `${field} must contain at most ${maxLength} characters`,
    );
  }

  return trimmedValue;
}

export function validateUuid(value: unknown,field: string): string {
  const validString = validateString(value, field);

  if (!isUuid(validString)) {
    throw new ApiError(400, `${field} must be a valid UUID`);
  }

  return validString;
}
