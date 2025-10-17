import { cn } from "../lib/utils";

const RADIUS = 48;
const STROKE = 9;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressRing({
  label,
  value,
  total,
  className,
}: {
  label: string;
  value: number;
  total: number;
  className?: string;
}) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white/90 p-6 text-center shadow-soft transition duration-300 ease-studio hover:shadow-lifted",
        "after:pointer-events-none after:absolute after:inset-x-10 after:-top-10 after:h-20 after:rounded-full after:bg-tmBlush/40 after:blur-3xl",
        className
      )}
    >
      <div className="relative mx-auto mb-5 h-32 w-32 rounded-full bg-mauve-blush/70 p-3">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            className="text-tmBlush/40"
            stroke="currentColor"
            strokeWidth={STROKE}
            fill="transparent"
            r={RADIUS}
            cx="60"
            cy="60"
          />
          <circle
            className="text-tmMauve transition-[stroke-dashoffset] duration-700 ease-studio"
            stroke="currentColor"
            strokeWidth={STROKE}
            strokeLinecap="round"
            fill="transparent"
            r={RADIUS}
            cx="60"
            cy="60"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm">
          <span className="font-heading text-2xl text-tmMauve">{percentage}%</span>
        </div>
      </div>
      <div className="space-y-2">
        <p className="font-heading text-xl text-tmCharcoal">{label}</p>
        <p className="text-sm font-medium text-tmCharcoal/70">
          {value} of {total} modules
        </p>
      </div>
    </div>
  );
}
