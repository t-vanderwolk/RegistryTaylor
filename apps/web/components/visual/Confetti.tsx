"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";

const SHAPES = Array.from({ length: 14 }, (_, index) => index);

export function Confetti({ active }: { active: boolean }) {
  const [visible, setVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!active || prefersReducedMotion) {
      return;
    }
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 2600);
    return () => window.clearTimeout(timer);
  }, [active, prefersReducedMotion]);

  const shimmerPieces = useMemo(() => {
    if (!visible) return [];
    return SHAPES.map((item) => {
      const left = Math.random() * 100;
      const delay = Math.random() * 0.5;
      const duration = 1.6 + Math.random() * 0.6;
      const scale = 0.8 + Math.random() * 0.6;
      const hue = 330 + Math.random() * 20;
      return { id: item, left, delay, duration, scale, hue };
    });
  }, [visible]);

  if (!visible || prefersReducedMotion) {
    return null;
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
        {shimmerPieces.map(({ id, left, delay, duration, scale, hue }) => (
          <span
            key={id}
            className="absolute h-14 w-3 rounded-full opacity-0 will-change-transform"
            style={
              {
                left: `${left}%`,
                animation: `tm-confetti-fall ${duration}s ease-out ${delay}s forwards`,
                backgroundColor: `hsla(${hue}, 60%, 85%, 0.9)`,
                ["--tm-scale" as keyof CSSProperties]: scale,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <style jsx global>{`
        @keyframes tm-confetti-fall {
          0% {
            transform: translate3d(0, -20%, 0) rotate(0deg) scale(var(--tm-scale, 1));
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            transform: translate3d(0, 110vh, 0) rotate(360deg) scale(var(--tm-scale, 1));
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
