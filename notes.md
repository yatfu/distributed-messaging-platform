database schema: no users, instead a temp uuid stored client side
chatroom:
  id: primary key
  adminId: 
  name: string
  createdAt: date
  expiresAt: date

message:
  id: primary key
  senderId: 
  chatroomId: foreign key
  content: 
  createdAt:

