import React, { useMemo } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

const ProgressTracker = ({ value = 0, label = "Progress" }) => {
  const clampedValue = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  const chartData = useMemo(() => [{ name: "progress", value: clampedValue || 0.5 }], [clampedValue]);

  return (
    <div
      className="flex flex-col items-center gap-1 rounded-full border border-mauve/20 bg-ivory/60 p-2 shadow-soft"
      role="img"
      aria-label={`${label} ${clampedValue}%`}
    >
      <div className="h-16 w-16">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            data={chartData}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              tick={false}
            />
            <RadialBar
              dataKey="value"
              cornerRadius={50}
              fill="url(#progressGradient)"
              background={{ fill: "rgba(212, 199, 230, 0.3)" }}
              clockWise
            />
            <defs>
              <linearGradient id="progressGradient" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B48A9F" />
                <stop offset="100%" stopColor="#D9C48E" />
              </linearGradient>
            </defs>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <span className="text-[0.6rem] font-heading uppercase tracking-[0.36em] text-charcoal/60">
        {clampedValue}%
      </span>
      <p className="text-[0.55rem] font-body uppercase tracking-[0.28em] text-charcoal/40">{label}</p>
    </div>
  );
};

export default ProgressTracker;
