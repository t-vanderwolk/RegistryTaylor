type MentorBlockProps = {
  quote: string;
  author?: string;
  role?: string;
};

export default function MentorBlock({ quote, author, role }: MentorBlockProps) {
  return (
    <section className="space-y-3 rounded-3xl border border-[#EED6D3] bg-[#F8F6F3] p-5">
      <header className="text-sm font-semibold uppercase tracking-[0.32em] text-[#C8A6B6]">
        From your mentor
      </header>
      <blockquote className="font-serif italic text-[#3E2F35]">{quote}</blockquote>
      {author ? (
        <p className="text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60">
          — {author}
          {role ? `, ${role}` : ""}
        </p>
      ) : null}
    </section>
  );
}
