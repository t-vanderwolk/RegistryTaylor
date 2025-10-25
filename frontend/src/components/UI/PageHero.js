import React from "react";
import Button from "./Button";

const PageHero = ({
  backgroundImage,
  eyebrow,
  title: _title = "Taylor-Made",
  subtitle = "Baby Co.",
  description,
  primaryCta,
  secondaryCta,
  children,
  className = "",
}) => {
  return (
    <section
      className={`relative mx-auto max-w-[1200px] overflow-hidden rounded-[3.75rem] border border-gold/20 bg-transparent px-6 py-20 text-center shadow-soft sm:px-10 md:px-20 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-softPink/80 via-white/90 to-softMint/70" aria-hidden="true" />
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt="Pastel Taylor-Made backdrop"
          className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-luminosity"
          loading="lazy"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/65 via-transparent to-pastelPurple/50" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-7 text-center motion-safe:animate-fade-in-up">
        {eyebrow && (
          <p className="text-xs font-heading uppercase tracking-[0.45em] text-primary/80">{eyebrow}</p>
        )}
        <h1 className="flex flex-col items-center gap-3 text-4xl text-blueberry sm:text-5xl md:text-6xl">
          <span className="font-script text-5xl text-primary drop-shadow-sm sm:text-6xl md:text-[4.75rem]">
            Taylor-Made
          </span>
          <span className="font-heading uppercase tracking-[0.45em] text-xs text-blueberry/70 sm:text-sm md:text-base">
            {subtitle}
          </span>
        </h1>
        <div className="h-0.5 w-20 rounded-full bg-gradient-to-r from-gold/35 via-gold/70 to-gold/35" />
        {description && (
          <p className="text-base leading-relaxed text-blueberry/80 sm:text-lg">{description}</p>
        )}
        {(primaryCta || secondaryCta) && (
          <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
            {primaryCta && (
              <Button
                as={primaryCta.as || "link"}
                to={primaryCta.to}
                href={primaryCta.href}
                onClick={primaryCta.onClick}
                size="md"
                variant={primaryCta.variant || "primary"}
                className={primaryCta.className || "px-9 py-3"}
              >
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button
                as={secondaryCta.as || (secondaryCta.to || secondaryCta.href ? "link" : "button")}
                to={secondaryCta.to}
                href={secondaryCta.href}
                onClick={secondaryCta.onClick}
                size="md"
                variant={secondaryCta.variant || "primary"}
                className={`px-9 py-3 ${secondaryCta.className || ""}`.trim()}
              >
                {secondaryCta.label}
              </Button>
            )}
          </div>
        )}
        {children && <div className="mt-10 w-full">{children}</div>}
      </div>
    </section>
  );
};

export default PageHero;
