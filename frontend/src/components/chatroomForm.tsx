import { useState } from "react"
import { createChatroom } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function ChatroomForm() {

  const [name, setName] = useState("")
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const chatroom = await createChatroom(name);
      navigate(`/chatrooms/${chatroom.id}`);
    } catch {
      setError("Could not create room. Please try again.");
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
      {error && <p role="alert">{error}</p>}
    </div>
  )
}
