import React from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";

const PLACEHOLDER_GRADIENTS = {
  pink: "from-babyPink/90 via-pastelPurple/40 to-babyPink/30",
  blue: "from-babyBlue/90 via-pastelPurple/40 to-babyBlue/30",
  purple: "from-pastelPurple/90 via-babyPink/40 to-pastelPurple/25",
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
      className={`group relative overflow-hidden rounded-2xl bg-white/95 p-6 sm:p-7 shadow-lg ring-1 ring-pastelPurple/25 transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl ${className}`.trim()}
    >
      {(image || icon) && (
        <div className="relative mb-5 overflow-hidden rounded-2xl">
          {image ? (
            <img
              src={image}
              alt="Concierge lifestyle"
              className="h-40 w-full object-cover transition duration-200 group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className={`flex h-40 w-full items-center justify-center bg-gradient-to-br ${gradient} text-white/90 transition duration-200 group-hover:scale-[1.02]`}
            >
              {icon || <SparklesIcon className="h-10 w-10" aria-hidden="true" />}
            </div>
          )}
        </div>
      )}

      <div className="flex h-full flex-col gap-3 text-darkText">
        {(title || subtitle) && (
          <header className="flex flex-col gap-1">
            {title && (
              <h3 className="font-heading text-xl font-semibold text-blueberry sm:text-2xl">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="font-body text-sm text-darkText/70">{subtitle}</p>
            )}
          </header>
        )}

        {children && (
          <div className="font-body text-sm leading-relaxed text-darkText/80 sm:text-base space-y-3">
            {children}
          </div>
        )}

        {footer && (
          <footer className="mt-auto pt-4 font-body text-xs uppercase tracking-[0.25em] text-gold">
            {footer}
          </footer>
        )}
      </div>
    </article>
  );
};

export default Card;
