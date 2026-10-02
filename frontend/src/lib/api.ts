import type { Chatroom, Message, User } from "../../../shared/types";

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
    !("created_at" in data.chatroom) ||
    typeof data.chatroom.created_at !== "string" ||
    !("expires_at" in data.chatroom) ||
    typeof data.chatroom.expires_at !== "string"
  ) {
    throw new Error("Invalid chatroom response");
  }

  return {
    id: data.chatroom.id,
    name: data.chatroom.name,
    createdAt: data.chatroom.created_at,
    expiresAt: data.chatroom.expires_at,
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
      !("sender_id" in message) ||
      typeof message.sender_id !== "string" ||
      !("content" in message) ||
      typeof message.content !== "string" ||
      !("created_at" in message) ||
      typeof message.created_at !== "string" ||
      !("edited_at" in message) ||
      (message.edited_at !== null && typeof message.edited_at !== "string") ||
      !("username" in message) ||
      typeof message.username !== "string"
    ) {
      throw new Error("Invalid message response");
    }

    return {
      id: message.id,
      senderId: message.sender_id,
      content: message.content,
      createdAt: message.created_at,
      editedAt: message.edited_at,
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
    !("sender_id" in data.message) ||
    typeof data.message.sender_id !== "string" ||
    !("content" in data.message) ||
    typeof data.message.content !== "string" ||
    !("created_at" in data.message) ||
    typeof data.message.created_at !== "string" ||
    !("edited_at" in data.message) ||
    (data.message.edited_at !== null &&
      typeof data.message.edited_at !== "string") ||
    !("username" in data.message) ||
    typeof data.message.username !== "string"
  ) {
    throw new Error("Invalid response from messages");
  }

  return {
    id: data.message.id,
    senderId: data.message.sender_id,
    content: data.message.content,
    createdAt: data.message.created_at,
    editedAt: data.message.edited_at,
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
    !("sender_id" in data.message) ||
    typeof data.message.sender_id !== "string" ||
    !("content" in data.message) ||
    typeof data.message.content !== "string" ||
    !("created_at" in data.message) ||
    typeof data.message.created_at !== "string" ||
    !("edited_at" in data.message) ||
    (data.message.edited_at !== null &&
      typeof data.message.edited_at !== "string") ||
    !("username" in data.message) ||
    typeof data.message.username !== "string"
  ) {
    throw new Error("Invalid deleted message response");
  }

  return {
    id: data.message.id,
    senderId: data.message.sender_id,
    content: data.message.content,
    createdAt: data.message.created_at,
    editedAt: data.message.edited_at,
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
