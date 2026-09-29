import type { Chatroom, Message, User } from "./types";

/** API GUIDELINES
 * validate input
 * call endpoint
 *    include cookies/JSON when needed
 * check status
 * parse JSON
 * validate response
 * return only whats needed
 * handle errors
 */

const API_URL = import.meta.env.API_URL;

export async function createChatroom(name: string): Promise<Chatroom> {
  //validate input
  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("Name must be a non-empty string");
  }
  //call endpoint
  const response = await fetch(`${API_URL}/api/chatrooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name: name.trim(),
    }),
  });
  //check status
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  //parse json
  const data: unknown = await response.json();
  //validate response
  if (
    typeof data !== "object" ||
    data === null ||
    !("id" in data) ||
    typeof data.id !== "string" ||
    !("name" in data) ||
    typeof data.name !== "string" ||
    !("created_at" in data) ||
    typeof data.created_at !== "string" ||
    !("expires_at" in data) ||
    typeof data.expires_at !== "string"
  ) {
    throw new Error("Invalid chatroom response");
  }
  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
    expiresAt: data.expires_at,
  };
}

export async function createUser(name: string): Promise<User> {
  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("Name must be a non-empty string");
  }

  const response = await fetch(`${API_URL}/api/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name: name.trim(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data: unknown = await response.json();

  if (
    typeof data !== "object" ||
    data === null ||
    !("user" in data) ||
    typeof data.user !== "object" ||
    data.user === null ||
    !("id" in data.user) ||
    typeof data.user.id !== "string" ||
    !("name" in data.user) ||
    typeof data.user.name !== "string"
  ) {
    throw new Error("Invalid user response");
  }

  return {
    id: data.user.id,
    name: data.user.name,
  };
}

export async function getCurrentUser(): Promise<User> {
  throw new Error("Not implemented");
}

export async function getChatroom(chatroomId: string): Promise<Chatroom> {
  void chatroomId;
  throw new Error("Not implemented");
}

export async function getMessages(chatroomId: string): Promise<Message[]> {
  void chatroomId;
  throw new Error("Not implemented");
}

export async function createMessage(
  chatroomId: string,
  content: string,
  senderId: string,
): Promise<Message> {
  //validate input
  if (typeof chatroomId !== "string" || chatroomId.trim() === "") {
    throw new Error("chatroomId needs to be non-empty string");
  }
  if (typeof content !== "string") {
    throw new Error("chatroomId needs to be a string");
  }
  //calll endpoint
  const response = await fetch(`${API_URL}/api/messages/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      chatroomId: chatroomId,
      content: content,
      senderId: senderId,
    }),
  });
  //check status
  if (!response.ok) {
    throw new Error("response not ok");
  }
  //parse json
  const data: unknown = await response.json();
  //validate response
  if (
    typeof data !== "object" ||
    data === null ||
    !("id" in data) ||
    typeof data.id !== "string" ||
    !("chatroom_id" in data) ||
    typeof data.chatroom_id !== "string" ||
    !("sender_id" in data) ||
    typeof data.sender_id !== "string" ||
    !("content" in data) ||
    typeof data.content !== "string" ||
    !("created_at" in data) ||
    typeof data.created_at !== "string" ||
    !("expires_at" in data)
  ) {
    throw new Error("invalid response from messages");
  }
  return {
    id: data.id,
    chatroomId: data.chatroom_id,
    senderId: data.sender_id,
    content: data.content,
    createdAt: data.created_at,
    editedAt: null,
  };
}

export async function deleteMessage(messageId: string): Promise<Message> {
  void messageId;
  throw new Error("Not implemented");
}

export async function deleteChatroom(chatroomId: string): Promise<void> {
  void chatroomId;
  throw new Error("Not implemented");
}
