export type ApiFetchOptions = RequestInit;

function resolveBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:5050"
  );
}

function buildUrl(endpoint: string): string {
  const base = resolveBaseUrl().replace(/\/$/, "");
  if (!endpoint.startsWith("/")) {
    return `${base}/${endpoint}`;
  }
  return `${base}${endpoint}`;
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildUrl(endpoint), {
    ...options,
    headers,
    credentials: options.credentials ?? "include",
  });

  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) {
    let message = `API error: ${endpoint}`;
    if (contentType.includes("application/json")) {
      try {
        const errorBody = await response.json();
        message = errorBody?.error?.message ?? errorBody?.message ?? message;
      } catch {
        // Ignore JSON parse errors and fall back to default message.
      }
    }
    throw new Error(message);
  }

  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return null as T;
}
