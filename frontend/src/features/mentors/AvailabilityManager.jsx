import React, { useState } from "react";

export default function AvailabilityManager() {
  const [slots, setSlots] = useState([]);

  const addSlot = () => {
    const iso = new Date().toISOString();
    setSlots((current) => [...current, iso]);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-blush/40 bg-white/80 p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif text-charcoal">Availability</h3>
        <button
          type="button"
          onClick={addSlot}
          className="rounded-xl bg-mauve px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-dreamy"
        >
          Add Slot
        </button>
      </div>
      {!slots.length && (
        <p className="text-sm text-charcoal/60">No availability set yet. Add your first slot.</p>
      )}
      <ul className="space-y-2 text-sm text-charcoal/70">
        {slots.map((slot) => (
          <li key={slot} className="rounded-xl border border-blush/30 bg-blush/10 px-3 py-2">
            {new Date(slot).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
