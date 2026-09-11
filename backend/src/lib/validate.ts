import { ApiError } from "./Errors";
import { validate as isUuid } from "uuid";

//chatroom validation: accepts either chatroom or both chatroom and user id
export function validateString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ApiError(400, `${field} must be a non-empty string`);
  }

  return value.trim();
}

export function validateUuid(value: unknown,field: string): string {
  const validString = validateString(value, field);

  if (!isUuid(validString)) {
    throw new ApiError(400, `${field} must be a valid UUID`);
  }

  return validString;
}

export function validateChatroom(chatroomId: unknown, userId: unknown) {
  const validChatroomId = validateString(chatroomId, "chatroom");
  const validUserId = validateString(userId, "user");
  return {
    chatroomId: validChatroomId,
    userId: validUserId,
  };
}
