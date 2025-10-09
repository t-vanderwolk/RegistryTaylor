import React from "react";
import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helperText?: string;
  error?: string;
  labelHidden?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, id, labelHidden = false, className, ...rest }, ref) => {
    const helperId = helperText || error ? `${id}-helper` : undefined;

    return (
      <label className={clsx("flex flex-col gap-2 font-body text-sm text-charcoal/80", className)}>
        <span className={clsx("text-xs uppercase tracking-[0.28em]", labelHidden && "sr-only")}>{label}</span>
        <input
          id={id}
          ref={ref}
          aria-describedby={helperId}
          className={clsx(
            "rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm text-charcoal shadow-elevated-sm transition duration-150 placeholder:text-charcoal/40 focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory",
            error && "border-rose-400 focus:border-rose-400 focus-visible:ring-rose-200"
          )}
          {...rest}
        />
        {(helperText || error) && (
          <span id={helperId} className={clsx("text-xs", error ? "text-rose-500" : "text-charcoal/60")}>
            {error || helperText}
          </span>
        )}
      </label>
    );
  }
);

Input.displayName = "Input";

export default Input;
