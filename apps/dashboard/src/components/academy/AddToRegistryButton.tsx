"use client";

import { useFormStatus } from "react-dom";

type AddToRegistryButtonProps = {
  action: () => Promise<void>;
};

export default function AddToRegistryButton({ action }: AddToRegistryButtonProps) {
  return (
    <form action={action} className="inline-flex">
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] bg-white px-6 py-2 text-sm font-semibold text-[#3E2F35] shadow-[0_8px_20px_rgba(62,47,53,0.08)] transition hover:-translate-y-0.5 hover:border-[#D9C48E] hover:bg-[#FFFAF8] hover:shadow-[0_12px_28px_rgba(200,161,180,0.32)] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Adding…" : "Add Recommendations to Registry"}
    </button>
  );
}
