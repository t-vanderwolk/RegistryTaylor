"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { API_BASE } from "../../lib/api";
import { cn } from "../../lib/utils";

export function InviteForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = code.trim();
    if (!value) {
      setError("Enter your invite code to continue.");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/invite/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: value }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Invite code could not be validated.");
      }

      const tempToken = json.data?.temp_token as string | undefined;
      const normalizedCode = json.data?.code as string | undefined;

      if (tempToken) {
        window.sessionStorage.setItem("tm_invite_token", tempToken);
      }
      if (normalizedCode) {
        window.sessionStorage.setItem("tm_invite_code", normalizedCode);
      }

      setStatus("success");
      setTimeout(() => {
        router.push("/create-profile");
      }, 450);
    } catch (err) {
      console.error(err);
      setStatus("idle");
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't verify that invite. Try again or request a new one."
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
        <label
          htmlFor="invite-code"
          className="text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70"
        >
          Invite Code
        </label>
        <input
          id="invite-code"
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder="Enter your 8-character code"
          className="w-full rounded-2xl border border-transparent bg-tmIvory/90 p-4 text-sm text-tmCharcoal shadow-inner transition focus:border-tmGold/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-tmGold/30"
          autoComplete="one-time-code"
        />
        {error && (
          <p className="text-sm text-red-500/80" role="alert">
            {error}
          </p>
        )}
      </div>
      <motion.button
        type="submit"
        className={cn(
          "w-full rounded-full bg-tmMauve px-6 py-3 text-sm font-semibold text-tmGold transition duration-200 hover:-translate-y-0.5 hover:bg-tmMauve/90 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-tmIvory",
          status === "loading" && "opacity-60"
        )}
        whileTap={{ scale: 0.98 }}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Validating..." : "Continue"}
      </motion.button>
      <div className="rounded-2xl border border-dashed border-tmBlush/70 bg-tmIvory/80 p-4 text-xs text-tmCharcoal/70">
        No code yet?{" "}
        <button
          type="button"
          className="font-semibold text-tmMauve underline-offset-4 hover:text-tmGold hover:underline"
          onClick={async () => {
            const email = window.prompt(
              "Share where we should send your invite:"
            );
            if (!email) return;
            try {
              const response = await fetch(`${API_BASE}/api/invite/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email }),
              });
              const json = await response.json();
              if (!response.ok || !json.success) {
                throw new Error(json.error || "Unable to request invite.");
              }
              window.alert(
                "Got it! We’ll review your request and send a code shortly."
              );
            } catch (err) {
              console.error(err);
              window.alert("We couldn't submit that request. Try again soon.");
            }
          }}
        >
          Request access
        </button>
        .
      </div>
    </motion.form>
  );
}
