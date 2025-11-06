import React, { useEffect, useMemo, useState } from "react";
import ConsultationSection from "../../components/ConsultationSection";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";

const emptyProfile = {
  name: "",
  phone: "",
  zip_code: "",
  parent_one_name: "",
  parent_two_name: "",
  baby_name: "",
  baby_gender: "",
  due_date: "",
  package_choice: "",
  mentor_preference: "",
  family_intro: "",
};

const Bio = () => {
  const { token, user, persist, setAuthState } = useAuth();
  const [form, setForm] = useState(emptyProfile);
  const [state, setState] = useState({ loading: true, saving: false, error: null, success: false });

  const maskEmail = useMemo(() => {
    if (!user?.email) return "";
    const [local, domain] = user.email.split("@");
    if (!domain) return user.email;
    const visible = local.slice(0, 2);
    return `${visible}${"•".repeat(Math.max(local.length - 2, 0))}@${domain}`;
  }, [user?.email]);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      setState((current) => ({ ...current, loading: true, error: null }));
      try {
        const response = await api.get("/api/v1/profile/me");
        const payload = response.data?.data || {};
        const profile = payload.profile || {};

        if (!cancelled) {
          const rawDueDate = profile.due_date || "";
          const normalizedDueDate = typeof rawDueDate === "string" ? rawDueDate.slice(0, 10) : "";

          setForm({
            name: payload.name || user?.name || "",
            phone: payload.phone || "",
            zip_code: payload.zip_code || "",
            parent_one_name: profile.parent_one_name || "",
            parent_two_name: profile.parent_two_name || "",
            baby_name: profile.baby_name || "",
            baby_gender: profile.baby_gender || "",
            due_date: normalizedDueDate,
            package_choice: profile.package_choice || "",
            mentor_preference: profile.mentor_preference || "",
            family_intro: profile.family_intro || "",
          });
          setState({ loading: false, saving: false, error: null, success: false });
        }
      } catch (error) {
        if (!cancelled) {
          const message = error.response?.data?.error?.message || "Unable to load your concierge bio.";
          setState({ loading: false, saving: false, error: message, success: false });
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user?.name]);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [field]: value }));
    setState((current) => ({ ...current, success: false, error: null }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState((current) => ({ ...current, saving: true, error: null, success: false }));

    try {
      const payload = {
        name: form.name || undefined,
        phone: form.phone || null,
        zip_code: form.zip_code || null,
        profile: {
          parent_one_name: form.parent_one_name || null,
          parent_two_name: form.parent_two_name || null,
          baby_name: form.baby_name || null,
          baby_gender: form.baby_gender || null,
          due_date: form.due_date || null,
          package_choice: form.package_choice || null,
          mentor_preference: form.mentor_preference || null,
          family_intro: form.family_intro || null,
        },
      };

      await api.put("/api/v1/profile/me", payload);

      const updatedUser = {
        ...(user || {}),
        name: form.name || user?.name || "",
        phone: form.phone || null,
        zip_code: form.zip_code || null,
        profile: {
          ...(user?.profile || {}),
          parent_one_name: form.parent_one_name || null,
          parent_two_name: form.parent_two_name || null,
          baby_name: form.baby_name || null,
          baby_gender: form.baby_gender || null,
          due_date: form.due_date || null,
          package_choice: form.package_choice || null,
          mentor_preference: form.mentor_preference || null,
          family_intro: form.family_intro || null,
        },
      };

      if (token && persist && setAuthState) {
        persist(token, updatedUser);
        setAuthState({ token, user: updatedUser, role: updatedUser.role || user?.role || "client" });
      }

      setState({ loading: false, saving: false, error: null, success: true });
    } catch (error) {
      const message = error.response?.data?.error?.message || "Unable to save your concierge bio.";
      setState({ loading: false, saving: false, error: message, success: false });
    }
  };

  if (state.loading) {
    return (
<<<<<<< HEAD
      <section className="rounded-[2.5rem] border border-blush/30 bg-white/90 p-8 text-center shadow-soft backdrop-blur-sm">
        <p className="font-heading text-charcoal">Polishing your concierge bio…</p>
=======
      <section className="rounded-[2.5rem] border border-babyPink/30 bg-white/90 p-8 text-center shadow-soft backdrop-blur-sm">
        <p className="font-heading text-blueberry">Polishing your concierge bio…</p>
>>>>>>> heroku/main
      </section>
    );
  }

  return (
    <div className="space-y-8">
<<<<<<< HEAD
      <section className="rounded-[2.5rem] border border-mauve/30 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <header className="space-y-2">
          <span className="inline-flex items-center rounded-full border border-mauve/30 bg-mauve/10 px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.3em] text-charcoal">
            Concierge Bio
          </span>
          <h1 className="font-heading text-3xl text-charcoal">Your Family Snapshot</h1>
          <p className="max-w-2xl text-sm font-body leading-relaxed text-charcoal/70">
=======
      <section className="rounded-[2.5rem] border border-babyBlue/30 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <header className="space-y-2">
          <span className="inline-flex items-center rounded-full border border-babyBlue/30 bg-babyBlue/10 px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.3em] text-blueberry">
            Concierge Bio
          </span>
          <h1 className="font-heading text-3xl text-blueberry">Your Family Snapshot</h1>
          <p className="max-w-2xl text-sm font-body leading-relaxed text-darkText/70">
>>>>>>> heroku/main
            Keep this space updated so your concierge team can anticipate needs, tailor gifting touches, and coordinate white-glove support without asking twice.
          </p>
        </header>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
<<<<<<< HEAD
          <div className="rounded-3xl border border-mauve/30 bg-mauve/10 px-5 py-4">
            <p className="text-xs font-heading uppercase tracking-[0.3em] text-charcoal/60">Primary Contact</p>
            <p className="mt-2 text-lg font-heading text-charcoal">{form.name || "Add your name"}</p>
          </div>
          <div className="rounded-3xl border border-blush/30 bg-blush/10 px-5 py-4">
            <p className="text-xs font-heading uppercase tracking-[0.3em] text-charcoal/60">Portal Email</p>
            <p className="mt-2 font-heading text-charcoal">{maskEmail}</p>
          </div>
          <div className="rounded-3xl border border-mauve/40 bg-mauve/10 px-5 py-4">
            <p className="text-xs font-heading uppercase tracking-[0.3em] text-charcoal/60">Mentor Preference</p>
            <p className="mt-2 font-heading text-charcoal">{form.mentor_preference || "Match me"}</p>
=======
          <div className="rounded-3xl border border-babyBlue/30 bg-babyBlue/10 px-5 py-4">
            <p className="text-xs font-heading uppercase tracking-[0.3em] text-darkText/60">Primary Contact</p>
            <p className="mt-2 text-lg font-heading text-blueberry">{form.name || "Add your name"}</p>
          </div>
          <div className="rounded-3xl border border-babyPink/30 bg-babyPink/10 px-5 py-4">
            <p className="text-xs font-heading uppercase tracking-[0.3em] text-darkText/60">Portal Email</p>
            <p className="mt-2 font-heading text-blueberry">{maskEmail}</p>
          </div>
          <div className="rounded-3xl border border-pastelPurple/40 bg-pastelPurple/10 px-5 py-4">
            <p className="text-xs font-heading uppercase tracking-[0.3em] text-darkText/60">Mentor Preference</p>
            <p className="mt-2 font-heading text-blueberry">{form.mentor_preference || "Match me"}</p>
>>>>>>> heroku/main
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-8">
<<<<<<< HEAD
        <section className="rounded-[2.5rem] border border-blush/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl text-charcoal">Contact Details</h2>
            <p className="text-sm font-body text-charcoal/70">Only your concierge circle sees this information.</p>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm font-body text-charcoal/70">
=======
        <section className="rounded-[2.5rem] border border-babyPink/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl text-blueberry">Contact Details</h2>
            <p className="text-sm font-body text-darkText/70">Only your concierge circle sees this information.</p>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm font-body text-darkText/70">
>>>>>>> heroku/main
              Full Name
              <input
                type="text"
                value={form.name}
                onChange={handleChange("name")}
<<<<<<< HEAD
                className="w-full rounded-2xl border border-mauve/30 bg-white/95 px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
                placeholder="Your preferred name"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-charcoal/70">
=======
                className="w-full rounded-2xl border border-babyBlue/30 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                placeholder="Your preferred name"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-darkText/70">
>>>>>>> heroku/main
              Mobile Number
              <input
                type="tel"
                value={form.phone}
                onChange={handleChange("phone")}
<<<<<<< HEAD
                className="w-full rounded-2xl border border-mauve/30 bg-white/95 px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
                placeholder="480-555-0100"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-charcoal/70">
=======
                className="w-full rounded-2xl border border-babyBlue/30 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                placeholder="480-555-0100"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-darkText/70">
>>>>>>> heroku/main
              Zip Code
              <input
                type="text"
                value={form.zip_code}
                onChange={handleChange("zip_code")}
<<<<<<< HEAD
                className="w-full rounded-2xl border border-mauve/30 bg-white/95 px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
                placeholder="85251"
              />
            </label>
            <div className="space-y-2 text-sm font-body text-charcoal/70">
=======
                className="w-full rounded-2xl border border-babyBlue/30 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                placeholder="85251"
              />
            </label>
            <div className="space-y-2 text-sm font-body text-darkText/70">
>>>>>>> heroku/main
              Concierge Email
              <input
                type="text"
                value={user?.email || ""}
                readOnly
<<<<<<< HEAD
                className="w-full cursor-not-allowed rounded-2xl border border-mauve/20 bg-slate-50/80 px-4 py-3 text-sm text-charcoal/60"
=======
                className="w-full cursor-not-allowed rounded-2xl border border-babyBlue/20 bg-slate-50/80 px-4 py-3 text-sm text-darkText/60"
>>>>>>> heroku/main
              />
            </div>
          </div>
        </section>

<<<<<<< HEAD
        <section className="rounded-[2.5rem] border border-mauve/30 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl text-charcoal">Family Details</h2>
            <p className="text-sm font-body text-charcoal/70">We use this to prep gifts, customize scripts, and update any mutual mentors.</p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm font-body text-charcoal/70">
=======
        <section className="rounded-[2.5rem] border border-babyBlue/30 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl text-blueberry">Family Details</h2>
            <p className="text-sm font-body text-darkText/70">We use this to prep gifts, customize scripts, and update any mutual mentors.</p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm font-body text-darkText/70">
>>>>>>> heroku/main
              Parent One Name
              <input
                type="text"
                value={form.parent_one_name}
                onChange={handleChange("parent_one_name")}
<<<<<<< HEAD
                className="w-full rounded-2xl border border-blush/40 bg-white/95 px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
                placeholder="Avery Parker"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-charcoal/70">
=======
                className="w-full rounded-2xl border border-babyPink/40 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                placeholder="Avery Parker"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-darkText/70">
>>>>>>> heroku/main
              Parent Two Name
              <input
                type="text"
                value={form.parent_two_name}
                onChange={handleChange("parent_two_name")}
<<<<<<< HEAD
                className="w-full rounded-2xl border border-blush/40 bg-white/95 px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
                placeholder="Jordan Parker"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-charcoal/70">
=======
                className="w-full rounded-2xl border border-babyPink/40 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                placeholder="Jordan Parker"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-darkText/70">
>>>>>>> heroku/main
              Baby Name
              <input
                type="text"
                value={form.baby_name}
                onChange={handleChange("baby_name")}
<<<<<<< HEAD
                className="w-full rounded-2xl border border-mauve/40 bg-white/95 px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
                placeholder="Baby Parker"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-charcoal/70">
=======
                className="w-full rounded-2xl border border-pastelPurple/40 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                placeholder="Baby Parker"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-darkText/70">
>>>>>>> heroku/main
              Baby Style / Gender
              <input
                type="text"
                value={form.baby_gender}
                onChange={handleChange("baby_gender")}
<<<<<<< HEAD
                className="w-full rounded-2xl border border-mauve/40 bg-white/95 px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
                placeholder="Girl"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-charcoal/70">
=======
                className="w-full rounded-2xl border border-pastelPurple/40 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                placeholder="Girl"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-darkText/70">
>>>>>>> heroku/main
              Due Date
              <input
                type="date"
                value={form.due_date || ""}
                onChange={handleChange("due_date")}
<<<<<<< HEAD
                className="w-full rounded-2xl border border-mauve/30 bg-white/95 px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-charcoal/70">
=======
                className="w-full rounded-2xl border border-babyBlue/30 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-darkText/70">
>>>>>>> heroku/main
              Package Choice
              <input
                type="text"
                value={form.package_choice}
                onChange={handleChange("package_choice")}
<<<<<<< HEAD
                className="w-full rounded-2xl border border-mauve/30 bg-white/95 px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
=======
                className="w-full rounded-2xl border border-babyBlue/30 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
>>>>>>> heroku/main
                placeholder="Signature Taylor-Made"
              />
            </label>
          </div>
        </section>

<<<<<<< HEAD
        <section className="rounded-[2.5rem] border border-blush/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl text-charcoal">Concierge Introduction</h2>
            <p className="text-sm font-body text-charcoal/70">
              Share a quick hello or special context so every mentor greets you with the right energy from the first call.
            </p>
          </div>
          <label className="mt-6 block space-y-2 text-sm font-body text-charcoal/70">
=======
        <section className="rounded-[2.5rem] border border-babyPink/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl text-blueberry">Concierge Introduction</h2>
            <p className="text-sm font-body text-darkText/70">
              Share a quick hello or special context so every mentor greets you with the right energy from the first call.
            </p>
          </div>
          <label className="mt-6 block space-y-2 text-sm font-body text-darkText/70">
>>>>>>> heroku/main
            Your Brief Intro
            <textarea
              value={form.family_intro}
              onChange={handleChange("family_intro")}
              rows={4}
              maxLength={480}
<<<<<<< HEAD
              className="w-full rounded-3xl border border-blush/40 bg-white/95 px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
              placeholder="We’re blending modern desert neutrals with heirlooms and love surprise-and-delight moments."
            />
            <span className="block text-right text-[0.65rem] font-heading uppercase tracking-[0.3em] text-charcoal/50">
=======
              className="w-full rounded-3xl border border-babyPink/40 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
              placeholder="We’re blending modern desert neutrals with heirlooms and love surprise-and-delight moments."
            />
            <span className="block text-right text-[0.65rem] font-heading uppercase tracking-[0.3em] text-darkText/50">
>>>>>>> heroku/main
              {form.family_intro.length}/480
            </span>
          </label>
        </section>

<<<<<<< HEAD
        <section className="rounded-[2.5rem] border border-mauve/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl text-charcoal">Mentor Preferences</h2>
            <p className="text-sm font-body text-charcoal/70">Let us know if there is someone you adore working with or a vibe we should match.</p>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[2fr,1fr]">
            <label className="space-y-2 text-sm font-body text-charcoal/70">
=======
        <section className="rounded-[2.5rem] border border-pastelPurple/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl text-blueberry">Mentor Preferences</h2>
            <p className="text-sm font-body text-darkText/70">Let us know if there is someone you adore working with or a vibe we should match.</p>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[2fr,1fr]">
            <label className="space-y-2 text-sm font-body text-darkText/70">
>>>>>>> heroku/main
              Preferred Mentor
              <input
                type="text"
                value={form.mentor_preference}
                onChange={handleChange("mentor_preference")}
<<<<<<< HEAD
                className="w-full rounded-2xl border border-mauve/40 bg-white/95 px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
                placeholder="Morgan Ellis"
              />
            </label>
            <div className="rounded-3xl border border-mauve/30 bg-mauve/10 px-5 py-4 text-sm font-body leading-relaxed text-charcoal/70">
              <p className="font-heading text-sm text-charcoal">Why we ask</p>
=======
                className="w-full rounded-2xl border border-pastelPurple/40 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                placeholder="Morgan Ellis"
              />
            </label>
            <div className="rounded-3xl border border-babyBlue/30 bg-babyBlue/10 px-5 py-4 text-sm font-body leading-relaxed text-darkText/70">
              <p className="font-heading text-sm text-blueberry">Why we ask</p>
>>>>>>> heroku/main
              <p>
                Sharing your mentor vibe helps us route the right specialist, whether you crave registry strategy, nursery styling, or emotional concierge touches.
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={state.saving}
<<<<<<< HEAD
            className={`rounded-full bg-blush px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-charcoal shadow-pop transition ${
=======
            className={`rounded-full bg-babyPink px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition ${
>>>>>>> heroku/main
              state.saving ? "cursor-wait opacity-70" : "hover:-translate-y-1 hover:shadow-dreamy"
            }`}
          >
            {state.saving ? "Saving…" : "Save Bio"}
          </button>
          {state.success && (
<<<<<<< HEAD
            <span className="text-sm font-heading uppercase tracking-[0.25em] text-charcoal">
=======
            <span className="text-sm font-heading uppercase tracking-[0.25em] text-blueberry">
>>>>>>> heroku/main
              Saved and synced with concierge ✨
            </span>
          )}
          {state.error && (
            <span className="text-sm font-heading uppercase tracking-[0.25em] text-rose-500">
              {state.error}
            </span>
          )}
        </div>
      </form>

<<<<<<< HEAD
      <section className="rounded-[2.5rem] border border-blush/40 bg-white/95 p-0 shadow-soft backdrop-blur-sm">
        <div className="space-y-3 border-b border-blush/30 px-8 py-6">
          <h2 className="font-heading text-2xl text-charcoal">Need to refine something live?</h2>
          <p className="text-sm font-body text-charcoal/70">
=======
      <section className="rounded-[2.5rem] border border-babyPink/40 bg-white/95 p-0 shadow-soft backdrop-blur-sm">
        <div className="space-y-3 border-b border-babyPink/30 px-8 py-6">
          <h2 className="font-heading text-2xl text-blueberry">Need to refine something live?</h2>
          <p className="text-sm font-body text-darkText/70">
>>>>>>> heroku/main
            Book a quick concierge huddle to fine-tune registry picks, nursery progress, or celebration plans.
          </p>
        </div>
        <div className="px-2 pb-8 pt-4 sm:px-4">
          <ConsultationSection />
        </div>
      </section>
    </div>
  );
};

export default Bio;
