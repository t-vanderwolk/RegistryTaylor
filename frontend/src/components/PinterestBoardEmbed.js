import React, { useEffect, useMemo, useState } from "react";

const PINTEREST_SCRIPT_SRC = "https://assets.pinterest.com/js/pinit.js";

let pinterestScriptPromise = null;

const ensurePinterestScript = () => {
  if (typeof window !== "undefined" && window.PinUtils && typeof window.PinUtils.build === "function") {
    return Promise.resolve();
  }

  if (typeof document === "undefined") {
    return Promise.resolve();
  }

  if (pinterestScriptPromise) {
    return pinterestScriptPromise;
  }

  const existing = Array.from(document.getElementsByTagName("script")).some((script) =>
    script.src?.includes("assets.pinterest.com/js/pinit")
  );

  if (existing) {
    pinterestScriptPromise = new Promise((resolve) => {
      const checkReady = () => {
        if (window.PinUtils && typeof window.PinUtils.build === "function") {
          resolve();
        } else {
          window.requestAnimationFrame(checkReady);
        }
      };
      checkReady();
    });
    return pinterestScriptPromise;
  }

  pinterestScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PINTEREST_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      pinterestScriptPromise = null;
      reject(new Error("Failed to load Pinterest embed script."));
    };
    document.body.appendChild(script);
  });

  return pinterestScriptPromise;
};

const mockProfileStore = (() => {
  let storedBoardUrl = "";
  return {
    getBoardUrl: () => storedBoardUrl,
    saveBoardUrl: (url) => {
      storedBoardUrl = url;
      return storedBoardUrl;
    },
  };
})();

const usePinterestValidation = (url) => {
  return useMemo(() => {
    if (!url) return false;
    try {
      const parsed = new URL(url.trim());
      const host = parsed.hostname.toLowerCase();
      if (!host.endsWith("pinterest.com")) return false;
      const pathParts = parsed.pathname.split("/").filter(Boolean);
      return pathParts.length >= 2;
    } catch (error) {
      return false;
    }
  }, [url]);
};

const PinterestBoardEmbed = () => {
  const [inputValue, setInputValue] = useState("");
  const [savedUrl, setSavedUrl] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const isValidPinterestUrl = usePinterestValidation(inputValue);

  useEffect(() => {
    const existingUrl = mockProfileStore.getBoardUrl();
    if (existingUrl) {
      setInputValue(existingUrl);
      setSavedUrl(existingUrl);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const hydratePinterest = async () => {
      try {
        await ensurePinterestScript();
        if (!cancelled && savedUrl && window.PinUtils && typeof window.PinUtils.build === "function") {
          window.PinUtils.build();
        }
      } catch (scriptError) {
        if (!cancelled) {
          console.error(scriptError);
        }
      }
    };

    if (savedUrl) {
      hydratePinterest();
    } else {
      ensurePinterestScript().catch((scriptError) => {
        console.error(scriptError);
      });
    }

    return () => {
      cancelled = true;
    };
  }, [savedUrl]);

  const handleSave = (event) => {
    event.preventDefault();
    const trimmed = inputValue.trim();

    if (!trimmed) {
      setError("Please paste your Pinterest board URL.");
      setStatus("error");
      return;
    }

    if (!isValidPinterestUrl) {
      setError("That doesn’t look like a valid Pinterest board URL.");
      setStatus("error");
      return;
    }

    setStatus("saving");
    setError("");

    const stored = mockProfileStore.saveBoardUrl(trimmed);
    setSavedUrl(stored);
    setStatus("saved");
  };

  return (
<<<<<<< HEAD
    <section className="w-full max-w-3xl rounded-[2.5rem] border border-mauve/25 bg-white/95 p-6 shadow-soft sm:p-8">
      <header className="space-y-2 text-center sm:text-left">
        <p className="text-xs font-heading uppercase tracking-[0.4em] text-charcoal/60">Inspiration</p>
        <h2 className="text-2xl font-heading text-charcoal sm:text-3xl">Pinterest Mood Board</h2>
        <p className="text-sm text-charcoal/70">
=======
    <section className="w-full max-w-3xl rounded-[2.5rem] border border-babyBlue/25 bg-white/95 p-6 shadow-soft sm:p-8">
      <header className="space-y-2 text-center sm:text-left">
        <p className="text-xs font-heading uppercase tracking-[0.4em] text-blueberry/60">Inspiration</p>
        <h2 className="text-2xl font-heading text-blueberry sm:text-3xl">Pinterest Mood Board</h2>
        <p className="text-sm text-midnight/70">
>>>>>>> heroku/main
          Share your Pinterest board so Taylor can style your concierge experience around your favorite pins.
        </p>
      </header>

      <form onSubmit={handleSave} className="mt-6 space-y-4">
        <label className="block text-left">
<<<<<<< HEAD
          <span className="text-xs font-heading uppercase tracking-[0.35em] text-charcoal/60">Pinterest board URL</span>
=======
          <span className="text-xs font-heading uppercase tracking-[0.35em] text-blueberry/60">Pinterest board URL</span>
>>>>>>> heroku/main
          <input
            type="url"
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
              if (status !== "idle") setStatus("idle");
              if (error) setError("");
            }}
            placeholder="https://www.pinterest.com/username/board-name/"
<<<<<<< HEAD
            className="mt-2 w-full rounded-2xl border border-mauve/30 bg-white px-4 py-3 font-body text-sm text-charcoal shadow-inner transition focus:border-mauve focus:outline-none focus:ring-2 focus:ring-mauve/60"
=======
            className="mt-2 w-full rounded-2xl border border-babyBlue/30 bg-white px-4 py-3 font-body text-sm text-midnight shadow-inner transition focus:border-babyBlue focus:outline-none focus:ring-2 focus:ring-babyBlue/60"
>>>>>>> heroku/main
            required
          />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
<<<<<<< HEAD
          <p className={`text-xs ${isValidPinterestUrl || !inputValue ? "text-charcoal/60" : "text-rose-400"}`}>
=======
          <p className={`text-xs ${isValidPinterestUrl || !inputValue ? "text-midnight/60" : "text-rose-400"}`}>
>>>>>>> heroku/main
            Paste a full board URL with the format username/board-name.
          </p>
          <button
            type="submit"
<<<<<<< HEAD
            className="inline-flex items-center justify-center rounded-full bg-blush px-6 py-3 text-xs font-heading uppercase tracking-[0.35em] text-charcoal shadow-toy transition hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-mauve/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/60"
=======
            className="inline-flex items-center justify-center rounded-full bg-babyPink px-6 py-3 text-xs font-heading uppercase tracking-[0.35em] text-blueberry shadow-toy transition hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-babyBlue/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
>>>>>>> heroku/main
          >
            {status === "saving" ? "Saving…" : "Save Board"}
          </button>
        </div>
        <div className="min-h-[1.25rem] text-sm" aria-live="polite">
          {status === "error" && <span className="text-rose-500">{error}</span>}
<<<<<<< HEAD
          {status === "saved" && <span className="text-charcoal">Board saved to your profile.</span>}
=======
          {status === "saved" && <span className="text-blueberry">Board saved to your profile.</span>}
>>>>>>> heroku/main
        </div>
      </form>

      {savedUrl && (
        <div className="mt-8 space-y-4">
<<<<<<< HEAD
          <h3 className="text-sm font-heading uppercase tracking-[0.35em] text-charcoal/70">Your board</h3>
          <div className="rounded-[2rem] border border-mauve/20 bg-white/90 p-4 shadow-inner">
=======
          <h3 className="text-sm font-heading uppercase tracking-[0.35em] text-blueberry/70">Your board</h3>
          <div className="rounded-[2rem] border border-babyBlue/20 bg-white/90 p-4 shadow-inner">
>>>>>>> heroku/main
            <a
              data-pin-do="embedBoard"
              data-pin-board-width="560"
              data-pin-scale-height="320"
              data-pin-scale-width="80"
              href={savedUrl}
              className="block"
              aria-label="Pinterest board preview"
            >
              <span className="sr-only">Pinterest board preview</span>
            </a>
          </div>
        </div>
      )}
    </section>
  );
};

export default PinterestBoardEmbed;
