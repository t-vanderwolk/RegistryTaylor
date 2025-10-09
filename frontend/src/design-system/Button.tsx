import React from "react";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  as?: React.ElementType;
  [key: string]: unknown;
};

const baseClasses =
  "inline-flex items-center justify-center rounded-full px-6 py-3 font-heading text-xs uppercase tracking-[0.35em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent/70 focus-visible:ring-offset-cream min-h-[48px]";

const variants: Record<string, string> = {
  primary:
    "bg-primary text-ink shadow-[0_12px_28px_-18px_rgba(231,200,221,0.75)] hover:bg-primary/90",
  ghost:
    "border border-primary/60 bg-transparent text-ink hover:bg-primary/20",
};

const join = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  as: Component = "button",
  className,
  ...rest
}) => {
  const classes = join(baseClasses, variants[variant], className);
  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
};

export default Button;
