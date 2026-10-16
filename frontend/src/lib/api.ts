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

const API_URL = import.meta.env.VITE_API_URL;
export const MAX_MESSAGE_LENGTH = 2000;

export async function createChatroom(name: string): Promise<Chatroom> {
  //validate input
  if (typeof name !== "string" || name.trim() === "" || name.length > 50) {
    throw new Error("Name must be a non-empty string of character length < 50");
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
    !("createdAt" in data) ||
    typeof data.createdAt !== "string" ||
    !("expiresAt" in data) ||
    typeof data.expiresAt !== "string"
  ) {
    throw new Error("Invalid chatroom response");
  }
  return {
    id: data.id,
    name: data.name,
    createdAt: data.createdAt,
    expiresAt: data.expiresAt,
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
  const response = await fetch(`${API_URL}/api/users/me`, {
    credentials: "include",
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

export async function getChatroom(chatroomId: string): Promise<Chatroom> {
  if (typeof chatroomId !== "string" || chatroomId.trim() === "") {
    throw new Error("chatroomId must be a non-empty string");
  }

  const response = await fetch(
    `${API_URL}/api/chatrooms/${encodeURIComponent(chatroomId)}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data: unknown = await response.json();

  if (
    typeof data !== "object" ||
    data === null ||
    !("chatroom" in data) ||
    typeof data.chatroom !== "object" ||
    data.chatroom === null ||
    !("id" in data.chatroom) ||
    typeof data.chatroom.id !== "string" ||
    !("name" in data.chatroom) ||
    typeof data.chatroom.name !== "string" ||
    !("createdAt" in data.chatroom) ||
    typeof data.chatroom.createdAt !== "string" ||
    !("expiresAt" in data.chatroom) ||
    typeof data.chatroom.expiresAt !== "string"
  ) {
    throw new Error("Invalid chatroom response");
  }

  return {
    id: data.chatroom.id,
    name: data.chatroom.name,
    createdAt: data.chatroom.createdAt,
    expiresAt: data.chatroom.expiresAt,
  };
}

export async function getMessages(chatroomId: string): Promise<Message[]> {
  if (typeof chatroomId !== "string" || chatroomId.trim() === "") {
    throw new Error("chatroomId must be a non-empty string");
  }

  const response = await fetch(
    `${API_URL}/api/chatrooms/${encodeURIComponent(chatroomId)}/messages`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data: unknown = await response.json();

  if (
    typeof data !== "object" ||
    data === null ||
    !("messages" in data) ||
    !Array.isArray(data.messages)
  ) {
    throw new Error("Invalid messages response");
  }

  return data.messages.map((message: unknown) => {
    if (
      typeof message !== "object" ||
      message === null ||
      !("id" in message) ||
      typeof message.id !== "string" ||
      !("senderId" in message) ||
      typeof message.senderId !== "string" ||
      !("content" in message) ||
      typeof message.content !== "string" ||
      !("createdAt" in message) ||
      typeof message.createdAt !== "string" ||
      !("editedAt" in message) ||
      (message.editedAt !== null && typeof message.editedAt !== "string") ||
      !("username" in message) ||
      typeof message.username !== "string"
    ) {
      throw new Error("Invalid message response");
    }

    return {
      id: message.id,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt,
      editedAt: message.editedAt,
      username: message.username,
    };
  });
}

export async function createMessage(
  chatroomId: string,
  content: string
): Promise<Message> {
  //validate input
  if (typeof chatroomId !== "string" || chatroomId.trim() === "") {
    throw new Error("chatroomId needs to be non-empty string");
  }
  if (typeof content !== "string" || content.trim() === "") {
    throw new Error("Message must be a non-empty string");
  }

  const trimmedContent = content.trim();

  if (trimmedContent.length > MAX_MESSAGE_LENGTH) {
    throw new Error(
      `Message must contain at most ${MAX_MESSAGE_LENGTH} characters`,
    );
  }
  //calll endpoint
  const response = await fetch(`${API_URL}/api/messages/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      room: chatroomId,
      message: trimmedContent,
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
    !("message" in data) ||
    typeof data.message !== "object" ||
    data.message === null ||
    !("id" in data.message) ||
    typeof data.message.id !== "string" ||
    !("senderId" in data.message) ||
    typeof data.message.senderId !== "string" ||
    !("content" in data.message) ||
    typeof data.message.content !== "string" ||
    !("createdAt" in data.message) ||
    typeof data.message.createdAt !== "string" ||
    !("editedAt" in data.message) ||
    (data.message.editedAt !== null &&
      typeof data.message.editedAt !== "string") ||
    !("username" in data.message) ||
    typeof data.message.username !== "string"
  ) {
    throw new Error("Invalid response from messages");
  }

  return {
    id: data.message.id,
    senderId: data.message.senderId,
    content: data.message.content,
    createdAt: data.message.createdAt,
    editedAt: data.message.editedAt,
    username: data.message.username,
  };
}

export async function deleteMessage(messageId: string): Promise<Message> {
  if (typeof messageId !== "string" || messageId.trim() === "") {
    throw new Error("messageId must be a non-empty string");
  }

  const response = await fetch(
    `${API_URL}/api/messages/${encodeURIComponent(messageId)}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data: unknown = await response.json();

  if (
    typeof data !== "object" ||
    data === null ||
    !("message" in data) ||
    typeof data.message !== "object" ||
    data.message === null ||
    !("id" in data.message) ||
    typeof data.message.id !== "string" ||
    !("senderId" in data.message) ||
    typeof data.message.senderId !== "string" ||
    !("content" in data.message) ||
    typeof data.message.content !== "string" ||
    !("createdAt" in data.message) ||
    typeof data.message.createdAt !== "string" ||
    !("editedAt" in data.message) ||
    (data.message.editedAt !== null &&
      typeof data.message.editedAt !== "string") ||
    !("username" in data.message) ||
    typeof data.message.username !== "string"
  ) {
    throw new Error("Invalid deleted message response");
  }

  return {
    id: data.message.id,
    senderId: data.message.senderId,
    content: data.message.content,
    createdAt: data.message.createdAt,
    editedAt: data.message.editedAt,
    username: data.message.username,
  };
}

export async function deleteChatroom(chatroomId: string): Promise<void> {
  if (typeof chatroomId !== "string" || chatroomId.trim() === "") {
    throw new Error("chatroomId must be a non-empty string");
  }

  const response = await fetch(
    `${API_URL}/api/chatrooms/${encodeURIComponent(chatroomId)}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
}
