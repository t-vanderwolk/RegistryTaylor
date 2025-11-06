import React, { useState } from "react";

export function InviteGate({ onPass }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const verify = async () => {
    if (!code.trim()) {
      setError("Enter your invite code to continue.");
      return;
    }
    setIsVerifying(true);
    setError("");
    try {
      const response = await fetch("/api/invites/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const body = await response.json().catch(() => ({}));
      if (response.ok && body?.ok) {
        onPass?.();
      } else {
        setError(body?.error || "Invalid code");
      }
    } catch (err) {
      setError(err.message || "Unable to verify invite right now.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gold/30 bg-white/70 p-6 shadow-soft">
<<<<<<< HEAD
      <h3 className="text-lg font-serif text-charcoal">Invite-Only Access</h3>
      <p className="mt-1 text-sm text-charcoal/70">Enter your code to continue.</p>
=======
      <h3 className="text-lg font-serif text-blueberry">Invite-Only Access</h3>
      <p className="mt-1 text-sm text-darkText/70">Enter your code to continue.</p>
>>>>>>> heroku/main
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={code}
          onChange={(event) => {
            setCode(event.target.value.toUpperCase());
            setError("");
          }}
<<<<<<< HEAD
          className="flex-1 rounded-xl border border-blush/40 bg-white/90 px-4 py-2 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
=======
          className="flex-1 rounded-xl border border-babyPink/40 bg-white/90 px-4 py-2 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
>>>>>>> heroku/main
          placeholder="INVITE-CODE"
          maxLength={32}
        />
        <button
          type="button"
          onClick={verify}
<<<<<<< HEAD
          className="inline-flex items-center justify-center rounded-xl bg-mauve px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-dreamy disabled:cursor-not-allowed disabled:opacity-70"
=======
          className="inline-flex items-center justify-center rounded-xl bg-blueberry px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-dreamy disabled:cursor-not-allowed disabled:opacity-70"
>>>>>>> heroku/main
          disabled={isVerifying}
        >
          {isVerifying ? "Checking…" : "Continue"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}
    </div>
  );
}

export default InviteGate;
