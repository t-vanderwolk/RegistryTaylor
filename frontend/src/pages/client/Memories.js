import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PinterestBoardEmbed from "../../components/PinterestBoardEmbed";

const initialMemories = [
  {
    id: "nursery-progress",
    type: "photo",
    title: "Nursery paint day",
    description: "Soft lavender accent wall is up and the crib is staged for final styling.",
    capturedAt: "Apr 9, 2025",
    image: null,
    accent: "bg-babyPink/35",
    emoji: "🎨",
  },
  {
    id: "registry-surprise",
    type: "note",
    title: "Registry surprise",
    description: "Grandma mailed the vintage rocking horse we loved. Added to the memories tab and sent Taylor photos.",
    capturedAt: "Apr 2, 2025",
    accent: "bg-babyBlue/30",
    emoji: "📦",
  },
  {
    id: "shower-toast",
    type: "note",
    title: "Sip & See toast",
    description: "Pinned a quote we want on the welcome sign so the design team has it ready.",
    capturedAt: "Mar 28, 2025",
    accent: "bg-pastelPurple/35",
    emoji: "🥂",
  },
];

const memoryPrompts = [
  "What made you smile today?",
  "Add a note about baby's latest kick or hiccup",
  "Pin inspiration for the shower or welcome home playlist",
  "Drop a photo of the nursery as it comes together",
];

const Memories = () => {
  const [memories, setMemories] = useState(initialMemories);
  const [noteForm, setNoteForm] = useState({ title: "", description: "" });
  const [photoForm, setPhotoForm] = useState({ title: "", file: null });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    if (!noteForm.title.trim() || !noteForm.description.trim()) {
      setStatusMessage("Add a title and memory before saving.");
      return;
    }

    const newMemory = {
      id: `note-${Date.now()}`,
      type: "note",
      title: noteForm.title.trim(),
      description: noteForm.description.trim(),
      capturedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      accent: "bg-babyBlue/25",
      emoji: "📝",
    };

    setMemories((current) => [newMemory, ...current]);
    setNoteForm({ title: "", description: "" });
    setStatusMessage("Saved to Memories. Taylor can see it in your portal thread.");
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPhotoForm((current) => ({ ...current, file: null }));
      setPhotoPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPhotoForm({ title: file.name.replace(/\.[^.]+$/, ""), file });
    setPhotoPreview(previewUrl);
  };

  const handlePhotoSubmit = (event) => {
    event.preventDefault();
    if (!photoForm.file || !photoPreview) {
      setStatusMessage("Choose a photo before uploading.");
      return;
    }

    const newMemory = {
      id: `photo-${Date.now()}`,
      type: "photo",
      title: photoForm.title.trim() || "Nursery moment",
      description: "Uploaded for Taylor to style and archive.",
      capturedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      image: photoPreview,
      accent: "bg-babyPink/25",
      emoji: "📸",
    };

    setMemories((current) => [newMemory, ...current]);
    setPhotoForm({ title: "", file: null });
    setPhotoPreview(null);
    setStatusMessage("Photo ready for your concierge team.");
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] border border-babyBlue/30 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <header className="space-y-4">
          <span className="inline-flex items-center rounded-full border border-babyBlue/30 bg-babyBlue/20 px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.35em] text-blueberry">
            Memories & Moments
          </span>
          <h1 className="font-heading text-3xl text-blueberry sm:text-4xl">Capture the details Taylor should celebrate.</h1>
          <p className="max-w-3xl text-sm font-body leading-relaxed text-darkText/70">
            Add photos, notes, and little heartbeats of your journey. Everything here is private to your concierge circle and helps us personalize gifts, decor, and milestone surprises.
          </p>
        </header>
        {statusMessage && (
          <p className="mt-6 rounded-3xl border border-babyBlue/30 bg-babyBlue/10 px-4 py-3 text-sm font-body text-blueberry">
            {statusMessage}
          </p>
        )}
      </section>

      <section className="rounded-[2.5rem] border border-babyPink/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={handlePhotoSubmit} className="flex flex-col gap-4 rounded-[2rem] border border-babyPink/40 bg-babyPink/10 p-6">
            <header>
              <p className="text-xs font-heading uppercase tracking-[0.35em] text-darkText/50">Upload a photo</p>
              <h2 className="mt-2 font-heading text-xl text-blueberry">Share a nursery moment</h2>
              <p className="mt-2 text-sm text-darkText/70">Images are stored securely and help Taylor storyboard reveals.</p>
            </header>
            <label className="flex flex-col gap-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry/70">
              Photo title
              <input
                type="text"
                value={photoForm.title}
                onChange={(event) => setPhotoForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="E.g. Crib styling sneak peek"
                className="rounded-2xl border border-babyPink/40 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none focus:ring-2 focus:ring-babyBlue/30"
              />
            </label>
            <label className="flex flex-col gap-3 rounded-2xl border border-dotted border-babyPink/50 bg-white/80 px-4 py-6 text-center text-sm text-darkText/70">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <span className="font-heading text-blueberry">Drag a file here or tap to browse</span>
              <span className="text-xs text-darkText/50">PNG, JPG up to 10MB</span>
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Memory preview"
                  className="mx-auto mt-3 h-32 w-full max-w-xs rounded-2xl object-cover shadow-soft"
                />
              )}
            </label>
            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-babyPink px-6 py-3 text-xs font-heading uppercase tracking-[0.35em] text-blueberry shadow-pop transition hover:-translate-y-1 hover:shadow-dreamy"
            >
              Save photo to memories
            </button>
          </form>

          <form onSubmit={handleNoteSubmit} className="flex flex-col gap-4 rounded-[2rem] border border-babyBlue/30 bg-babyBlue/10 p-6">
            <header>
              <p className="text-xs font-heading uppercase tracking-[0.35em] text-darkText/50">Add a note</p>
              <h2 className="mt-2 font-heading text-xl text-blueberry">Pin a memory or quote</h2>
              <p className="mt-2 text-sm text-darkText/70">Perfect for recording kicks, cravings, song lyrics, or gratitude lists.</p>
            </header>
            <label className="flex flex-col gap-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry/70">
              Title
              <input
                type="text"
                value={noteForm.title}
                onChange={(event) => setNoteForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="E.g. Baby's first hiccups"
                className="rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none focus:ring-2 focus:ring-babyBlue/30"
              />
            </label>
            <label className="flex flex-col gap-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry/70">
              Memory details
              <textarea
                rows={5}
                value={noteForm.description}
                onChange={(event) => setNoteForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Describe the moment so Taylor can weave it into gifts or styling."
                className="rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none focus:ring-2 focus:ring-babyBlue/30"
              />
            </label>
            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-babyBlue px-6 py-3 text-xs font-heading uppercase tracking-[0.35em] text-blueberry shadow-pop transition hover:-translate-y-1 hover:shadow-dreamy"
            >
              Save note to memories
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-babyBlue/30 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <div className="space-y-3">
          <h2 className="font-heading text-2xl text-blueberry">Recent additions</h2>
          <p className="text-sm font-body text-darkText/70">Your latest memories live here. Taylor and your mentor can view them instantly.</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {memories.map((memory) => (
            <article
              key={memory.id}
              className={`flex h-full flex-col gap-3 rounded-[2rem] border border-babyBlue/25 bg-white/95 p-6 shadow-soft`}
            >
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-heading uppercase tracking-[0.3em] text-blueberry ${memory.accent}`}>
                <span>{memory.emoji}</span>
                <span>{memory.capturedAt}</span>
              </div>
              <h3 className="font-heading text-lg text-blueberry">{memory.title}</h3>
              <p className="text-sm font-body leading-relaxed text-darkText/75">{memory.description}</p>
              {memory.image && (
                <img
                  src={memory.image}
                  alt={memory.title}
                  className="mt-2 h-40 w-full rounded-2xl object-cover shadow-soft"
                />
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-babyPink/30 bg-white/95 p-6 shadow-soft backdrop-blur-sm sm:p-8">
        <div className="space-y-3">
          <h2 className="font-heading text-2xl text-blueberry">Pin your inspiration</h2>
          <p className="text-sm font-body text-darkText/70">
            Drop the Pinterest board that captures your nursery vibe, shower dreams, or registry inspo. Taylor will reference it while curating your concierge plan.
          </p>
        </div>
        <div className="mt-6">
          <PinterestBoardEmbed />
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-pastelPurple/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <div className="space-y-3">
          <h2 className="font-heading text-2xl text-blueberry">Need inspiration?</h2>
          <p className="text-sm font-body text-darkText/70">Use these prompts to keep sharing magic. Taylor uses them to curate gifts, signage, and styling details.</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {memoryPrompts.map((prompt) => (
            <article
              key={prompt}
              className="rounded-[2rem] border border-pastelPurple/40 bg-white px-5 py-5 text-left shadow-soft"
            >
              <p className="font-heading text-blueberry">{prompt}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-darkText/60">
          <span>Want a printable keepsake?</span>
          <Link
            to="../messages"
            className="inline-flex items-center justify-center rounded-full border border-babyBlue/30 bg-white px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.3em] text-blueberry hover:-translate-y-0.5 hover:bg-babyPink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
          >
            Ask Taylor for a memory book
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Memories;
