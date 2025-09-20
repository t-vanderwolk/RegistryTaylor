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
      <section className="rounded-[2.5rem] border border-babyPink/30 bg-white/90 p-8 text-center shadow-soft backdrop-blur-sm">
        <p className="font-heading text-blueberry">Polishing your concierge bio…</p>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] border border-babyBlue/30 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <header className="space-y-2">
          <span className="inline-flex items-center rounded-full border border-babyBlue/30 bg-babyBlue/10 px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.3em] text-blueberry">
            Concierge Bio
          </span>
          <h1 className="font-heading text-3xl text-blueberry">Your Family Snapshot</h1>
          <p className="max-w-2xl text-sm font-body leading-relaxed text-darkText/70">
            Keep this space updated so your concierge team can anticipate needs, tailor gifting touches, and coordinate white-glove support without asking twice.
          </p>
        </header>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
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
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-[2.5rem] border border-babyPink/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl text-blueberry">Contact Details</h2>
            <p className="text-sm font-body text-darkText/70">Only your concierge circle sees this information.</p>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm font-body text-darkText/70">
              Full Name
              <input
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                className="w-full rounded-2xl border border-babyBlue/30 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                placeholder="Your preferred name"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-darkText/70">
              Mobile Number
              <input
                type="tel"
                value={form.phone}
                onChange={handleChange("phone")}
                className="w-full rounded-2xl border border-babyBlue/30 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                placeholder="480-555-0100"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-darkText/70">
              Zip Code
              <input
                type="text"
                value={form.zip_code}
                onChange={handleChange("zip_code")}
                className="w-full rounded-2xl border border-babyBlue/30 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                placeholder="85251"
              />
            </label>
            <div className="space-y-2 text-sm font-body text-darkText/70">
              Concierge Email
              <input
                type="text"
                value={user?.email || ""}
                readOnly
                className="w-full cursor-not-allowed rounded-2xl border border-babyBlue/20 bg-slate-50/80 px-4 py-3 text-sm text-darkText/60"
              />
            </div>
          </div>
        </section>

        <section className="rounded-[2.5rem] border border-babyBlue/30 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl text-blueberry">Family Details</h2>
            <p className="text-sm font-body text-darkText/70">We use this to prep gifts, customize scripts, and update any mutual mentors.</p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm font-body text-darkText/70">
              Parent One Name
              <input
                type="text"
                value={form.parent_one_name}
                onChange={handleChange("parent_one_name")}
                className="w-full rounded-2xl border border-babyPink/40 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                placeholder="Avery Parker"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-darkText/70">
              Parent Two Name
              <input
                type="text"
                value={form.parent_two_name}
                onChange={handleChange("parent_two_name")}
                className="w-full rounded-2xl border border-babyPink/40 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                placeholder="Jordan Parker"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-darkText/70">
              Baby Name
              <input
                type="text"
                value={form.baby_name}
                onChange={handleChange("baby_name")}
                className="w-full rounded-2xl border border-pastelPurple/40 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                placeholder="Baby Parker"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-darkText/70">
              Baby Style / Gender
              <input
                type="text"
                value={form.baby_gender}
                onChange={handleChange("baby_gender")}
                className="w-full rounded-2xl border border-pastelPurple/40 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                placeholder="Girl"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-darkText/70">
              Due Date
              <input
                type="date"
                value={form.due_date || ""}
                onChange={handleChange("due_date")}
                className="w-full rounded-2xl border border-babyBlue/30 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm font-body text-darkText/70">
              Package Choice
              <input
                type="text"
                value={form.package_choice}
                onChange={handleChange("package_choice")}
                className="w-full rounded-2xl border border-babyBlue/30 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                placeholder="Signature Taylor-Made"
              />
            </label>
          </div>
        </section>

        <section className="rounded-[2.5rem] border border-babyPink/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl text-blueberry">Concierge Introduction</h2>
            <p className="text-sm font-body text-darkText/70">
              Share a quick hello or special context so every mentor greets you with the right energy from the first call.
            </p>
          </div>
          <label className="mt-6 block space-y-2 text-sm font-body text-darkText/70">
            Your Brief Intro
            <textarea
              value={form.family_intro}
              onChange={handleChange("family_intro")}
              rows={4}
              maxLength={480}
              className="w-full rounded-3xl border border-babyPink/40 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
              placeholder="We’re blending modern desert neutrals with heirlooms and love surprise-and-delight moments."
            />
            <span className="block text-right text-[0.65rem] font-heading uppercase tracking-[0.3em] text-darkText/50">
              {form.family_intro.length}/480
            </span>
          </label>
        </section>

        <section className="rounded-[2.5rem] border border-pastelPurple/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl text-blueberry">Mentor Preferences</h2>
            <p className="text-sm font-body text-darkText/70">Let us know if there is someone you adore working with or a vibe we should match.</p>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[2fr,1fr]">
            <label className="space-y-2 text-sm font-body text-darkText/70">
              Preferred Mentor
              <input
                type="text"
                value={form.mentor_preference}
                onChange={handleChange("mentor_preference")}
                className="w-full rounded-2xl border border-pastelPurple/40 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                placeholder="Morgan Ellis"
              />
            </label>
            <div className="rounded-3xl border border-babyBlue/30 bg-babyBlue/10 px-5 py-4 text-sm font-body leading-relaxed text-darkText/70">
              <p className="font-heading text-sm text-blueberry">Why we ask</p>
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
            className={`rounded-full bg-babyPink px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition ${
              state.saving ? "cursor-wait opacity-70" : "hover:-translate-y-1 hover:shadow-dreamy"
            }`}
          >
            {state.saving ? "Saving…" : "Save Bio"}
          </button>
          {state.success && (
            <span className="text-sm font-heading uppercase tracking-[0.25em] text-blueberry">
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

      <section className="rounded-[2.5rem] border border-babyPink/40 bg-white/95 p-0 shadow-soft backdrop-blur-sm">
        <div className="space-y-3 border-b border-babyPink/30 px-8 py-6">
          <h2 className="font-heading text-2xl text-blueberry">Need to refine something live?</h2>
          <p className="text-sm font-body text-darkText/70">
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
