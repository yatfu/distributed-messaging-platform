import { useState } from "react";
import { createUser } from "../lib/api";
import type { User } from "../lib/types";

type UserFormProps = {
  setUser: (user: User) => void;
};

export default function UserForm({ setUser }: UserFormProps) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const user = await createUser(name);
      setUser(user);
    } catch {
      setError("Could not create user. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Create User</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create User"}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
