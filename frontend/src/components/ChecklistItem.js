import React from "react";

export default function ChecklistItem({ label, checked, onToggle }) {
  return (
    <div className="flex items-center bg-white rounded-2xl shadow-sm p-3 mb-2 border border-gold/25 hover:bg-gold/10 transition">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="h-5 w-5 rounded blush-gold"
      />
      <span
        className={`ml-3 ${
          checked ? "line-through text-charcoal/40" : "text-charcoal"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
