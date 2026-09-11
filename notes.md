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



Client opens room
      ↓
Client checks local storage for this room’s token
      ↓
No token → POST /chatrooms/:chatroomId/users
      ↓
Server creates user and secret token
      ↓
Client stores userId and token
      ↓
Future requests send token

before 

CLIENT STORAGE DECISION:
chose http only cookies over local storage because local storage is vulnerable to xss

Raw token in browser cookie
          ↓
Server hashes incoming token
          ↓
Compare hash with token_hash in PostgreSQL

