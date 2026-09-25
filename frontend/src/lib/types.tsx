export type Message = {
  id: string;
  chatroomId: string;
  senderId: string;
  content: string;
  createdAt: string;
  editedAt: string | null;
}

export type User = {
  id: string;
  name: string;
};

export type Chatroom = {
  id: string;
  name: string;
  createdAt: string;
  expiresAt: string;
};