"use client";

import type { Route } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  SESSION_CACHE_MAX_AGE_MS,
  STORED_SESSION_CACHE_KEY,
  STORED_TOKEN_KEY,
  STORED_USER_KEY,
} from "@/lib/sessionKeys";
import {
  clearStoredToken,
  clearStoredUser,
  fetchAuthenticatedUser,
  getCachedSession,
  getDashboardPath,
  getSessionUserCache,
  persistStoredUser,
  setSessionUserCache,
  type AuthenticatedUser,
} from "@/lib/auth";

function normalizeOrigin(origin?: string | null) {
  if (!origin) {
    return null;
  }
  try {
    return new URL(origin).origin;
  } catch {
    return origin.replace(/\/$/, "");
  }
}

function resolveSiteOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL) ?? process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "http://localhost:5050";
}

function resolveApiBaseUrl() {
  return (
    normalizeOrigin(process.env.NEXT_PUBLIC_API_URL) ??
    normalizeOrigin(process.env.API_URL) ??
    resolveSiteOrigin()
  );
}

function getSessionEndpoint() {
  return `${resolveApiBaseUrl()}/api/auth/session`;
}
const MIN_CACHE_CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const SESSION_CACHE_CHECK_INTERVAL_MS = Math.min(
  Math.max(MIN_CACHE_CHECK_INTERVAL_MS, SESSION_CACHE_MAX_AGE_MS / 4),
  60 * 60 * 1000,
);

async function requestSessionUser(token: string): Promise<AuthenticatedUser | null> {
  try {
    const sessionEndpoint = getSessionEndpoint();
    const response = await fetch(sessionEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      cache: "no-store",
    });

    const payload = await response.json().catch(() => null);

    if (response.status === 401 || response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const message =
        (payload && typeof payload === "object" && "message" in payload
          ? (payload as Record<string, unknown>).message
          : null) ?? `Unable to refresh session (${response.status})`;
      throw new Error(String(message));
    }

    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid session payload");
    }

    const data = payload as { id: string; email: string; role: AuthenticatedUser["role"] };

    return {
      id: data.id,
      email: data.email,
      role: data.role,
      name: null,
    };
  } catch (error) {
    console.error("SessionInitializer: session request failed", error);
    throw error instanceof Error ? error : new Error("Unable to refresh session");
  }
}

export default function SessionInitializer() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const [hydrated, setHydrated] = useState(false);
  const [sessionUser, setSessionUser] = useState<AuthenticatedUser | null>(null);
  const resolvingRef = useRef(false);
  const memberRedirectTimeout = useRef<number | null>(null);

  useEffect(() => setHydrated(true), []);

  const softLogout = useCallback(
    (shouldRedirect: boolean) => {
      try {
        clearStoredUser();
        clearStoredToken();
        setSessionUser(null);
        setSessionUserCache(null);
      } finally {
        if (shouldRedirect && pathname !== "/login") {
          router.replace("/login");
        }
      }
    },
    [pathname, router],
  );

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }

    let bootstrappedUser = false;
    const cachedSessionUser = getSessionUserCache();
    if (cachedSessionUser) {
      bootstrappedUser = true;
      setSessionUser(cachedSessionUser);
      persistStoredUser(cachedSessionUser, { refreshCache: false, persistSession: false });
    }

    const token = window.localStorage.getItem(STORED_TOKEN_KEY);
    const hasCookie = typeof document !== "undefined" && document.cookie.includes("token=");
    if ((token || hasCookie) && !bootstrappedUser) {
      fetchAuthenticatedUser()
        .then((user) => {
          if (!user) {
            softLogout(pathname.startsWith("/dashboard"));
            return;
          }
          setSessionUser(user);
          persistStoredUser(user);
        })
        .catch(() => softLogout(pathname.startsWith("/dashboard")));
    } else if (!token && !hasCookie && !bootstrappedUser && pathname.startsWith("/dashboard")) {
      softLogout(true);
    }
  }, [hydrated, pathname, router, softLogout]);

  useEffect(() => {
    if (sessionUser && pathname === "/login") {
      router.replace(getDashboardPath(sessionUser.role) as Route);
    }
  }, [pathname, router, sessionUser]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }

    if (!sessionUser || sessionUser.role !== "MEMBER") {
      if (memberRedirectTimeout.current) {
        window.clearTimeout(memberRedirectTimeout.current);
        memberRedirectTimeout.current = null;
      }
      return;
    }

    if (!pathname.startsWith("/dashboard") || pathname.startsWith("/dashboard/member")) {
      return;
    }

    if (memberRedirectTimeout.current) {
      return;
    }

    memberRedirectTimeout.current = window.setTimeout(() => {
      router.replace("/dashboard/member");
      memberRedirectTimeout.current = null;
    }, 150);

    return () => {
      if (memberRedirectTimeout.current) {
        window.clearTimeout(memberRedirectTimeout.current);
        memberRedirectTimeout.current = null;
      }
    };
  }, [hydrated, pathname, router, sessionUser]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }

    let active = true;

    const hydrateFromCache = (cached: AuthenticatedUser) => {
      setSessionUser(cached);
      const storedUserRaw = window.localStorage.getItem(STORED_USER_KEY);
      if (!storedUserRaw) {
        persistStoredUser(cached, { refreshCache: false });
      }
    };

    const enforceSession = async (reason: string) => {
      if (!active || resolvingRef.current) {
        return;
      }
      resolvingRef.current = true;

      try {
        const token = window.localStorage.getItem(STORED_TOKEN_KEY);
        const hasCookie = typeof document !== "undefined" && document.cookie.includes("token=");
        const onDashboard = pathname.startsWith("/dashboard");
        const onLogin = pathname === "/login";

        if (!token && !hasCookie) {
          softLogout(onDashboard);
          return;
        }

        if (!token && hasCookie) {
          return;
        }

        if (!token) {
          return;
        }

        const cachedUser = getCachedSession();
        if (cachedUser) {
          hydrateFromCache(cachedUser);
          if (onLogin) {
            router.replace(getDashboardPath(cachedUser.role) as Route);
          }
          return;
        }

        const verifiedUser = await requestSessionUser(token);

        if (!verifiedUser) {
          softLogout(onDashboard);
          return;
        }

        persistStoredUser(verifiedUser);

        if (onLogin) {
          router.replace(getDashboardPath(verifiedUser.role) as Route);
        }
      } catch (error) {
        console.error(`SessionInitializer: ${reason} session enforcement failed`, error);
      } finally {
        resolvingRef.current = false;
      }
    };

    enforceSession("initial");

    const storageHandler = (event: StorageEvent) => {
      if (
        event.key === STORED_TOKEN_KEY ||
        event.key === STORED_USER_KEY ||
        event.key === STORED_SESSION_CACHE_KEY
      ) {
        enforceSession("storage");
      }
    };

    window.addEventListener("storage", storageHandler);

    const intervalId = window.setInterval(() => {
      const cachedUser = getCachedSession();
      if (!cachedUser) {
        enforceSession("interval");
      }
    }, SESSION_CACHE_CHECK_INTERVAL_MS);

    return () => {
      active = false;
      resolvingRef.current = false;
      window.removeEventListener("storage", storageHandler);
      window.clearInterval(intervalId);
      if (memberRedirectTimeout.current) {
        window.clearTimeout(memberRedirectTimeout.current);
        memberRedirectTimeout.current = null;
      }
    };
  }, [hydrated, pathname, router, softLogout]);

  return null;
}
