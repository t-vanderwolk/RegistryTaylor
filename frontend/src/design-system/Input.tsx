import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  id: string;
};

const Input: React.FC<InputProps> = ({ label, error, id, className, ...rest }) => {
  return (
    <label htmlFor={id} className="flex flex-col gap-2 font-body text-sm text-ink/90">
      <span className="text-xs uppercase tracking-[0.3em] text-ink/70">{label}</span>
      <input
        id={id}
        className={[
          "rounded-2xl border border-primary/50 bg-cream px-4 py-3 text-ink shadow-[0_10px_24px_-18px_rgba(46,46,46,0.18)] transition",
          "focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
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
