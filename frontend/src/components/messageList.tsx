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
          <p>{message.senderId}</p>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
}