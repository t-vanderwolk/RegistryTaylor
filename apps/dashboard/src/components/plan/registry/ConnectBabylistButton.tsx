"use client";

type ConnectBabylistButtonProps = {
  onSynced: () => void;
};

export default function ConnectBabylistButton({ onSynced }: ConnectBabylistButtonProps) {
  const handleConnect = async () => {
    const confirmed = window.confirm("Ready to connect your Babylist registry?");
    if (!confirmed) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 600));
    onSynced();
  };

  return (
    <button
      type="button"
      onClick={handleConnect}
      className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
    >
      Connect Babylist
    </button>
  );
}
