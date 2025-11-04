"use client";

import { useMemo, type ReactNode } from "react";

type ProgressRingProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
};

export default function ProgressRing({
  value,
  size = 72,
  strokeWidth = 6,
  trackColor = "#E8E3E1",
  progressColor = "#D6C1C7",
  className = "",
  children,
  ariaLabel = "Module progress",
}: ProgressRingProps) {
  const { radius, circumference, dashOffset, clamped } = useMemo(() => {
    const clampedValue = Math.max(0, Math.min(100, value));
    const computedRadius = (size - strokeWidth) / 2;
    const computedCircumference = 2 * Math.PI * computedRadius;
    const computedDashOffset = computedCircumference - (clampedValue / 100) * computedCircumference;
    return {
      radius: computedRadius,
      circumference: computedCircumference,
      dashOffset: computedDashOffset,
      clamped: clampedValue,
    };
  }, [size, strokeWidth, value]);

  return (
    <div
      className={[
        "relative flex items-center justify-center rounded-full bg-[#FAF9F7]",
        className,
      ]
        .join(" ")
        .trim()}
      style={{ width: size, height: size }}
      aria-label={ariaLabel}
      role="img"
    >
      <svg
        width={size}
        height={size}
        className="translate-x-px translate-y-px"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-xs font-semibold text-[#3E2F35]">
        {children ?? <span>{clamped}%</span>}
      </div>
    </div>
  );
}
