import { ApiError } from "./Errors";

//chatroom validation: accepts either chatroom or both chatroom and user id
export function validateChatroom(chatroomId: unknown, userId?: unknown) {
  if (
    typeof chatroomId !== "string" ||
    chatroomId.trim() === ""
  ) {
    throw new ApiError(400, "Authentication failed: invalid chatroomId");
  }
  if (
    userId !== undefined && 
    (typeof userId !== "string" || userId.trim() === "")
    ) {
      throw new ApiError(400, "Authentication failed: invalid userId");
  }
}

//user validation for editing messages
export function validateUser(creatorId: unknown, editorId: unknown) {
  return true;
}