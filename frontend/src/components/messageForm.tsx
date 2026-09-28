import { useState } from "react";

const handleSubmit = () => {
  // e: React.SyntheticEvent<HTMLFormElement>
  console.log("handlesubmit placeholder");
};

export default function MessageForm({ chatroomId }: { chatroomId: string }) {
  const [message, setMessage] = useState("");
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
