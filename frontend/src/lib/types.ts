export type Message = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  editedAt: string | null;
  username: string;
};

export type User = {
  id: string;
  name: string;
};

export type ServerEvent =
  | {
      type: "message.created";
      chatroomId: string;
      message: Message;
    }
  | {
      type: "message.deleted";
      chatroomId: string;
      messageId: string;
    }
  | {
      type: "user.joined";
      chatroomId: string;
      user: User;
    }
  | {
      type: "user.left";
      chatroomId: string;
      user: User;
    };

export type Chatroom = {
  id: string;
  name: string;
  createdAt: string;
  expiresAt: string;
};
