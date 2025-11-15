import Image from "next/image";
import type { WorkbookEntry } from "./workbookApi";

type WorkbookEntryCardProps = {
  entry: WorkbookEntry;
  moduleTitle?: string;
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function WorkbookEntryCard({ entry, moduleTitle }: WorkbookEntryCardProps) {
  const images = entry.content.images ?? [];

  return (
    <article className="space-y-4 rounded-[2rem] border border-[#C8A1B4]/30 bg-white/95 p-6 text-sm text-[#3E2F35]/75 shadow-[0_20px_45px_rgba(200,161,180,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_60px_rgba(200,161,180,0.22)]">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
            {moduleTitle ?? entry.moduleSlug}
          </p>
          <h3 className="font-[var(--font-playfair)] text-xl text-[#3E2F35]">Workbook Reflection</h3>
        </div>
        <div className="flex flex-col items-end text-xs uppercase tracking-[0.3em] text-[#3E2F35]/50">
          <span>{formatDate(entry.updatedAt)}</span>
          <span className={entry.shared ? "text-[#C8A1B4]" : "text-[#3E2F35]/50"}>
            {entry.shared ? "Shared with mentor" : "Private"}
          </span>
        </div>
      </header>

      {entry.content.text ? (
        <p className="text-sm leading-relaxed text-[#3E2F35]/80 whitespace-pre-line">{entry.content.text}</p>
      ) : null}

      {images.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {images.map((src, index) => (
            <div
              key={src}
              className="overflow-hidden rounded-[1.5rem] border border-[#EAC9D1]/50 bg-[#FFFAF8]/80"
            >
              <Image
                src={src}
                alt={`Workbook inspiration ${index + 1}`}
                width={640}
                height={480}
                className="h-48 w-full object-cover"
                unoptimized={src.startsWith("data:")}
              />
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}
