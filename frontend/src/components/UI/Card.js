import React from "react";

const ACCENTS = {
  pink: "from-babyPink/70 via-cream to-babyPink/40",
  blue: "from-babyBlue/70 via-cream to-babyBlue/40",
  purple: "from-pastelPurple/70 via-cream to-pastelPurple/40",
  sunshine: "from-sunshine/70 via-cream to-sunshine/30",
};

const Card = ({
  variant = "pink",
  icon,
  title,
  subtitle,
  children,
  footer,
  className = "",
}) => {
  const gradient = ACCENTS[variant] ?? ACCENTS.pink;

  return (
    <article
      className={`group relative overflow-hidden rounded-3xl bg-cream/90 p-6 sm:p-8 shadow-toy transition duration-200 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:shadow-dreamy ${className}`.trim()}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-70 transition duration-200 group-hover:opacity-90`}
      />
      <div className="relative flex h-full flex-col gap-3 text-darkText">
        {(icon || title) && (
          <header className="flex items-center gap-3">
            {icon && (
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/85 text-2xl shadow-toy transition duration-200 group-hover:animate-wiggle">
                {icon}
              </span>
            )}
            <div>
              {title && (
                <h3 className="font-heading text-xl sm:text-2xl text-darkText">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="font-body text-sm text-darkText/70">{subtitle}</p>
              )}
            </div>
          </header>
        )}

        {children && <div className="font-body text-sm sm:text-base leading-relaxed text-darkText/80">{children}</div>}

        {footer && (
          <footer className="mt-auto pt-4 font-body text-xs uppercase tracking-[0.25em] text-goldHighlight">
            {footer}
          </footer>
        )}
      </div>
    </article>
  );
};

export default Card;
