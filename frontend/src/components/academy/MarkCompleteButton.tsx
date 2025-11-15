"use client";

import { useFormStatus } from "react-dom";

type MarkCompleteButtonProps = {
  action: () => Promise<void>;
  completed: boolean;
};

export default function MarkCompleteButton({ action, completed }: MarkCompleteButtonProps) {
  return (
    <form action={action} className="inline-flex">
      <SubmitButton completed={completed} />
    </form>
  );
}

function SubmitButton({ completed }: { completed: boolean }) {
  const { pending } = useFormStatus();
  const disabled = completed || pending;

  return (
    <button
      type="submit"
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-full bg-tm-rose px-6 py-2 text-sm font-semibold text-tm-charcoal shadow-soft transition hover:-translate-y-0.5 hover:bg-tm-hover disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tm-focus"
    >
      {completed ? "Module Completed" : pending ? "Marking…" : "Mark Complete"}
    </button>
  );
}
