"use client";

import type { Route } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  SESSION_CACHE_MAX_AGE_MS,
  STORED_SESSION_CACHE_KEY,
  STORED_USER_KEY,
} from "@/lib/sessionKeys";
import {
  clearStoredToken,
  clearStoredUser,
  getCachedSession,
  getDashboardPath,
  getSessionUserCache,
  persistStoredUser,
  setSessionUserCache,
  type AuthenticatedUser,
} from "@/lib/auth";

const SESSION_ENDPOINT = "/api/session";
const MIN_CACHE_CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const SESSION_CACHE_CHECK_INTERVAL_MS = Math.min(
  Math.max(MIN_CACHE_CHECK_INTERVAL_MS, SESSION_CACHE_MAX_AGE_MS / 4),
  60 * 60 * 1000,
);

type SessionApiResponse = {
  authenticated: boolean;
  user: {
    id: string;
    email: string | null;
    role: AuthenticatedUser["role"];
  } | null;
  message?: string;
  error?: string;
};

async function fetchSessionUser(): Promise<AuthenticatedUser | null> {
  try {
    const response = await fetch(SESSION_ENDPOINT, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as SessionApiResponse | null;

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      const message = payload?.error ?? payload?.message ?? `Unable to refresh session (${response.status})`;
      throw new Error(message);
    }

    if (!payload?.authenticated || !payload.user) {
      return null;
    }

    return {
      id: payload.user.id,
      email: payload.user.email ?? "",
      role: payload.user.role,
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
  const [initialSessionCheckComplete, setInitialSessionCheckComplete] = useState(false);
  const resolvingRef = useRef(false);
  const initialSessionResolvedRef = useRef(false);

  useEffect(() => setHydrated(true), []);

  const markInitialSessionCheckComplete = useCallback(() => {
    if (initialSessionResolvedRef.current) {
      return;
    }
    initialSessionResolvedRef.current = true;
    setInitialSessionCheckComplete(true);
  }, []);

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

  const enforceSession = useCallback(
    async (reason: string) => {
      if (resolvingRef.current) {
        return;
      }
      resolvingRef.current = true;

      try {
        const user = await fetchSessionUser();
        if (!user) {
          softLogout(pathname.startsWith("/dashboard"));
          return;
        }

        setSessionUser(user);
        persistStoredUser(user);
        setSessionUserCache(user);
      } catch (error) {
        console.error(`SessionInitializer: ${reason} session enforcement failed`, error);
        softLogout(pathname.startsWith("/dashboard"));
      } finally {
        resolvingRef.current = false;
      }
    },
    [pathname, softLogout],
  );

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }

    const cachedSessionUser = getSessionUserCache();
    if (cachedSessionUser) {
      setSessionUser(cachedSessionUser);
      persistStoredUser(cachedSessionUser, { refreshCache: false, persistSession: false });
    } else {
      const cachedUser = getCachedSession();
      if (cachedUser) {
        setSessionUser(cachedUser);
        setSessionUserCache(cachedUser);
      } else {
        try {
          const storedRaw = window.localStorage.getItem(STORED_USER_KEY);
          if (storedRaw) {
            const storedUser = JSON.parse(storedRaw) as AuthenticatedUser;
            setSessionUser(storedUser);
            setSessionUserCache(storedUser);
          }
        } catch {
          window.localStorage.removeItem(STORED_USER_KEY);
        }
      }
    }

    let isActive = true;
    void enforceSession("initial").finally(() => {
      if (isActive) {
        markInitialSessionCheckComplete();
      }
    });

    const storageHandler = (event: StorageEvent) => {
      if (
        event.key === STORED_USER_KEY ||
        event.key === STORED_SESSION_CACHE_KEY
      ) {
        enforceSession("storage");
      }
    };

    window.addEventListener("storage", storageHandler);

    const intervalId = window.setInterval(() => {
      enforceSession("interval");
    }, SESSION_CACHE_CHECK_INTERVAL_MS);

    return () => {
      isActive = false;
      resolvingRef.current = false;
      window.removeEventListener("storage", storageHandler);
      window.clearInterval(intervalId);
    };
  }, [enforceSession, hydrated, markInitialSessionCheckComplete]);

  useEffect(() => {
    if (!initialSessionCheckComplete) {
      return;
    }

    if (sessionUser && pathname === "/login") {
      router.replace(getDashboardPath(sessionUser.role) as Route);
    }
  }, [initialSessionCheckComplete, pathname, router, sessionUser]);

  useEffect(() => {
    if (!hydrated || !sessionUser) {
      return;
    }

    if (!pathname.startsWith("/dashboard")) {
      return;
    }

    const preferredPath = getDashboardPath(sessionUser.role);
    if (!pathname.startsWith(preferredPath)) {
      router.replace(preferredPath as Route);
    }
  }, [hydrated, pathname, router, sessionUser]);

  return null;
}
