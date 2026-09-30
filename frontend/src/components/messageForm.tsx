import { useState } from "react";
import type { SubmitEventHandler } from "react";
import { createMessage } from "../lib/api";

export default function MessageForm({ chatroomId }: { chatroomId: string }) {

  const [formText, setFormText] = useState("");


  const handleSubmit: SubmitEventHandler<HTMLFormElement> =
    async (event) => {
      event.preventDefault();
  
      await createMessage(chatroomId, formText);
      setFormText("");
    };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={formText}
          onChange={(e) => setFormText(e.target.value)}
          placeholder="Type your message..."
        />

        <button type="submit">Send</button>
      </form>
    </div>
  );
}
