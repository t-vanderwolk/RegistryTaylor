"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type ScrollProgressProps = {
  className?: string;
  color?: string;
  backgroundColor?: string;
  height?: number;
  onProgressChange?: (_percent: number) => void;
};

export default function ScrollProgress({
  className,
  color = "#C8A6B6",
  backgroundColor = "#F8F6F3",
  height = 4,
  onProgressChange,
}: ScrollProgressProps) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const next = max <= 0 ? 0 : Math.min(100, Math.max(0, (doc.scrollTop / max) * 100));
      setPercent(next);
      onProgressChange?.(next);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onProgressChange]);

  return (
    <div
      className={["pointer-events-none fixed inset-x-0 top-0 z-40", className ?? ""].join(" ").trim()}
      style={{ height }}
      aria-hidden
    >
      <div className="h-full w-full" style={{ backgroundColor }} />
      <motion.div
        className="absolute left-0 top-0 h-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ ease: "easeOut", duration: 0.2 }}
      />
    </div>
  );
}
