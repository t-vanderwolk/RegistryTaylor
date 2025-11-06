import React from "react";
<<<<<<< HEAD
type ButtonVariant = "mauve" | "gold" | (string & {});
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
=======
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
>>>>>>> heroku/main
  as?: React.ElementType;
  [key: string]: unknown;
};

const baseClasses =
<<<<<<< HEAD
  "inline-flex items-center justify-center rounded-full font-heading uppercase tracking-[0.32em] transition duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blush/70 focus-visible:ring-offset-ivory min-h-[48px]";

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-5 py-2 text-[0.68rem] sm:text-xs",
  md: "px-6 py-2.5 text-xs sm:text-sm",
  lg: "px-8 py-3 text-sm sm:text-base",
};

const variants: Record<string, string> = {
  mauve: "bg-mauve text-ivory hover:bg-mauve/90",
  gold: "bg-gold text-charcoal hover:bg-gold/90",
=======
  "inline-flex items-center justify-center rounded-full px-6 py-3 font-heading text-xs uppercase tracking-[0.35em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent/70 focus-visible:ring-offset-cream min-h-[48px]";

const variants: Record<string, string> = {
  primary:
    "bg-primary text-ink shadow-[0_12px_28px_-18px_rgba(231,200,221,0.75)] hover:bg-primary/90",
  ghost:
    "border border-primary/60 bg-transparent text-ink hover:bg-primary/20",
>>>>>>> heroku/main
};

const join = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

const Button: React.FC<ButtonProps> = ({
  children,
<<<<<<< HEAD
  variant = "mauve",
  size = "md",
=======
  variant = "primary",
>>>>>>> heroku/main
  as: Component = "button",
  className,
  ...rest
}) => {
<<<<<<< HEAD
  const variantClasses = variants[variant] ?? variants.mauve;
  const sizeClass = sizeClasses[size] ?? sizeClasses.md;
  const classes = join(baseClasses, sizeClass, variantClasses, className);
  const componentProps: Record<string, unknown> = { className: classes, ...rest };

  if (Component === "button" && componentProps.type === undefined) {
    componentProps.type = "button";
  }

  return (
    <Component {...componentProps}>
=======
  const classes = join(baseClasses, variants[variant], className);
  return (
    <Component className={classes} {...rest}>
>>>>>>> heroku/main
      {children}
    </Component>
  );
};

export default Button;
