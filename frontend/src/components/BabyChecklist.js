import React, { useState } from "react";
import ChecklistItem from "./ChecklistItem";

export default function BabyChecklist() {
  const [items, setItems] = useState([
    { label: "Set up crib 🛏️", checked: false },
    { label: "Collect baby wardrobe pieces 👕", checked: false },
    { label: "Pack hospital bag 🎒", checked: false },
    { label: "Install car seat 🚗", checked: false },
    { label: "Schedule pediatrician visit 🩺", checked: false },
  ]);

  const toggleItem = (index) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-soft border border-gold/25">
      <h2 className="text-xl font-serif font-semibold text-charcoal tracking-[0.2em] uppercase mb-4">
        Baby Prep Checklist
      </h2>
      {items.map((item, index) => (
        <ChecklistItem
          key={index}
          label={item.label}
          checked={item.checked}
          onToggle={() => toggleItem(index)}
        />
      ))}
    </div>
  );
}
