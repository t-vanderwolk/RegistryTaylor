"use client";

import { useState } from "react";
import { API_BASE } from "../lib/api";
import { cn } from "../lib/utils";

export type ChecklistItem = {
  id: string;
  text: string;
};

export function ApplyChecklist({
  moduleId,
  items,
  initialState,
}: {
  moduleId: string;
  items: ChecklistItem[];
  initialState: Record<string, boolean>;
}) {
  const [state, setState] = useState<Record<string, boolean>>(initialState);
  const [loading, setLoading] = useState<string | null>(null);

  const toggleItem = async (itemId: string) => {
    const nextValue = !state[itemId];
    setState((prev) => ({ ...prev, [itemId]: nextValue }));
    setLoading(itemId);
    try {
      const response = await fetch(`${API_BASE}/api/progress/${moduleId}/checklist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ itemId, checked: nextValue }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Unable to update progress");
      }
      setState(json.data.checklist_state ?? {});
    } catch (error) {
      console.error(error);
      setState((prev) => ({ ...prev, [itemId]: !nextValue }));
      window.alert("We couldn't save that checklist item. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const completedCount = Object.values(state).filter(Boolean).length;

  return (
    <div className="card-surface bg-tmIvory/80 px-6 py-7">
      <header className="mb-6 space-y-1">
        <h3 className="font-heading text-xl text-tmCharcoal">Apply Checklist</h3>
        <p className="text-sm text-tmCharcoal/70">
          Check off tasks as you complete them—the system saves automatically.
        </p>
        <p className="text-xs font-semibold uppercase tracking-wide text-tmMauve">
          {completedCount} of {items.length} complete
        </p>
      </header>
      <ul className="space-y-3">
        {items.map((item) => {
          const checked = Boolean(state[item.id]);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                disabled={loading === item.id}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition duration-200 ease-studio focus:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-tmIvory",
                  checked
                    ? "border-tmGold/70 bg-white text-tmMauve shadow-soft"
                    : "border-transparent bg-white/80 text-tmCharcoal hover:border-tmGold/60 hover:bg-white"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border",
                    checked
                      ? "border-tmGold bg-tmBlush text-tmMauve"
                      : "border-tmMauve/40 bg-tmIvory/60 text-transparent"
                  )}
                >
                  {checked ? "✓" : "•"}
                </span>
                <span className="text-sm leading-relaxed text-tmCharcoal/90">
                  {item.text}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
