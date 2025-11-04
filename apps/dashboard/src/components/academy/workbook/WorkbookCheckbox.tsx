"use client";

type WorkbookCheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (_checked: boolean) => void;
};

export default function WorkbookCheckbox({ label, checked, onChange }: WorkbookCheckboxProps) {
  return (
    <label className="flex items-start gap-3 text-sm leading-relaxed text-[#3E2F35]/85">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-[#C8A6B6] text-[#C8A6B6] focus:ring-[#C8A6B6]"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
