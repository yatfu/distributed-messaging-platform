import { ApiError } from "./Errors";

//chatroom validation: accepts either chatroom or both chatroom and user id
export function validateChatroom(chatroomId: unknown, userId: unknown) {
  const validChatroomId = validateString(chatroomId, "chatroom");
  const validUserId = validateString(userId, "user");
  return {
    chatroomId: validChatroomId,
    userId: validUserId,
  };
}

export function validateString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ApiError(400, `${field} must be a non-empty string`);
  }

  return value.trim();
}
