import { useState } from "react";
import { createUser } from "../lib/api";
import type { User } from "../lib/types";

type UserFormProps = {
  setUser: (user: User) => void;
};

export default function UserForm({ setUser }: UserFormProps) {
  const [name, setName] = useState("");

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const user = await createUser(name);
    // TEMPORARY DEVELOPMENT LOG
    console.log("User created:", user);

    setUser(user); // update useState for Home Page render
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Create User</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">Create User</button>
      </form>
    </div>
  );
}
