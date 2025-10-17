"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { API_BASE } from "../../lib/api";
import { cn } from "../../lib/utils";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Unable to log in.");
      }
      router.replace("/dashboard/academy");
    } catch (err) {
      console.error(err);
      setStatus("idle");
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-tmBlush/50 bg-white/90 p-8 shadow-soft backdrop-blur"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 0.68, 0, 0.99] }}
    >
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-2xl border border-transparent bg-tmIvory/90 p-4 text-sm text-tmCharcoal shadow-inner transition focus:border-tmGold/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-tmGold/30"
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          className="w-full rounded-2xl border border-transparent bg-tmIvory/90 p-4 text-sm text-tmCharcoal shadow-inner transition focus:border-tmGold/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-tmGold/30"
          autoComplete="current-password"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-500/80">
          {error}
        </p>
      )}
      <motion.button
        type="submit"
        className={cn(
          "w-full rounded-full bg-tmMauve px-6 py-3 text-sm font-semibold text-tmGold transition duration-200 hover:-translate-y-0.5 hover:bg-tmMauve/90 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-tmIvory",
          status === "loading" && "opacity-60"
        )}
        whileTap={{ scale: 0.98 }}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Signing in..." : "Access Dashboard"}
      </motion.button>
    </motion.form>
  );
}
