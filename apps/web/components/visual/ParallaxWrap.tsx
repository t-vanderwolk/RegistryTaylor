"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useCallback } from "react";

export function ParallaxWrap({ children }: { children: ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 80, damping: 20, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 80, damping: 20, mass: 0.6 });

  const translateX = useTransform(springX, (value) => `${value}px`);
  const translateY = useTransform(springY, (value) => `${value}px`);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 24;
    const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 24;
    x.set(offsetX);
    y.set(offsetY);
  }, [x, y]);

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <div
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-tmIvory via-white to-tmBlush/40"
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      <motion.div
        aria-hidden
        style={{ x: translateX, y: translateY }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(238,216,223,0.5),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(122,89,104,0.2),_transparent_55%)]"
      />
      <div className="relative z-10 px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-12">
        {children}
      </div>
    </div>
  );
}
