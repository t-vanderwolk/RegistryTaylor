import React, { useState } from "react";
import Button from "../../design-system/Button";

type JournalPromptProps = {
  prompt: string;
  value: string;
  onChange: (value: string) => void;
  onSave?: (value: string) => Promise<void> | void;
  saving?: boolean;
  updatedAt?: string | null;
  disabled?: boolean;
};

const JournalPrompt: React.FC<JournalPromptProps> = ({
  prompt,
  value,
  onChange,
  onSave,
  saving = false,
  updatedAt,
  disabled = false,
}) => {
  const [touched, setTouched] = useState(false);

  const handleSave = async () => {
    if (!onSave) return;
    await onSave(value);
    setTouched(false);
  };

  return (
    <div className="space-y-4 rounded-[2.5rem] border border-mauve/25 bg-white/95 p-6 shadow-soft sm:p-8">
      <header className="space-y-2">
        <span className="inline-flex items-center rounded-full bg-mauve/20 px-3 py-1 text-[0.65rem] font-heading uppercase tracking-[0.4em] text-mauve">
          Journal Prompt
        </span>
        <p className="text-sm text-charcoal/75">{prompt}</p>
      </header>
      <label className="block space-y-3">
        <span className="sr-only">Your reflection</span>
        <textarea
          value={value}
          onChange={(event) => {
            setTouched(true);
            onChange(event.target.value);
          }}
          rows={5}
          disabled={disabled}
          className="w-full rounded-3xl border border-mauve/30 bg-ivory px-4 py-3 text-sm text-charcoal shadow-inner transition focus:border-mauve focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:cursor-not-allowed disabled:opacity-70"
          placeholder="Capture your reflections here. We’ll share this with your mentor when you’re ready."
        />
      </label>
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-heading uppercase tracking-[0.35em] text-charcoal/55">
        <div>
          {updatedAt ? (
            <span>Saved {new Date(updatedAt).toLocaleString()}</span>
          ) : (
            <span>Not yet saved</span>
          )}
        </div>
        {onSave && (
          <Button
            type="button"
            variant="mauve"
            size="sm"
            className="min-w-[160px]"
            disabled={saving || disabled || (!touched && !value)}
            onClick={handleSave}
          >
            {saving ? "Saving…" : touched ? "Save Reflection" : "Saved"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default JournalPrompt;
