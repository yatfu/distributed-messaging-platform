import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MessageForm from "../components/messageForm";
import MessageList from "../components/messageList";
import { getChatroom, getMessages, getCurrentUser } from "../lib/api";
import type { Chatroom, Message, User } from "../../../shared/types";

export default function ChatroomPage() {
  const { chatroomId } = useParams<{ chatroomId: string }>();

  if (!chatroomId) {
    return <p>Invalid chatroom URL</p>;
  }

  return <Chatroom key={chatroomId} chatroomId={chatroomId} />;
}

function Chatroom({ chatroomId }: { chatroomId: string }) {
  const [chatroom, setChatroom] = useState<Chatroom | null>(null);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [copyStatus, setCopyStatus] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadRoom() {
      try {
        const [loadedChatroom, loadedMessages, loadedUser] = await Promise.all([
          getChatroom(chatroomId),
          getMessages(chatroomId),
          getCurrentUser().catch(() => null),
        ]);

        setChatroom(loadedChatroom);
        setMessages(loadedMessages);
        setCurrentUser(loadedUser);
      } catch {
        setError("Could not load room or messages");
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

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopyStatus("Copied!");
    } catch {
      setCopyStatus("Could not copy link");
    }
  }

  return (
    <div>
      <h1>{chatroom.name}</h1>
      <p>{roomUrl}</p>
      <button type="button" onClick={() => void handleCopyLink()}>
        Copy link
      </button>
      {copyStatus && <p aria-live="polite">{copyStatus}</p>}
      <MessageList
        messages={messages}
        currentUser={currentUser}
        onMessageDeleted={(deletedMessageId) => {
          setMessages((currentMessages) =>
            currentMessages.filter((message) => message.id !== deletedMessageId)
          );
        }}
      />
      <MessageForm
        chatroomId={chatroom.id}
        onMessageCreated={(createdMessage) => {
          setMessages((currentMessages) => [
            ...currentMessages,
            createdMessage,
          ]);
        }}
      />
    </div>
  );
}
