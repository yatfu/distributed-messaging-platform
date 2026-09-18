PLAN
finish message api:
MVP user story:
as a user i want to create chatrooms so i can create a place to privately communicate with other people.
as a user i want to delete a chatroom, and all messages with it, when i want so i can confidently keep my conversations private.
as a user i want to join a chatroom so that i can view messages within the chatroom.
as a user i want to create messages within a chatroom so i can communicate with other room members.
as a user i want to delete messages so i can undo messages i regret sending.
as a user i want to edit messages i created so i can fix errors and dont have to delete/resend messages to do so.

user stories
as a chatroom creator i want to see who accessed my chatroom and its messages so I know who accessed it, not for identification but for verification
as a user i want to

NOTES
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

200: succeeded, 201: created: 202: accepted. 204: no content

const tokenHash = crypto.createHash("sha256") // creates the hashing operation, not the hash
.update(token) // provides session token as input
.digest("hex"); // converts hash into format allowed by text variable in users SQL table

***** INSERT only after SELECT finds matching value
INSERT into MESSAGES (id, chatroom_id, sender_id, content)
SELECT ($1, id, $3, $4)
FROM chatrooms
WHERE id = $2
      AND expires_at > NOW();


ENDPOINT Checklist
POST   /api/users/create
GET    /api/users/me
POST   /api/users/logout

POST   /api/chatrooms
GET    /api/chatrooms/:chatroomId
DELETE /api/chatrooms/:chatroomId

POST   /api/messages
GET    /api/chatrooms/:chatroomId/messages
DELETE /api/messages/:messageId

GET    /api/health

USING VITEST for automated testing
Unit tests
- validateString() trims valid strings.
- Rejects empty or whitespace-only strings.
- Rejects non-string values.
- validateUuid() accepts valid UUIDs.
- Rejects invalid UUIDs.
User endpoints
- Creating a user returns 201.
- Creating a user sets the sessionToken cookie.
- Rejects missing, empty, or overly long names.
- /users/me returns the authenticated user.
- /users/me returns 401 without a cookie.
- Rejects an invalid or expired token.
Chatroom endpoints
- Authenticated user can create a room.
- Creating a room without a name uses "Chatroom".
- Unauthenticated user cannot create a room.
- Valid room can be retrieved.
- Missing, invalid, or expired room is rejected.
- Owner can delete their room.
- Another user cannot delete the room.
Message endpoints
- Authenticated user can create a message in an active room.
- Rejects missing or empty content.
- Rejects invalid chatroom UUID.
- Rejects missing or expired chatroom.
- Unauthenticated user cannot create a message.
- Messages can be retrieved from an active room.
- Sender can delete their message.
- Another user cannot delete the message.
- Invalid or missing message ID is rejected.
Error handling
- Invalid input returns 400.
- Missing or invalid authentication returns 401.
- Missing resources return 404.
- Unexpected database errors return 500 without exposing internal details.