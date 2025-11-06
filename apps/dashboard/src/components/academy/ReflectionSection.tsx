"use client";

type ReflectionSectionProps = {
  title?: string;
  helperText?: string;
  value: string;
  onChange: (_value: string) => void;
  status: "idle" | "saving" | "saved" | "error";
  error?: string | null;
  shareWithCommunity: boolean;
  onShareToggle: (_share: boolean) => void;
  isAnonymous: boolean;
  onAnonymousToggle: (_anonymous: boolean) => void;
};

const helperCopyDefault =
  "You can share this reflection anonymously or as yourself — both ways help others grow.";

export default function ReflectionSection({
  title = "Reflection lounge",
  helperText = helperCopyDefault,
  value,
  onChange,
  status,
  error,
  shareWithCommunity,
  onShareToggle,
  isAnonymous,
  onAnonymousToggle,
}: ReflectionSectionProps) {
  const linedPaperBackground =
    "linear-gradient(180deg, rgba(234, 201, 209, 0.25) 0, rgba(234, 201, 209, 0.25) 1px, transparent 1px, transparent 42px)";

  return (
    <section className="space-y-5 rounded-academy border border-blush-300/60 bg-white/95 p-6 text-charcoal-500 shadow-blush-soft">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.32em] text-mauve-500">Reflection studio</p>
        <h3 className="font-serif text-xl text-charcoal-700">{title}</h3>
        <p className="text-sm leading-relaxed text-charcoal-400">{helperText}</p>
      </div>

      <div className="space-y-3 rounded-academy border border-blush-300/60 bg-ivory/90 p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-charcoal-300">
          <button
            type="button"
            className={[
              "rounded-full px-4 py-2 transition duration-200 ease-bloom",
              shareWithCommunity
                ? "bg-mauve-500 text-white shadow-blush-soft"
                : "bg-white text-charcoal-400 hover:bg-blush-200/60",
            ].join(" ")}
            onClick={() => onShareToggle(true)}
            aria-pressed={shareWithCommunity}
          >
            Share with Community
          </button>
          <button
            type="button"
            className={[
              "rounded-full px-4 py-2 transition duration-200 ease-bloom",
              !shareWithCommunity
                ? "bg-mauve-500 text-white shadow-blush-soft"
                : "bg-white text-charcoal-400 hover:bg-blush-200/60",
            ].join(" ")}
            onClick={() => onShareToggle(false)}
            aria-pressed={!shareWithCommunity}
          >
            Keep Private
          </button>
        </div>

        {shareWithCommunity ? (
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.28em] text-charcoal-300">
            <span>Community view</span>
            <button
              type="button"
              className={[
                "rounded-full px-3 py-2 text-[0.65rem] transition duration-200 ease-bloom",
                !isAnonymous
                  ? "bg-mauve-500 text-white shadow-blush-soft"
                  : "bg-white text-charcoal-400 hover:bg-blush-200/60",
              ].join(" ")}
              onClick={() => onAnonymousToggle(false)}
              aria-pressed={!isAnonymous}
            >
              Show my name
            </button>
            <button
              type="button"
              className={[
                "rounded-full px-3 py-2 text-[0.65rem] transition duration-200 ease-bloom",
                isAnonymous
                  ? "bg-mauve-500 text-white shadow-blush-soft"
                  : "bg-white text-charcoal-400 hover:bg-blush-200/60",
              ].join(" ")}
              onClick={() => onAnonymousToggle(true)}
              aria-pressed={isAnonymous}
            >
              Share anonymously
            </button>
          </div>
        ) : null}
      </div>

      <label className="block">
        <span className="sr-only">Reflection for this lesson</span>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="What ritual, mindset shift, or tiny habit feels worth remembering?"
          className="min-h-[160px] w-full resize-vertical rounded-academy border border-blush-300/60 bg-ivory px-5 py-4 text-sm leading-relaxed text-charcoal-500 shadow-inner focus:border-mauve-500 focus:outline-none focus:ring-2 focus:ring-mauve-300"
          style={{ backgroundImage: linedPaperBackground, backgroundSize: "100% 42px" }}
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-charcoal-400" aria-live="polite">
        <span>
          {status === "saving"
            ? "Saving..."
            : status === "saved"
            ? "Saved with love."
            : status === "error"
            ? "Auto-save paused. Try again soon."
            : "Autosaves every few breaths."}
        </span>
        {shareWithCommunity ? (
          <span className="font-semibold text-mauve-500">
            {isAnonymous ? "Shared anonymously" : "Shared as yourself"}
          </span>
        ) : (
          <span className="font-semibold text-charcoal-300">Private to you</span>
        )}
      </div>

      {error ? (
        <p className="rounded-academy border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700">{error}</p>
      ) : null}
    </section>
  );
}
