import { useState } from "react";
import type { Message } from "../lib/types";
import { deleteMessage } from "../lib/api";

type MessageListProps = {
  messages: Message[];
  onMessageDeleted: (messageId: string) => void;
};

export default function MessageList({
  messages,
  onMessageDeleted,
}: MessageListProps) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleDelete(messageId: string) {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    try {
      await deleteMessage(messageId);
      onMessageDeleted(messageId);
    } catch {
      setError("message deletion failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div id="message-list">
      {error && <p role="alert">{error}</p>}
      {messages.map((message) => (
        <div key={message.id}>
          <p>sender: {message.username}</p>
          <p>content: {message.content}</p>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleDelete(message.id)}
          >
            {submitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      ))}
    </div>
  );
}
