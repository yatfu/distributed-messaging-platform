import { useState } from "react";
import type { SubmitEventHandler } from "react";
import { createMessage, MAX_MESSAGE_LENGTH } from "../lib/api";
import type { Message } from "../../shared/types";

type MessageFormProps = {
  chatroomId: string;
  onMessageCreated: (message: Message) => void;
};

export default function MessageForm({ chatroomId, onMessageCreated }: MessageFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formText, setFormText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    // help prevent duplicate submissions
    if (submitting) {
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const createdMessage = await createMessage(chatroomId, formText); // create message
      onMessageCreated(createdMessage); // pass updated message
      setFormText("");
    } catch {
      setError("Message could not be created");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={formText}
          onChange={(e) => setFormText(e.target.value)}
          placeholder="Type your message..."
          maxLength={MAX_MESSAGE_LENGTH}
          required
        />

        <span>{formText.length}/{MAX_MESSAGE_LENGTH}</span>

        <button type="submit" disabled={submitting}>
          {submitting ? "Sending..." : "Send"}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}
    </div>
  );
}
