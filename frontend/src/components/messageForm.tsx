import { useState } from "react";
import type { SubmitEventHandler } from "react";
import { createMessage } from "../lib/api";

export default function MessageForm({ chatroomId }: { chatroomId: string }) {

  const [message, setMessage] = useState("");


  const handleSubmit: SubmitEventHandler<HTMLFormElement> =
    async (event) => {
      event.preventDefault();
  
      await createMessage(chatroomId, message);
      setMessage("");
    };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />

        <button type="submit">Send</button>
      </form>
    </div>
  );
}
