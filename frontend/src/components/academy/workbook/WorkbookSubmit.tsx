"use client";

import { motion } from "framer-motion";

type WorkbookSubmitProps = {
  label?: string;
  onClick: () => void;
  saving: boolean;
  saved: boolean;
};

export default function WorkbookSubmit({ label = "Save workbook", onClick, saving, saved }: WorkbookSubmitProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EED6D3] bg-white px-5 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70">
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className="inline-flex items-center gap-2 rounded-full bg-[#EED6D3] px-4 py-2 text-[#3E2F35] transition hover:bg-[#C8A6B6] hover:text-white"
        disabled={saving}
      >
        {saving ? "Saving…" : label}
      </motion.button>
      <span>{saved ? "Saved" : saving ? "Hold on" : ""}</span>
    </div>
  );
}
