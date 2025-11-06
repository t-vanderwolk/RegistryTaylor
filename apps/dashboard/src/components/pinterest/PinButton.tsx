"use client";

import { useState } from "react";
import { savePin } from "@/lib/pinterest";

type PinButtonProps = {
  imageUrl: string;
  title: string;
  link: string;
};

export default function PinButton({ imageUrl, title, link }: PinButtonProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await savePin(imageUrl, title, link);
    } catch (_err) {
      setError("We couldn’t reach Pinterest. Please try again soon.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-full bg-tm-rose px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-tm-charcoal transition hover:-translate-y-0.5 hover:bg-tm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tm-focus disabled:cursor-not-allowed disabled:opacity-70"
      >
        📌 {saving ? "Saving..." : "Save to Pinterest"}
      </button>
      {error ? <p className="text-xs text-[#9F3D3D]">{error}</p> : null}
    </div>
  );
}
