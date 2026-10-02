import { useState, useEffect } from "react";
import ChatroomForm from "../components/chatroomForm";
import UserForm from "../components/userForm";
import type { User } from "../../shared/types";
import { getCurrentUser } from "../lib/api";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    void loadUser();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }


  return (
    <>
      {user === null ? (
        <UserForm setUser={setUser} />
      ) : (
        <ChatroomForm />
      )}
    </>
  );
}
