"use client";

import { TextareaHTMLAttributes } from "react";

type WorkbookInputProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function WorkbookInput({ className, ...props }: WorkbookInputProps) {
  return (
    <textarea
      {...props}
      className={[
        "w-full rounded-2xl border border-[#EED6D3] bg-white px-4 py-3 font-sans text-sm leading-relaxed text-[#3E2F35] focus:border-[#C8A6B6] focus:outline-none focus:ring-1 focus:ring-[#C8A6B6]",
        className ?? "",
      ]
        .join(" ")
        .trim()}
    />
  );
}
