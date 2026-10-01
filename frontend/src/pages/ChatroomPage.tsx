import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MessageForm from "../components/messageForm";
import MessageList from "../components/messageList";
import { getChatroom, getMessages, getCurrentUser } from "../lib/api";
import type { Chatroom, Message, User } from "../lib/types";

export default function ChatroomPage() {
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const [chatroom, setChatroom] = useState<Chatroom | null>(null);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [copyStatus, setCopyStatus] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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
    //load user if exists in cookies
    async function loadCurrentUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      }
    }

    void loadCurrentUser();

    const validChatroomId = chatroomId; // converts typescript type from string | null to string

    //load chatroom and messages, then update state
    async function loadRoom() {
      try {
        const loadedChatroom = await getChatroom(validChatroomId);
        console.log("chatroom loaded");

        const loadedMessages = await getMessages(validChatroomId);
        console.log("messages loaded");

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
