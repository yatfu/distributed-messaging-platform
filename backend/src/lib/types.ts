export type Message = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  editedAt: string | null;
  username: string;
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
    };