import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MessageForm from "../components/messageForm";
import MessageList from "../components/messageList";
import { getChatroom, getMessages } from "../lib/api";
import type { Chatroom, Message } from "../lib/types";

export default function ChatroomPage() {
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const [chatroom, setChatroom] = useState<Chatroom | null>(null);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  
  // ON CHATROOM CHANGE:
  //reset state
  //validate new chatroomId parameter
  //load chatroom
  //load messages if chatroom succeeds
  //update state
  //throw error on failure
  
  useEffect(() => {
    // reset state
    setChatroom(null);
    setMessages([]);
    setError("");

    //validate parameter
    if (!chatroomId) {
      setError("Invalid chatroom URL");
      return;
    }

    const validChatroomId = chatroomId; // converts typescript type from string | null to string
    
    //load chatroom and messages, then update state
    async function loadRoom() {
      try {
        const loadedChatroom =
          await getChatroom(validChatroomId);
    
        const loadedMessages =
          await getMessages(validChatroomId);
    
        setChatroom(loadedChatroom);
        setMessages(loadedMessages);
      } catch {
        setError("Could not load room/messages");
      }
    }

    void loadRoom();
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
      <MessageList messages={messages} />
      <MessageForm chatroomId={chatroom.id}/>
    </div>
  );
}