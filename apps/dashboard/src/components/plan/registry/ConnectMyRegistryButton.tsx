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
      className="inline-flex items-center gap-2 rounded-full bg-tm-rose px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-tm-charcoal shadow-soft transition hover:-translate-y-0.5 hover:bg-tm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tm-focus"
    >
      Connect MyRegistry
    </button>
  );
}
