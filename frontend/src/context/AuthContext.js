import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

const storageKeys = {
  token: "tm_token",
  user: "tm_user",
  role: "tm_role",
};

const getStoredAuth = () => {
  try {
    const token = localStorage.getItem(storageKeys.token);
    const user = JSON.parse(localStorage.getItem(storageKeys.user) || "null");
    const role = localStorage.getItem(storageKeys.role) || user?.role || "";
    return { token, user, role };
  } catch {
    return { token: null, user: null, role: "" };
  }
};

export const AuthProvider = ({ children }) => {
  const [{ token, user, role }, setAuthState] = useState(getStoredAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const persist = useCallback((nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem(storageKeys.token, nextToken);
    } else {
      localStorage.removeItem(storageKeys.token);
    }

    if (nextUser) {
      localStorage.setItem(storageKeys.user, JSON.stringify(nextUser));
      localStorage.setItem(storageKeys.role, nextUser.role || "");
    } else {
      localStorage.removeItem(storageKeys.user);
      localStorage.removeItem(storageKeys.role);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/api/v1/auth/login", { email, password });
      const payload = response.data?.data || response.data;
      if (!payload?.token || !payload?.user) {
        throw new Error("Unexpected response from server");
      }

      persist(payload.token, payload.user);
      setAuthState({ token: payload.token, user: payload.user, role: payload.user.role || "" });
      return { success: true, user: payload.user };
    } catch (err) {
      const message = err.response?.data?.error?.message || err.message || "Unable to sign in";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const logout = useCallback(() => {
    persist(null, null);
    setAuthState({ token: null, user: null, role: "" });
  }, [persist]);

  const value = useMemo(
    () => ({ token, user, role, loading, error, login, logout, setAuthState, persist }),
    [token, user, role, loading, error, login, logout, persist]
  );

  useEffect(() => {
    if (!token) {
      setAuthState({ token: null, user: null, role: "" });
      return;
    }

    if (user) {
      return;
    }

    let cancelled = false;
    const fetchMe = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/v1/auth/profile");
        const payload = response.data?.data || response.data;
        if (payload) {
          if (!cancelled) {
            persist(token, payload);
            setAuthState({ token, user: payload, role: payload.role || "" });
          }
        }
      } catch {
        if (!cancelled) {
          persist(null, null);
          setAuthState({ token: null, user: null, role: "" });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMe();

    return () => {
      cancelled = true;
    };
  }, [token, user, persist]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
