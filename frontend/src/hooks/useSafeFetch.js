<<<<<<< HEAD
import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * useSafeFetch
 * Safely handles API requests with cleanup to prevent
 * state updates after unmounting.
 */
export const useSafeFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Memoize config so it doesn’t change every render
  const config = useMemo(() => ({
    method: "GET",
    headers: { "Content-Type": "application/json" },
    ...options,
  }), [options]);

  const fetchData = useCallback(async () => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, config);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const result = await response.json();
      if (isMounted) setData(result);
    } catch (err) {
      if (isMounted) setError(err.message || "Something went wrong");
    } finally {
      if (isMounted) setLoading(false);
    }

    return () => { isMounted = false; };
  }, [url, config]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
=======
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

const defaultConfig = {
  fallback: null,
  skip: false,
  requiresAuth: false,
};

const serialize = (value) => {
  try {
    return JSON.stringify(value ?? {});
  } catch {
    return "";
  }
};

export const useSafeFetch = (url, options = {}, config = defaultConfig) => {
  const { token } = useAuth();

  const stableOptions = useMemo(() => options || {}, [serialize(options)]);
  const mergedConfig = useMemo(
    () => ({ ...defaultConfig, ...(config || {}) }),
    [serialize(config)]
  );
  const { fallback, requiresAuth, skip } = mergedConfig;

  const [data, setData] = useState(fallback ?? null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);

  const fetchOptions = useMemo(() => {
    const headers = {
      Accept: "application/json",
      ...(stableOptions.headers || {}),
    };

    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }

    return {
      credentials: "include",
      ...stableOptions,
      headers,
    };
  }, [stableOptions, token]);

  const executeFetch = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url, { ...fetchOptions, signal });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          const message = payload?.error || response.statusText || "Request failed";
          throw new Error(message);
        }

        setData(payload);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err);
        if (fallback !== undefined) {
          setData(fallback);
        }
      } finally {
        setLoading(false);
      }
    },
    [fetchOptions, fallback, url]
  );

  useEffect(() => {
    if (skip) return undefined;
    if (requiresAuth && !token) {
      setLoading(false);
      setError(new Error("Not authenticated"));
      if (fallback !== undefined) {
        setData(fallback);
      }
      return undefined;
    }
    const controller = new AbortController();
    executeFetch(controller.signal);
    return () => controller.abort();
  }, [executeFetch, requiresAuth, skip, fallback, token]);

  const refetch = useCallback(() => {
    if (requiresAuth && !token) {
      setLoading(false);
      setError(new Error("Not authenticated"));
      if (fallback !== undefined) {
        setData(fallback);
      }
      return () => {};
    }
    const controller = new AbortController();
    executeFetch(controller.signal);
    return () => controller.abort();
  }, [executeFetch, requiresAuth, fallback, token]);

  return { data, loading, error, refetch };
};

export default useSafeFetch;
>>>>>>> heroku/main
