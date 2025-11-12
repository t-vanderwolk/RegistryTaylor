"use client";

import { useRouter } from "next/navigation";

type MemberDashboardErrorProps = {
  message: string;
};

export default function MemberDashboardError({ message }: MemberDashboardErrorProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF7FA] px-6 text-center text-[#3E2F35]">
      <h1 className="text-2xl font-semibold">We couldn’t load your dashboard.</h1>
      <p className="mt-2 max-w-md text-sm text-[#3E2F35]/75">{message}</p>
      <button
        type="button"
        onClick={() => router.refresh()}
        className="mt-6 rounded-full bg-[#C8A1B4] px-6 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white shadow-blush-soft transition hover:-translate-y-0.5"
      >
        Retry
      </button>
    </div>
  );
}
