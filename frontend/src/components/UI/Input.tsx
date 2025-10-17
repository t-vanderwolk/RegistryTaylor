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
      <label className={clsx("flex flex-col gap-2 font-body text-sm text-tmCharcoal/80", className)}>
        <span
          className={clsx(
            "text-[0.7rem] font-heading uppercase tracking-[0.32em] text-tmCharcoal/70",
            labelHidden && "sr-only"
          )}
        >
          {label}
        </span>
        <input
          id={id}
          ref={ref}
          aria-describedby={helperId}
          className={clsx(
            "rounded-2xl border border-tmCharcoal/15 bg-white/90 px-4 py-3 text-sm text-tmCharcoal shadow-soft transition duration-150 placeholder:text-tmCharcoal/40 focus:border-tmMauve focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmMauve/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
            error &&
              "border-rose-400 focus:border-rose-400 focus-visible:ring-rose-200 focus-visible:ring-offset-white focus-visible:ring-offset-0"
          )}
          {...rest}
        />
        {(helperText || error) && (
          <span id={helperId} className={clsx("text-xs", error ? "text-rose-500" : "text-tmCharcoal/60")}>
            {error || helperText}
          </span>
        )}
      </label>
    );
  }
);

Input.displayName = "Input";

export default Input;
