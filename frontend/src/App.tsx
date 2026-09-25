import MessageList from "./components/messageList";
import Nav from "./components/Nav";
import MessageForm from "./components/messageForm";

const PLACEHOLDER_MESSAGES = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    chatroom_id: "550e8400-e29b-41d4-a716-446655440000",
    sender_id: "550e8400-e29b-41d4-a716-446655440010",
    content: "Hey everyone!",
    created_at: new Date("2026-09-25T16:45:00Z"),
    edited_at: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    chatroom_id: "550e8400-e29b-41d4-a716-446655440000",
    sender_id: "550e8400-e29b-41d4-a716-446655440011",
    content: "What's up?",
    created_at: new Date("2026-09-25T16:46:12Z"),
    edited_at: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    chatroom_id: "550e8400-e29b-41d4-a716-446655440000",
    sender_id: "550e8400-e29b-41d4-a716-446655440010",
    content: "Testing the messaging system.",
    created_at: new Date("2026-09-25T16:47:31Z"),
    edited_at: new Date("2026-09-25T16:48:05Z"),
  },
];

function App() {
  return (
    <div>
      <Nav></Nav>
      <MessageList messages={[]}></MessageList>
      <MessageForm></MessageForm>
    </div>
  );
}

export default App;
