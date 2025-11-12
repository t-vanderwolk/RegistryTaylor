import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MemberDashboardClient from "./MemberDashboardClient";
import MemberDashboardError from "./MemberDashboardError";
import type { MemberDashboardPayload } from "@/app/dashboard/member/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MEMBER_DASHBOARD_ENDPOINT = "/api/member-dashboard";
const MEMBER_HOME_ROUTE = "/dashboard/member";

function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.SITE_URL) {
    return process.env.SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

async function fetchMemberDashboard(): Promise<MemberDashboardPayload> {
  const cookieStore = cookies();
  const url = new URL(MEMBER_DASHBOARD_ENDPOINT, resolveSiteUrl());
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const serializedCookies = cookieStore.toString();
  if (serializedCookies) {
    headers.Cookie = serializedCookies;
  }

  const token = cookieStore.get("token")?.value;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    headers,
    cache: "no-store",
  });

  if (response.status === 401) {
    redirect(`/login?redirect=${encodeURIComponent(MEMBER_HOME_ROUTE)}`);
  }

  if (!response.ok) {
    let message = "Unable to load your dashboard.";
    try {
      const body = (await response.json()) as { error?: string; message?: string };
      message = body?.error ?? body?.message ?? message;
    } catch {
      // ignore JSON parse issues and fall back to default message
    }
    throw new Error(message);
  }

  return (await response.json()) as MemberDashboardPayload;
}

export default async function MemberDashboardPage() {
  try {
    const payload = await fetchMemberDashboard();
    return <MemberDashboardClient payload={payload} />;
  } catch (error) {
    console.error("member/page: failed to load dashboard", error);
    const message = error instanceof Error ? error.message : "Unable to load your dashboard.";
    return <MemberDashboardError message={message} />;
  }
}
