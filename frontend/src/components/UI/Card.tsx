import React from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

type CardVariant = "blush" | "mauve" | "charcoal" | "pink" | "blueberry";

type CardProps = {
  variant?: CardVariant;
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  image?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

const PLACEHOLDER_GRADIENTS: Record<CardVariant, string> = {
  blush: "from-blush via-mauve/30 to-blush/50",
  pink: "from-blush via-mauve/30 to-blush/50",
  mauve: "from-mauve via-blush/25 to-mauve/30",
  charcoal: "from-charcoal via-mauve/25 to-charcoal/80",
  blueberry: "from-charcoal via-mauve/30 to-charcoal/70",
};

const Card: React.FC<CardProps> = ({
  variant = "blush",
  icon,
  title,
  subtitle,
  image,
  children,
  footer,
  className,
}) => {
  const gradient = PLACEHOLDER_GRADIENTS[variant] ?? PLACEHOLDER_GRADIENTS.blush;

  return (
    <article
      className={clsx(
        "group relative overflow-hidden rounded-lg border border-charcoal/12 bg-white/95 p-6 sm:p-7 shadow-elevated-sm transition duration-150 hover:-translate-y-1 hover:shadow-elevated-md",
        className
      )}
    >
      {(image || icon) && (
        <div className="relative mb-6 overflow-hidden rounded-[18px]">
          {image ? (
            <img
              src={image}
              alt={title || "Taylor-Made illustration"}
              className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className={clsx(
                "flex h-44 w-full items-center justify-center bg-gradient-to-br text-white transition duration-300 group-hover:scale-[1.02]",
                gradient
              )}
            >
              {icon || <SparklesIcon className="h-10 w-10" aria-hidden="true" />}
            </div>
          )}
        </div>
      )}

      <div className="flex h-full flex-col gap-3 text-charcoal">
        {(title || subtitle) && (
          <header className="flex flex-col gap-2">
            {title && <h3 className="font-heading text-xl text-charcoal sm:text-2xl">{title}</h3>}
            {subtitle && <p className="font-body text-sm text-charcoal/70">{subtitle}</p>}
          </header>
        )}

        {children && (
          <div className="space-y-3 font-body text-sm leading-relaxed text-charcoal/75 sm:text-base">
            {children}
          </div>
        )}

        {footer && (
          <footer className="mt-auto pt-4 font-heading text-[0.7rem] uppercase tracking-[0.3em] text-gold">
            {footer}
          </footer>
        )}
      </div>
    </article>
  );
};

export default Card;
