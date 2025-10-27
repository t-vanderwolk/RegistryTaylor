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
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-6 py-2 text-sm font-semibold text-[#3E2F35] shadow-[0_10px_25px_rgba(200,161,180,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(200,161,180,0.45)] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {completed ? "Module Completed" : pending ? "Marking…" : "Mark Complete"}
    </button>
  );
}
