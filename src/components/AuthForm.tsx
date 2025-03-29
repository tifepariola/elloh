import { useState } from "react";

type Props = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${mode === "login" ? "Logging in" : "Signing up"} with`, {
      email,
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm text-mine-shaft-900 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <input
        type="password"
        required
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm text-mine-shaft-900 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground text-sm px-4 py-2 rounded-md hover:bg-primary/90"
      >
        {mode === "login" ? "Login" : "Sign up"}
      </button>
    </form>
  );
}