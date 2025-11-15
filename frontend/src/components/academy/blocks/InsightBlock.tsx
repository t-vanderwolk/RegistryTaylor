import { Lightbulb } from "lucide-react";

type InsightBlockProps = {
  heading?: string;
  content: string;
};

export default function InsightBlock({ heading, content }: InsightBlockProps) {
  return (
    <section className="rounded-3xl border border-[#EED6D3] bg-[#F8F6F3] p-5">
      <header className="mb-3 flex items-center gap-2 text-[#3E2F35]">
        <Lightbulb className="h-4 w-4 text-[#C8A6B6]" aria-hidden />
        <h3 className="font-serif text-xl">
          {heading ?? "Taylor-made insight"}
        </h3>
      </header>
      <p className="text-sm leading-relaxed text-[#3E2F35]/85">{content}</p>
    </section>
  );
}
