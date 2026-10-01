import { useState } from "react"
import { createChatroom } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function ChatroomForm() {

  const [name, setName] = useState("")
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const chatroom = await createChatroom(name);
      // TEMPORARY DEVELOPMENT LOG
      console.log("Chatroom created:", chatroom);
      navigate(`/chatrooms/${chatroom.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Create a room</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Room"}
        </button>
      </form>
    </div>
  )
}
