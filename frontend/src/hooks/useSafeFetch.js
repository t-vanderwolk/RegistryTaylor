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