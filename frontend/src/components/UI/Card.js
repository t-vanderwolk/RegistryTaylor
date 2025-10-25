import React from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";

const PLACEHOLDER_GRADIENTS = {
  pink: "from-blush/90 via-mauve/35 to-blush/40",
  blueberry: "from-mauve/90 via-mauve/35 to-mauve/30",
  mauve: "from-mauve/90 via-blush/30 to-mauve/25",
};

const Card = ({
  variant = "pink",
  icon,
  title,
  subtitle,
  image,
  children,
  footer,
  className = "",
}) => {
  const gradient = PLACEHOLDER_GRADIENTS[variant] ?? PLACEHOLDER_GRADIENTS.pink;

  return (
    <article
      className={`group relative overflow-hidden rounded-[2rem] border border-gold/25 bg-ivory/95 p-6 sm:p-7 shadow-soft transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-dreamy ${className}`.trim()}
    >
      {(image || icon) && (
        <div className="relative mb-6 overflow-hidden rounded-3xl">
          {image ? (
            <img
              src={image}
              alt="Concierge lifestyle"
              className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className={`flex h-44 w-full items-center justify-center bg-gradient-to-br ${gradient} text-cream transition duration-300 group-hover:scale-[1.02]`}
            >
              {icon || <SparklesIcon className="h-10 w-10" aria-hidden="true" />}
            </div>
          )}
        </div>
      )}

      <div className="flex h-full flex-col gap-3 text-charcoal">
        {(title || subtitle) && (
          <header className="flex flex-col gap-1">
            {title && (
              <h3 className="font-heading text-xl font-semibold text-charcoal sm:text-2xl">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="font-body text-sm text-charcoal/70">{subtitle}</p>
            )}
          </header>
        )}

        {children && (
          <div className="space-y-3 font-body text-sm leading-relaxed text-charcoal/80 sm:text-base">
            {children}
          </div>
        )}

        {footer && (
          <footer className="mt-auto pt-4 font-heading text-[0.7rem] uppercase tracking-[0.3em] text-blush">
            {footer}
          </footer>
        )}
      </div>
    </article>
  );
};

export default Card;
