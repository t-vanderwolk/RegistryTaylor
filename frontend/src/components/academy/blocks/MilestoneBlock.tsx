import { motion } from "framer-motion";

type MilestoneBlockProps = {
  title: string;
  headline?: string | null;
  message?: string | null;
  percent?: number | null;
};

const confetti = Array.from({ length: 16 });

export default function MilestoneBlock({ title, headline, message, percent }: MilestoneBlockProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#EED6D3] bg-[#EED6D3]/70 p-6 text-center">
      <div className="absolute inset-0 pointer-events-none">
        {confetti.map((_, idx) => (
          <motion.span
            key={idx}
            className="absolute h-2 w-2 rounded-full bg-[#C9B37B]/70"
            initial={{ x: Math.random() * 100 + "%", y: -10, opacity: 0 }}
            animate={{ y: "110%", opacity: [0, 1, 0] }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      <div className="relative space-y-3 text-[#3E2F35]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em]">{title}</p>
        {headline ? <h3 className="font-serif text-2xl">{headline}</h3> : null}
        {percent !== null && percent !== undefined ? (
          <p className="text-sm uppercase tracking-[0.35em] text-[#3E2F35]/70">{percent}% complete</p>
        ) : null}
        {message ? <p className="mx-auto max-w-xl text-sm leading-relaxed">{message}</p> : null}
      </div>
    </section>
  );
}
