"use client";

import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function Badge({
  title,
  description,
  iconSvg,
  className,
}: {
  title: string;
  description: string;
  iconSvg?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "flex max-w-lg items-center gap-4 rounded-2xl border border-tmBlush/60 bg-white/90 px-6 py-4 shadow-soft backdrop-blur",
        className
      )}
    >
      {iconSvg ? (
        <div
          className="hidden h-14 w-14 shrink-0 md:block"
          dangerouslySetInnerHTML={{ __html: iconSvg }}
        />
      ) : null}
      <div className="space-y-1">
        <p className="font-heading text-lg text-tmMauve">{title}</p>
        <p className="text-sm text-tmCharcoal/70">{description}</p>
      </div>
    </motion.div>
  );
}
