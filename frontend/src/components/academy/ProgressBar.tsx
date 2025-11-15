type ProgressBarProps = {
  percent: number;
  label?: string;
};

export default function ProgressBar({ percent, label }: ProgressBarProps) {
  const value = Math.max(0, Math.min(100, Math.round(percent)));

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#3E2F35]/60">
          {label}
        </p>
      )}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-[#EADFE5]">
        <span
          style={{ width: `${value}%` }}
          className="absolute left-0 top-0 h-full rounded-full bg-tm-mauve transition-all duration-500 ease-out"
        />
      </div>
      <p className="text-xs font-medium text-[#3E2F35]/70">{value}% complete</p>
    </div>
  );
}
