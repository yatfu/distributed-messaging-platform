import { useState } from "react"
import { createChatroom } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function ChatroomForm() {

  const [name, setName] = useState("")
  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const chatroom = await createChatroom(name);
    // TEMPORARY DEVELOPMENT LOG
    console.log("Chatroom created:", chatroom);
    navigate(`/chatrooms/${chatroom.id}`);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Create a room</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Create Room</button>
      </form>
    </div>
  )
}
