import React from "react";
import { useSafeFetch } from "../../hooks/useSafeFetch";
import EmptyState from "../../components/ui/EmptyState";

export default function RegistryManager() {
  const { data, loading, error } = useSafeFetch("/api/registry", {}, { fallback: { data: [] } });
  const registries = Array.isArray(data?.data) ? data.data : [];

  if (loading) {
    return <p className="text-sm text-darkText/70">Loading registry…</p>;
  }

  if (error) {
    return (
      <EmptyState
        title="We hit a snag"
        subtitle={error.message || "Unable to load your registries right now."}
      />
    );
  }

  if (!registries.length) {
    return <EmptyState title="No registries yet" subtitle="Add one to get started." />;
  }

  return (
    <div className="space-y-4">
      {registries.map((registry) => (
        <div
          key={registry.id}
          className="rounded-2xl border border-babyPink/40 bg-white/80 p-4 shadow-soft"
        >
          <p className="font-medium text-blueberry">{registry.title}</p>
          {registry.store && <p className="text-sm text-darkText/60">{registry.store}</p>}
          {registry.url && (
            <a
              href={registry.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-sm font-semibold text-blueberry underline"
            >
              View registry
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
