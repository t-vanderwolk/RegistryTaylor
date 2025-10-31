"use client";

import { useState } from "react";
import Image from "next/image";
import MentorNotesPanel from "./MentorNotesPanel";
import { getRegistrySourceMeta } from "@/lib/registryMeta";
import type { RegistryItem } from "@/types/registry";

type RegistryItemCardProps = {
  item: RegistryItem;
  onSaveNote: (productId: string, note: string) => Promise<void>;
  saving: boolean;
};

function formatPrice(value: number | null): string {
  if (value === null) {
    return "Concierge priced";
  }
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `$${value}`;
  }
}

export default function RegistryItemCard({ item, onSaveNote, saving }: RegistryItemCardProps) {
  const [openNotes, setOpenNotes] = useState(false);
  const sourceMeta = getRegistrySourceMeta(item.registrySource);
  const affiliateLink = item.affiliateUrl ?? "";

  const handleSaveNote = async (value: string) => {
    await onSaveNote(item.id, value);
    if (!value.trim()) {
      setOpenNotes(false);
    }
  };

  return (
    <article className="flex flex-col rounded-[2.2rem] border border-[#C8A1B4]/30 bg-[#FFFAF8] p-6 shadow-[0_18px_40px_rgba(200,161,180,0.18)] transition hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(200,161,180,0.24)]">
      <div className="relative overflow-hidden rounded-[1.8rem] border border-[#C8A1B4]/25 bg-white">
        <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border bg-[#FFFAF8]/90 px-3 py-1 text-xs font-semibold text-[#3E2F35]">
          <span>{sourceMeta.icon}</span>
          <span>{sourceMeta.label}</span>
        </div>
        <div className="absolute right-4 top-4 rounded-full border border-[#C8A1B4]/50 bg-[#FFFAF8]/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70">
          {item.category}
        </div>
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            width={560}
            height={320}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-[#FFFAF8] text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">
            Concierge preview
          </div>
        )}
      </div>

      <header className="mt-5 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/60">{item.brand}</p>
        <h3 className="font-[var(--font-playfair)] text-xl text-[#3E2F35]">{item.name}</h3>
      </header>

      {item.description ? (
        <p className="mt-3 text-sm leading-relaxed text-[#3E2F35]/70">{item.description}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#3E2F35]/75">
        <span className="font-semibold text-[#3E2F35]">{formatPrice(item.price)}</span>
        {item.mentorNote ? (
          <span className="rounded-full bg-[#EAC9D1]/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70">
            Mentor note saved
          </span>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {affiliateLink ? (
          <a
            href={affiliateLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#3E2F35] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#C8A1B4]"
          >
            Add to Cart
          </a>
        ) : null}
        <button
          type="button"
          onClick={() => setOpenNotes((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
        >
          {openNotes ? "Hide Note" : item.mentorNote ? "Edit Note" : "Add Note"}
        </button>
      </div>

      {openNotes ? (
        <MentorNotesPanel
          initialNote={item.mentorNote ?? ""}
          onSave={handleSaveNote}
          onClose={() => setOpenNotes(false)}
          saving={saving}
        />
      ) : null}
    </article>
  );
}
