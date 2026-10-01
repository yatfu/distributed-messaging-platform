import { useState } from "react";
import type { Message, User } from "../lib/types";
import { deleteMessage } from "../lib/api";

type MessageListProps = {
  messages: Message[];
  currentUser: User | null;
  onMessageDeleted: (messageId: string) => void;
};

export default function MessageList({
  messages,
  currentUser,
  onMessageDeleted,
}: MessageListProps) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleDelete(messageId: string) {
    if (submitting) {
      return;
    }
    setError("");
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
      {messages.length === 0 && <p>No messages yet.</p>}
      {messages.map((message) => (
        <div key={message.id}>
          <p>sender: {message.username}</p>
          <p>content: {message.content}</p>
          <time dateTime={message.createdAt}>
            {new Date(message.createdAt).toLocaleString()}
          </time>
          {currentUser != null &&
            "id" in currentUser &&
            message.senderId === currentUser.id && ( // checks if id is in current user before rendering
              <button
                type="button"
                disabled={submitting}
                onClick={() => void handleDelete(message.id)}
              >
                {submitting ? "Deleting..." : "Delete"}
              </button>
            )}
        </div>
      ))}
    </div>
  );
}
