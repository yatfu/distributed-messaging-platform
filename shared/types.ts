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

export type Chatroom = {
  id: string;
  name: string;
  createdAt: string;
  expiresAt: string;
};

//websocket types
export type ServerEvent = 
  | { // each | is one of the types a server event can be
    type: "message.created";
    chatroomId: string;
    message: Message;
  }
  | {
    type: "message.deleted";
    chatroomId: string; // chatroom is needed not for backend validation but for routing
    messageId: string;  // choosing which users to broadcast to
  }
  | {
    type: "message.edited";
    chatroomId: string;
    message: Message; // message object used because its easier to replace message with same id
  }