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
  isActive?: boolean;
  [key: string]: unknown;
};

const baseClasses =
  "inline-flex items-center justify-center rounded-2xl font-heading font-medium uppercase tracking-[0.28em] transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-tmIvory disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-gradient-to-r from-tmMauve via-tmBlush to-tmMauve text-white shadow-soft hover:-translate-y-0.5 hover:shadow-dreamy active:translate-y-0 active:shadow-soft",
  secondary:
    "border border-tmMauve/45 bg-white/80 text-tmMauve shadow-soft hover:-translate-y-0.5 hover:border-tmMauve hover:bg-tmMauve/10 hover:text-tmCharcoal active:translate-y-0",
  tertiary:
    "border border-transparent bg-transparent text-tmMauve hover:text-tmCharcoal focus-visible:ring-tmMauve/20 hover:-translate-y-0.5",
  subtle:
    "border border-transparent bg-tmBlush/35 text-tmCharcoal shadow-soft hover:-translate-y-0.5 hover:bg-tmBlush/55",
  link:
    "border border-transparent bg-transparent text-tmMauve underline-offset-4 transition hover:text-tmCharcoal hover:underline focus-visible:ring-tmMauve/20",
  outline:
    "border border-tmCharcoal/20 bg-transparent text-tmCharcoal shadow-soft hover:-translate-y-0.5 hover:border-tmMauve hover:bg-tmMauve/10 focus-visible:ring-tmMauve/30",
  ghost:
    "border border-transparent bg-transparent text-tmCharcoal/70 hover:text-tmCharcoal hover:bg-tmBlush/30 focus-visible:ring-tmMauve/30",
  gold:
    "border border-transparent bg-tmGold text-tmCharcoal shadow-soft hover:-translate-y-0.5 hover:bg-tmGold/90 focus-visible:ring-tmGold/40",
  mauve:
    "border border-transparent bg-tmMauve text-white shadow-soft hover:-translate-y-0.5 hover:bg-[#b5879f] focus-visible:ring-tmMauve/40",
  pink:
    "border border-transparent bg-tmBlush text-tmCharcoal shadow-soft hover:-translate-y-0.5 hover:bg-[#e5b7c2] focus-visible:ring-tmMauve/30",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-5 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-7 py-4 text-base",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, variant, size, type, fullWidth = false, as, isActive = false, ...rest },
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
      baseClasses,
      variantClasses[variantKey],
      sizeClasses[sizeKey],
      fullWidth && "w-full",
      isActive && "ring-2 ring-tmMauve/50 ring-offset-2 ring-offset-tmIvory",
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
