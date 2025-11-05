"use client";

type ConnectMyRegistryButtonProps = {
  onSynced: () => void;
};

export default function ConnectMyRegistryButton({ onSynced }: ConnectMyRegistryButtonProps) {
  const handleConnect = async () => {
    const confirmed = window.confirm("Sync your MyRegistry account?");
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
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_12px_28px_rgba(200,161,180,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(200,161,180,0.34)]"
    >
      Connect MyRegistry
    </button>
  );
}
