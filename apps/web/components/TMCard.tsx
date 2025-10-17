import { ReactNode } from "react";
import { cn } from "../lib/utils";

export function TMCard({
  title,
  subtitle,
  className,
  children,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "card-surface group relative overflow-hidden bg-white/95",
        "before:pointer-events-none before:absolute before:inset-0 before:-translate-y-full before:bg-mauve-blush before:transition-transform before:duration-300 group-hover:before:translate-y-0",
        "after:pointer-events-none after:absolute after:-bottom-16 after:right-10 after:h-32 after:w-32 after:rounded-full after:bg-tmBlush/40 after:blur-3xl",
        className
      )}
    >
      <div className="relative z-10 flex flex-col gap-5">
        {(title || subtitle) && (
          <header className="space-y-2">
            {title && (
              <h2
                className="font-heading text-2xl text-tmCharcoal"
                role="heading"
                aria-level={2}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-tmCharcoal/70">{subtitle}</p>
            )}
          </header>
        )}
        <div className="space-y-5">{children}</div>
      </div>
    </section>
  );
}
