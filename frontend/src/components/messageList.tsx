import type { Message } from "../lib/types";

type MessageListProps = {
  messages: Message[];
};

export default function MessageList({
  messages,
}: MessageListProps) {
  return (
    <div id="message-list">
      {messages.map((message) => (
        <div key={message.id}>
          <p>sender: {message.username}</p>
          <p>content: {message.content}</p>
        </div>
      ))}
    </div>
  );
}