import { useParams } from "react-router-dom";
import MessageForm from "../components/messageForm";
import MessageList from "../components/messageList";

export default function ChatroomPage() {
  const { chatroomId } = useParams<{
    chatroomId: string;
  }>();

  if (!chatroomId) {
    return <p>Invalid chatroom URL</p>;
  }

  return (
    <div>
      <p>Room: {chatroomId}</p>
      <MessageList messages={PLACEHOLDER_MESSAGES} />
      <MessageForm chatroomId={chatroomId}/>
    </div>
  );
}

const PLACEHOLDER_MESSAGES = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    chatroomId: "550e8400-e29b-41d4-a716-446655440000",
    senderId: "550e8400-e29b-41d4-a716-446655440010",
    content: "Hey everyone!",
    createdAt: "2026-09-25T16:45:00Z",
    editedAt: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    chatroomId: "550e8400-e29b-41d4-a716-446655440000",
    senderId: "550e8400-e29b-41d4-a716-446655440011",
    content: "What's up?",
    createdAt: "2026-09-25T16:46:12Z",
    editedAt: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    chatroomId: "550e8400-e29b-41d4-a716-446655440000",
    senderId: "550e8400-e29b-41d4-a716-446655440010",
    content: "Testing the messaging system.",
    createdAt: "2026-09-25T16:47:31Z",
    editedAt: "2026-09-25T16:48:05Z",
  },
];
