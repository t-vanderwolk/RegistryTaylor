import React from "react";
import clsx from "clsx";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "subtle"
  | "link"
  | "outline"
  | "ghost"
  | "gold"
  | "mauve"
  | "pink";

type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  as?: React.ElementType;
  [key: string]: unknown;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-pink text-ink shadow-soft hover:border-gold/60 hover:opacity-90 focus-visible:ring-pink/40",
  secondary:
    "border border-ink/15 bg-transparent text-ink hover:border-gold/70 hover:bg-beige/40 focus-visible:ring-pink/30",
  tertiary:
    "border border-transparent bg-transparent text-mauve hover:text-ink hover:opacity-90 focus-visible:ring-pink/20",
  subtle:
    "border border-transparent bg-beige/70 text-ink hover:bg-beige/90 hover:opacity-90 focus-visible:ring-pink/20",
  link:
    "border border-transparent bg-transparent text-mauve underline-offset-4 transition hover:text-ink hover:underline focus-visible:ring-pink/20",
  outline:
    "border border-ink/20 bg-transparent text-ink hover:border-gold/70 hover:bg-beige/30 focus-visible:ring-pink/30",
  ghost:
    "border border-transparent bg-transparent text-ink/70 hover:text-ink hover:bg-beige/20 focus-visible:ring-pink/30",
  gold:
    "border border-transparent bg-gold text-ink shadow-soft hover:opacity-90 focus-visible:ring-gold/40",
  mauve:
    "border border-transparent bg-mauve text-white shadow-soft hover:opacity-90 focus-visible:ring-mauve/40",
  pink:
    "border border-transparent bg-pink text-ink shadow-soft hover:border-gold/60 hover:opacity-90 focus-visible:ring-pink/40",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs tracking-[0.2em]",
  md: "px-6 py-3 text-sm tracking-[0.28em]",
  lg: "px-8 py-4 text-base tracking-[0.28em]",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, variant, size, type, fullWidth = false, as, ...rest },
    ref
  ) => {
    const variantKey =
      typeof variant === "string" && variant in variantClasses ? (variant as ButtonVariant) : "primary";
    const sizeKey = typeof size === "string" && size in sizeClasses ? (size as ButtonSize) : "md";
    const Component = (as ?? "button") as React.ElementType;
    const buttonType =
      typeof type === "string"
        ? (type as React.ButtonHTMLAttributes<HTMLButtonElement>["type"])
        : "button";
    const childrenNode = children as React.ReactNode;

    const classes = clsx(
      "inline-flex items-center justify-center rounded-xl font-heading uppercase tracking-[0.28em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:cursor-not-allowed",
      variantClasses[variantKey],
      sizeClasses[sizeKey],
      fullWidth && "w-full",
      className
    );

    if (Component === "button") {
      return (
        <button
          ref={ref}
          type={buttonType}
          className={classes}
          {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {childrenNode}
        </button>
      );
    }

    return (
      <Component className={classes} {...(rest as Record<string, unknown>)}>
        {childrenNode}
      </Component>
    );
  }
);

Button.displayName = "Button";

export default Button;
export type { ButtonProps };
