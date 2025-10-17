export type AnalyticsEvent = {
  name: string;
  payload?: Record<string, unknown>;
};

export async function trackEvent(_event: AnalyticsEvent): Promise<void> {
  // No-op for now; replace with actual analytics pipeline when available.
}
