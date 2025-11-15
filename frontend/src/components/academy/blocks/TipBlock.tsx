import { Heart } from "lucide-react";

type TipBlockProps = {
  heading?: string;
  content: string;
};

export default function TipBlock({ heading, content }: TipBlockProps) {
  return (
    <section className="rounded-3xl border border-[#EED6D3] bg-[#F8F6F3] p-5">
      <header className="mb-3 flex items-center gap-2 text-[#3E2F35]">
        <Heart className="h-4 w-4 text-[#C9B37B]" aria-hidden />
        <h3 className="font-serif text-xl">{heading ?? "Taylor-made tip"}</h3>
      </header>
      <p className="text-sm leading-relaxed text-[#3E2F35]/85">{content}</p>
    </section>
  );
}
