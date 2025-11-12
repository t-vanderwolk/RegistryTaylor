"use client";

import { useCallback, useEffect, useState } from "react";
import type { Route } from "next";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickAccessCards from "@/components/dashboard/QuickAccessCards";
import ProgressOverview from "@/components/dashboard/ProgressOverview";
import ReflectionPanel from "@/components/dashboard/ReflectionPanel";
import AnnouncementsFeed from "@/components/dashboard/AnnouncementsFeed";
import MessagesPanel from "@/components/dashboard/MessagesPanel";
import MobileFooterNav from "@/components/dashboard/MobileFooterNav";
import LearnSpotlight from "@/components/dashboard/LearnSpotlight";
import type { MemberDashboardPayload } from "@/app/dashboard/member/types";
import { STORED_TOKEN_KEY } from "@/lib/sessionKeys";

type StatusState = "loading" | "ready" | "error";

export default function MemberDashboard() {
  const [status, setStatus] = useState<StatusState>("loading");
  const [payload, setPayload] = useState<MemberDashboardPayload | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem(STORED_TOKEN_KEY) : null;
      if (!token) {
        setStatus("error");
        setErrorMessage("Your session has ended. Please log in again.");
        return;
      }

      const response = await fetch("/api/member-dashboard", {
        cache: "no-store",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error ?? "Unable to load your dashboard.");
      }
      const data = (await response.json()) as MemberDashboardPayload;
      setPayload(data);
      setStatus("ready");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load your dashboard.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (status === "loading" || !payload) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF7FA] text-[#3E2F35]">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/70">
          Curating your dashboard…
        </p>
      </div>
    );
  }

  if (status === "error" || !payload) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF7FA] px-6 text-center text-[#3E2F35]">
        <h1 className="text-2xl font-semibold">We couldn’t load your dashboard.</h1>
        <p className="mt-2 max-w-md text-sm text-[#3E2F35]/75">{errorMessage}</p>
        <button
          type="button"
          onClick={loadDashboard}
          className="mt-6 rounded-full bg-[#C8A1B4] px-6 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white shadow-blush-soft transition hover:-translate-y-0.5"
        >
          Retry
        </button>
      </div>
    );
  }

  const { header, quickAccess, progress, reflections, communityHighlights, announcements, messages, learn } = payload;

  return (
    <div className="relative min-h-screen bg-[#FFF7FA]">
      <main className="mx-auto flex max-w-[1200px] flex-col gap-12 px-6 pb-24 pt-16 sm:px-10 lg:px-12">
        <DashboardHeader {...header} />

        <QuickAccessCards {...quickAccess} />

        <LearnSpotlight modules={learn.modules} />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-12">
            <ProgressOverview {...progress} />
            <ReflectionPanel reflections={reflections} communityHighlights={communityHighlights} />
          </div>
          <div className="space-y-12">
            <AnnouncementsFeed
              announcements={announcements.map((item) => ({
                ...item,
                href: item.href as Route,
              }))}
            />
            <MessagesPanel {...messages} />
          </div>
        </div>
      </main>
      <MobileFooterNav />
    </div>
  );
}
