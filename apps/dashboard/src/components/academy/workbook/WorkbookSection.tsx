"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WorkbookSection as WorkbookSectionDefinition } from "@/types/academy";
import type { WorkbookSectionState } from "@/app/dashboard/academy/workbook/workbookApi";
import WorkbookCheckbox from "./WorkbookCheckbox";
import WorkbookInput from "./WorkbookInput";
import WorkbookReflection from "./WorkbookReflection";

type WorkbookSectionProps = {
  section: WorkbookSectionDefinition;
  state: WorkbookSectionState;
  onChange: (_next: WorkbookSectionState) => void;
  onReflectSave?: (_value: string) => Promise<void>;
};

export default function WorkbookSection({ section, state, onChange, onReflectSave }: WorkbookSectionProps) {
  const [open, setOpen] = useState(section.type !== "tip" && section.type !== "milestone");

  const toggle = () => setOpen((prev) => !prev);

  const completionRatio = (() => {
    if (section.type === "checklist" && section.items.length > 0) {
      const completed = section.items.reduce((count, item, index) => {
        const key = String(index);
        return state.checklist?.[key] ? count + 1 : count;
      }, 0);
      return completed / section.items.length;
    }
    if (section.type === "text") {
      return state.text && state.text.trim().length > 0 ? 1 : 0;
    }
    if (section.type === "reflection") {
      return state.reflection && state.reflection.trim().length > 0 ? 1 : 0;
    }
    return state.completed ? 1 : 0;
  })();

  const headerAdornment = section.type === "milestone" ? `${Math.round((completionRatio || 0) * 100)}%` : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#EED6D3] bg-white">
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between gap-4 bg-[#EED6D3]/60 px-5 py-4 text-left"
      >
        <div className="space-y-1">
          <p className="font-serif text-lg text-[#3E2F35]">{section.title}</p>
          {section.description ? (
            <p className="text-xs uppercase tracking-[0.28em] text-[#3E2F35]/60">{section.description}</p>
          ) : null}
        </div>
        <span className="text-xs uppercase tracking-[0.28em] text-[#3E2F35]/50">
          {headerAdornment}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-4 px-5 py-4 text-sm text-[#3E2F35]/85"
          >
            {renderContent(section, state, onChange, onReflectSave)}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function renderContent(
  section: WorkbookSectionDefinition,
  state: WorkbookSectionState,
  onChange: (next: WorkbookSectionState) => void,
  onReflectSave?: (value: string) => Promise<void>
) {
  switch (section.type) {
    case "checklist":
      return (
        <div className="space-y-3">
          {section.items.map((item, index) => {
            const key = String(index);
            const checked = Boolean(state.checklist?.[key]);
            return (
              <WorkbookCheckbox
                key={key}
                label={item}
                checked={checked}
                onChange={(nextChecked) => {
                  onChange({
                    ...state,
                    checklist: { ...(state.checklist ?? {}), [key]: nextChecked },
                  });
                }}
              />
            );
          })}
        </div>
      );
    case "text":
      return (
        <WorkbookInput
          value={state.text ?? ""}
          onChange={(event) => onChange({ ...state, text: event.target.value })}
          rows={4}
          placeholder={section.placeholder ?? "Write your notes…"}
        />
      );
    case "reflection":
      return (
        <WorkbookReflection
          prompt={section.prompt ?? "What stood out for you?"}
          value={state.reflection ?? ""}
          onChange={(value) => onChange({ ...state, reflection: value })}
          onSave={onReflectSave}
        />
      );
    case "tip":
      return (
        <div className="rounded-2xl border border-[#EED6D3] bg-[#F8F6F3] p-4 text-sm leading-relaxed text-[#3E2F35]/85">
          {section.content}
        </div>
      );
    case "milestone":
      return (
        <div className="space-y-2 text-center text-sm text-[#3E2F35]">
          {section.headline ? <p className="font-serif text-lg">{section.headline}</p> : null}
          {section.message ? <p>{section.message}</p> : null}
        </div>
      );
    case "submit":
      return (
        <div className="space-y-2 text-sm text-[#3E2F35]/85">
          {section.ctaDescription ? <p>{section.ctaDescription}</p> : null}
        </div>
      );
    case "registry":
      return (
        <p className="text-sm text-[#3E2F35]/85">
          This workbook section highlights a registry item inside the lesson content.
        </p>
      );
    default:
      return null;
  }
}
