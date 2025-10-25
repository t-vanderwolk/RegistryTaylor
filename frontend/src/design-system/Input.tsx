import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  id: string;
};

const Input: React.FC<InputProps> = ({ label, error, id, className, ...rest }) => {
  return (
    <label htmlFor={id} className="flex flex-col gap-2 font-body text-sm text-charcoal/90">
      <span className="text-xs uppercase tracking-[0.3em] text-charcoal/70">{label}</span>
      <input
        id={id}
        className={[
          "rounded-2xl border border-mauve/50 bg-ivory px-4 py-3 text-charcoal shadow-[0_10px_24px_-18px_rgba(46,46,46,0.18)] transition",
          "focus:border-blush focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </label>
  );
};

export default Input;
