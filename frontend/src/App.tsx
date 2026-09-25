import MessageList from "./components/messageList";
import Nav from "./components/Nav";
import MessageForm from "./components/messageForm";

const PLACEHOLDER_MESSAGES = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    chatroomId: "550e8400-e29b-41d4-a716-446655440000",
    senderId: "550e8400-e29b-41d4-a716-446655440010",
    content: "Hey everyone!",
    createdAt: new Date("2026-09-25T16:45:00Z"),
    editedAt: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    chatroomId: "550e8400-e29b-41d4-a716-446655440000",
    senderId: "550e8400-e29b-41d4-a716-446655440011",
    content: "What's up?",
    createdAt: new Date("2026-09-25T16:46:12Z"),
    editedAt: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    chatroomId: "550e8400-e29b-41d4-a716-446655440000",
    senderId: "550e8400-e29b-41d4-a716-446655440010",
    content: "Testing the messaging system.",
    createdAt: new Date("2026-09-25T16:47:31Z"),
    editedAt: new Date("2026-09-25T16:48:05Z"),
  },
];

function App() {
  return (
    <div>
      <Nav></Nav>
      <MessageList messages={PLACEHOLDER_MESSAGES}></MessageList>
      <MessageForm></MessageForm>
    </div>
  );
}

export default App;
