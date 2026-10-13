import type { ServerEvent } from "./types";

type MessageCreatedEvent = Extract<ServerEvent, { type: "message.created" }>;

type MessageDeletedEvent = Extract<ServerEvent, { type: "message.deleted" }>;

//validation function
// returns ServerEvent
export function isMessageCreatedEvent(
  value: unknown
): MessageCreatedEvent | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  if (
    !("type" in value) || value.type !== "message.created" ||
    !("message" in value) || typeof value.message !== "object" || value.message === null ||
    !("chatroomId" in value) || typeof value.chatroomId != "string"
  ) {
    return null;
  }
  const message = value.message;
  if (
    !("id" in message) || typeof message.id !== "string" ||
    !("senderId" in message) || typeof message.senderId !== "string" ||
    !("content" in message) || typeof message.content !== "string" || message.content.length > 2000 ||
    !("createdAt" in message) || typeof message.createdAt !== "string" ||
    !("editedAt" in message) || !(message.editedAt === null || typeof message.editedAt === "string") ||
    !("username" in message) || typeof message.username !== "string"
  ) {
    return null;
  }
  return value as MessageCreatedEvent;
}

export function isMessageDeletedEvent(
  value: unknown
): MessageDeletedEvent | null {
  if (typeof value !== "object" || value === null) {
      return null;
  }
  if (
    !("type" in value) || value.type !== "message.deleted" ||
    !("chatroomId" in value) || typeof value.chatroomId !== "string" ||
    !("messageId" in value) || typeof value.messageId !== "string"
    ) {
      return null;
  }
  return value as MessageDeletedEvent;
}
