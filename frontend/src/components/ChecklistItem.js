import React from "react";

export default function ChecklistItem({ label, checked, onToggle }) {
  return (
    <div className="flex items-center bg-white rounded-2xl shadow-sm p-3 mb-2 border border-softGold/25 hover:bg-softGold/10 transition">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="h-5 w-5 rounded accent-softGold"
      />
      <span
        className={`ml-3 ${
          checked ? "line-through text-cozyGray/40" : "text-cozyGray"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
