"use client";

import { motion } from "framer-motion";

type QuizBlockProps = {
  index: number;
  question: string;
  options: string[];
  selected?: string;
  onSelect: (_option: string) => void;
};

export default function QuizBlock({ index, question, options, selected, onSelect }: QuizBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
      className="space-y-4 rounded-academy border border-blush-300/60 bg-white p-5 text-charcoal-500 shadow-blush-soft"
    >
      <p className="font-serif text-lg leading-relaxed text-charcoal-700">
        {index + 1}. {question}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {options.map((option) => {
          const isSelected = selected === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={[
                "rounded-full border px-4 py-3 text-left text-sm font-medium transition duration-200 ease-bloom",
                isSelected
                  ? "border-mauve-500 bg-mauve-500/90 text-white shadow-blush-soft"
                  : "border-blush-300/70 bg-ivory text-charcoal-500 hover:border-mauve-500 hover:bg-blush-200/40",
              ].join(" ")}
            >
              {option}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
