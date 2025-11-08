import axios, { type Method } from "axios";
import { STORED_TOKEN_KEY } from "@/lib/sessionKeys";

export type ApiFetchOptions = RequestInit;

function normalizeApiBase(rawUrl: string): string {
  const trimmed = rawUrl.trim().replace(/\/+$/, "");
  if (!trimmed) {
    return "http://localhost:5050";
  }

  const suffixes = ["/api", "/api/v1"];
  const lowered = trimmed.toLowerCase();
  for (const suffix of suffixes) {
    if (lowered.endsWith(suffix)) {
      return trimmed.slice(0, -suffix.length) || trimmed;
    }
  }

  return trimmed;
}

export const API_URL = normalizeApiBase(
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:5050",
);

export function buildApiPath(endpoint: string): string {
  if (!endpoint) {
    return "/api";
  }
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }

  const prefixed = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  if (prefixed === "/api" || prefixed.startsWith("/api/")) {
    return prefixed;
  }
  return `/api${prefixed}`;
}

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

function getBrowserStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage.getItem(STORED_TOKEN_KEY);
  } catch {
    return null;
  }
}

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getBrowserStoredToken();
    if (token) {
      config.headers = config.headers ?? {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

export default apiClient;

function toPlainHeaders(headers?: HeadersInit): Record<string, string> {
  if (!headers) return {};
  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }
  if (Array.isArray(headers)) {
    return headers.reduce<Record<string, string>>((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  }
  return { ...headers };
}

function parseBody(body?: BodyInit | null): unknown {
  if (!body) return undefined;
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return body;
    }
  }
  return body;
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const headers = toPlainHeaders(options.headers);
  if (!headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const url = buildApiPath(endpoint);

  try {
    const response = await apiClient.request<T>({
      url,
      method: (options.method ?? "GET") as Method,
      data: parseBody(options.body),
      headers,
      withCredentials:
        options.credentials !== undefined
          ? options.credentials === "include"
          : true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string; error?: { message?: string } })
          ?.message ||
        (error.response?.data as { message?: string; error?: { message?: string } })
          ?.error?.message ||
        error.message ||
        "API request failed.";
      throw new Error(message);
    }
    throw error instanceof Error
      ? error
      : new Error("API request failed. Please try again.");
  }
}
