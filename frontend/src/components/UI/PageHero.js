import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

const PageHero = ({
  backgroundImage,
  eyebrow,
  title = "Taylor-Made",
  subtitle = "Baby Co.",
  description,
  primaryCta,
  secondaryCta,
  children,
  className = "",
}) => {
  return (
    <section
      className={[
        "relative mx-auto max-w-[1200px] overflow-hidden rounded-[3rem] border border-gold/25 bg-transparent px-6 py-20 text-center shadow-elevated-md sm:px-10 md:px-20",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blush/70 via-cream/90 to-ivory" aria-hidden="true" />
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt="Taylor-Made background"
          className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-luminosity"
          loading="lazy"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-tr from-ivory/70 via-transparent to-mauve/35" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-7 text-center motion-safe:animate-fade-in-up">
        {eyebrow && (
          <p className="text-xs font-heading uppercase tracking-[0.38em] text-charcoal/70">{eyebrow}</p>
        )}
        <h1 className="flex flex-col items-center gap-2 text-4xl text-charcoal sm:text-5xl md:text-6xl">
          <span className="font-heading text-4xl text-charcoal sm:text-5xl md:text-6xl">{title}</span>
          <span className="font-heading uppercase tracking-[0.4em] text-xs text-charcoal/60 sm:text-sm md:text-base">
            {subtitle}
          </span>
        </h1>
        <div className="h-[2px] w-20 rounded-full bg-gradient-to-r from-gold/40 via-gold to-gold/40" />
        {description && <p className="text-base leading-relaxed text-charcoal/70 sm:text-lg">{description}</p>}
        {(primaryCta || secondaryCta) && (
          <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
            {primaryCta && (
              <Button
                as={primaryCta.as || (primaryCta.to ? Link : primaryCta.href ? "a" : "button")}
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
                as={secondaryCta.as || (secondaryCta.to ? Link : secondaryCta.href ? "a" : "button")}
                to={secondaryCta.to}
                href={secondaryCta.href}
                onClick={secondaryCta.onClick}
                size="md"
                variant={secondaryCta.variant || "secondary"}
                className={["px-9 py-3", secondaryCta.className].filter(Boolean).join(" ")}
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
