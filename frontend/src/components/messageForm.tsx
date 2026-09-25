import { useState } from "react";

const [message, setMessage] = useState("");

const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
  console.log("handlesubmit placeholder");
};

export default function MessageForm() {
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
