export default function ChecklistItem({ label, checked, onToggle }) {
  return (
    <div className="flex items-center bg-white/90 rounded-2xl shadow-sm p-3 mb-2 border border-babyPink/40 hover:bg-babyPink/10 transition">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="h-5 w-5 rounded accent-babyPink"
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
