import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MessageForm from "../components/messageForm";
import MessageList from "../components/messageList";
import { getChatroom } from "../lib/api";
import type { Chatroom } from "../lib/types";

export default function ChatroomPage() {
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const [chatroom, setChatroom] = useState<Chatroom | null>(null);
  const [error, setError] = useState("");
  
  useEffect(() => {
    if (!chatroomId) {
      setError("Invalid chatroom URL");
      return;
    }
  
    const validChatroomId = chatroomId; // to pass validation from string | null to string
  
    async function loadChatroom() {
      try {
        const chatroom = await getChatroom(validChatroomId);
        setChatroom(chatroom);
      } catch {
        setError("Chatroom not found or expired");
      }
    }
  
    void loadChatroom();
  }, [chatroomId]);

  //conditional render
  if (error) {
    return <p>{error}</p>;
  }

  if (!chatroom) {
    return <p>Loading...</p>;
  }

  const roomUrl = `${window.location.origin}/chatrooms/${chatroom.id}`;

  return (
    <div>
      <p>Room: {chatroom.id}</p>
      <p>URL: {roomUrl}</p>
      <MessageList messages={PLACEHOLDER_MESSAGES} />
      <MessageForm chatroomId={chatroom.id}/>
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
