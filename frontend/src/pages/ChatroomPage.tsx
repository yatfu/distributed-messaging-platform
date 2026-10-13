import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import MessageForm from "../components/messageForm";
import MessageList from "../components/messageList";
import { getChatroom, getMessages, getCurrentUser } from "../lib/api";
import type { ServerEvent, Chatroom, Message, User } from "../lib/types";
import {
  isMessageCreatedEvent,
  isMessageDeletedEvent,
} from "../lib/validation";

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
  // useRef: value that persists across renders, doesnt trigger rerender when changed
  const initialLoadingRef = useRef(false); // used to execute websocket after http loading completes
  const validatedWebSocketEvents = useRef<ServerEvent[]>([]); // buffer for websocket events that occur before http loading completes

  // load room
  useEffect(() => {
    async function loadRoom() {
      try {
        const [loadedChatroom, loadedMessages, loadedUser] = await Promise.all([ // Promise.all only passes if all pass
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
  }, [chatroomId]); // chatroomId is required in case component is rerendered without remounting

  // open websocket
  useEffect(() => {
    const url = new URL("/ws", import.meta.env.VITE_API_URL);

    // generate url for websocket to connect to backend
    if (url.protocol === "https:") {
      url.protocol = "wss:"; // https => secure websocket
    } else {
      url.protocol = "ws:"; // http => regular websocket
    }
    url.searchParams.set("chatroomId", chatroomId);
    // connect socket
    const socket = new WebSocket(url);
    // on socket open
    socket.onopen = () => {
      console.log("WebSocket connected");
    };
    // on message
    socket.onmessage = (event) => {
      const data: unknown = JSON.parse(event.data);
      setMessages((currentMessages) =>
        handleServerEvent(currentMessages, data, chatroomId)
      );
    };

    //close socket
    return function () {
      socket.close();
    };
  }, [chatroomId]); // chatroomId is required in case component is rerendered without remounting

  //conditional render
  if (error) {
    return <p>{error}</p>;
  }

  if (!chatroom) {
    return <p>Loading...</p>;
  }

  const roomUrl = `${window.location.origin}/chatrooms/${chatroom.id}`;

  //copy link handler
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
          if (
            // filters messages for the created message to see if its already created, since every create sends two duplicate update requests
            // sending requests from all sources is the conventional approach
            messages.filter((message) => message.id === createdMessage.id)
              .length > 0
          ) {
            setMessages((currentMessages) => [
              ...currentMessages,
              createdMessage,
            ]);
          }
        }}
      />
    </div>
  );
}

// Apply one WebSocket event to a message array.
function handleServerEvent(
  messages: Message[],
  eventData: unknown,
  chatroomId: string,
): Message[] {
  const validMessageCreatedEventData = isMessageCreatedEvent(eventData);
  if (
    validMessageCreatedEventData &&
    validMessageCreatedEventData.chatroomId === chatroomId
  ) {
    // The HTTP response and WebSocket event can contain the same message.
    if (
      messages.filter(
        (message) => message.id === validMessageCreatedEventData.message.id
      ).length > 0
    ) {
      return messages;
    }
    return [...messages, validMessageCreatedEventData.message];
  }

  const validMessageDeletedEventData = isMessageDeletedEvent(eventData);
  if (
    validMessageDeletedEventData &&
    validMessageDeletedEventData.chatroomId === chatroomId
  ) {
    return messages.filter(
      (message) => message.id !== validMessageDeletedEventData.messageId
    );
  }

  return messages;
}
