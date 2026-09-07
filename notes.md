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

  docker exec -it distributed-messaging-platform-database-1 psql -U myuser -d myapp

  API DESIGN
  idempotent: have post handlers require post request id to prevent dupes, same with patch
  pagination: limit amount of data being sent per request.


user loads chatroom -> authentication -> get all messages request handled -> 

