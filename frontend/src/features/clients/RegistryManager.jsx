import React from "react";
import { useSafeFetch } from "../../hooks/useSafeFetch";
<<<<<<< HEAD
import EmptyState from "../../components/ui/EmptyState";
=======
import EmptyState from "../../components/UI/EmptyState";
>>>>>>> heroku/main

export default function RegistryManager() {
  const { data, loading, error } = useSafeFetch("/api/registry", {}, { fallback: { data: [] } });
  const registries = Array.isArray(data?.data) ? data.data : [];

  if (loading) {
<<<<<<< HEAD
    return <p className="text-sm text-charcoal/70">Loading registry…</p>;
=======
    return <p className="text-sm text-darkText/70">Loading registry…</p>;
>>>>>>> heroku/main
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
<<<<<<< HEAD
          className="rounded-2xl border border-blush/40 bg-white/80 p-4 shadow-soft"
        >
          <p className="font-medium text-charcoal">{registry.title}</p>
          {registry.store && <p className="text-sm text-charcoal/60">{registry.store}</p>}
=======
          className="rounded-2xl border border-babyPink/40 bg-white/80 p-4 shadow-soft"
        >
          <p className="font-medium text-blueberry">{registry.title}</p>
          {registry.store && <p className="text-sm text-darkText/60">{registry.store}</p>}
>>>>>>> heroku/main
          {registry.url && (
            <a
              href={registry.url}
              target="_blank"
              rel="noreferrer"
<<<<<<< HEAD
              className="mt-2 inline-flex text-sm font-semibold text-charcoal underline"
=======
              className="mt-2 inline-flex text-sm font-semibold text-blueberry underline"
>>>>>>> heroku/main
            >
              View registry
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
