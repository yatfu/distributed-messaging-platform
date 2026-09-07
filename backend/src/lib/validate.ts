import { ApiError } from "./Errors";

//validation: accepts either chatroom or both chatroom and user id
export default function validate(chatroomId: unknown, userId?: unknown) {
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