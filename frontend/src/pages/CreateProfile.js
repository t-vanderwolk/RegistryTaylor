import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BABY_GENDER_OPTIONS = [
  { value: "", label: "Select preference" },
  { value: "boy", label: "Boy" },
  { value: "girl", label: "Girl" },
  { value: "surprise", label: "Surprise!" },
  { value: "prefer_not", label: "Prefer not to say" },
];

const PACKAGE_OPTIONS = [
  { value: "concierge", label: "Concierge" },
  { value: "registry", label: "Registry" },
  { value: "nursery", label: "Nursery Design" },
];

const MENTOR_AVAILABILITY = [
  { value: "", label: "Select availability" },
  { value: "weekdays_9_5", label: "Weekdays, 9–5" },
  { value: "weeknights_5_9", label: "Weeknights, 5–9" },
  { value: "weekends", label: "Weekends" },
  { value: "flexible", label: "Flexible" },
];

const PROGRESS_STEPS = [
  { id: "invite", label: "Invite Code" },
  { id: "profile", label: "Create Profile" },
  { id: "portal", label: "Portal Access" },
];

const MENTOR_PREFERENCE_HINTS = [
  "No preference",
  "Keep me with Taylor",
  "A mentor who’s walked my path",
  "A calm scheduling pro",
];

const initialFormState = (role) => ({
  parentOneName: "",
  parentTwoName: "",
  babyName: "",
  babyGender: "",
  email: "",
  password: "",
  phone: "",
  zipCode: "",
  photoDataUrl: "",
  photoFileName: "",
  ...(role === "client"
    ? {
        dueDate: "",
        packageChoice: "",
        mentorPreference: "",
      }
    : {
        specialty: "",
        bio: "",
        availability: "",
        maxClients: "",
        certificationFiles: [],
      }),
});

const validationRules = (role, data) => {
  const errors = {};

  if (!data.parentOneName.trim()) {
    errors.parentOneName = "We need at least one parent name to personalize things.";
  }
  if (!data.email.trim()) {
    errors.email = "Email is required.";
  }
  if (!data.password || data.password.length < 8) {
    errors.password = "Use at least 8 characters for a secure password.";
  }
  if (!data.zipCode.trim()) {
    errors.zipCode = "ZIP helps us plan deliveries.";
  }

  if (role === "client") {
    if (!data.dueDate) errors.dueDate = "When is baby arriving?";
    if (!data.packageChoice) errors.packageChoice = "Choose the package that feels right.";
  } else {
    if (!data.specialty.trim()) errors.specialty = "Share your specialty so families know your magic.";
    if (!data.bio.trim()) errors.bio = "A short bio helps clients connect with you.";
    if (!data.availability) errors.availability = "Let families know when you shine.";
    if (!data.maxClients || Number(data.maxClients) <= 0)
      errors.maxClients = "How many families can you support at once?";
  }

  return errors;
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const CreateProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const rawRole = location.state?.role || searchParams.get("role");
  const role = rawRole === "mentor" ? "mentor" : "client";
  const inviteCode =
    location.state?.inviteCode ||
    searchParams.get("invite") ||
    searchParams.get("code") ||
    "123";
  const invitedEmail =
    location.state?.invitedEmail ||
    location.state?.email ||
    searchParams.get("email") ||
    "";

  const [formData, setFormData] = useState(() => ({
    ...initialFormState(role),
    email: invitedEmail,
  }));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const storageKey = useMemo(
    () => `tm_create_profile_${role}_${inviteCode}`,
    [inviteCode, role],
  );

  useEffect(() => {
    setDraftLoaded(false);
    setFormData({ ...initialFormState(role), email: invitedEmail });
    setErrors({});
    setSubmitError("");
  }, [role, invitedEmail, inviteCode]);

  useEffect(() => {
    let cancelled = false;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!cancelled) {
          setFormData((current) => ({
            ...current,
            ...parsed,
            email: invitedEmail || parsed.email || current.email,
          }));
        }
      }
    } catch (error) {
      console.warn("Unable to load saved profile draft", error);
    } finally {
      if (!cancelled) setDraftLoaded(true);
    }

    return () => {
      cancelled = true;
    };
  }, [invitedEmail, storageKey]);

  useEffect(() => {
    if (!draftLoaded) return;
    localStorage.setItem(storageKey, JSON.stringify(formData));
  }, [draftLoaded, formData, storageKey]);

  const destinations = {
    client: "/client-portal",
    mentor: "/mentor-portal",
  };

  const handleInputChange = (field) => (event) => {
    let { value } = event.target;
    if (event.target.type === "number") {
      value = value.replace(/[^0-9]/g, "");
    }

    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFormData((current) => ({
        ...current,
        photoDataUrl: "",
        photoFileName: "",
      }));
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setFormData((current) => ({
        ...current,
        photoDataUrl: dataUrl,
        photoFileName: file.name,
      }));
    } catch {
      setSubmitError("We couldn’t preview that photo. Try another?");
    }
  };

  const handleCertificationsChange = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      setFormData((current) => ({ ...current, certificationFiles: [] }));
      return;
    }

    try {
      const mapped = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          dataUrl: await readFileAsDataUrl(file),
        })),
      );
      setFormData((current) => ({ ...current, certificationFiles: mapped }));
    } catch {
      setSubmitError("We couldn’t preview those certifications. Give it one more go?");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    const validationErrors = validationRules(role, formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        role,
        inviteCode,
        ...formData,
        ...(role === "mentor" && formData.maxClients
          ? { maxClients: Number(formData.maxClients) }
          : {}),
      };

      const response = await fetch("/api/v1/profile/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = (await response.json().catch(() => ({})))?.error?.message;
        throw new Error(message || "We couldn’t save your profile just yet.");
      }

      localStorage.removeItem(storageKey);
      navigate(destinations[role] || "/portal", { replace: true });
    } catch (error) {
      setSubmitError(error.message || "We couldn’t save your profile just yet.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderProgress = () => (
    <div className="flex flex-wrap items-center justify-center gap-5 text-xs uppercase tracking-[0.35em] text-slate-400">
      {PROGRESS_STEPS.map((step, index) => {
        const isActive = step.id === "profile";
        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-[0.65rem] font-semibold ${
                  isActive ? "border-babyPink bg-babyPink/40 text-blueberry" : "border-white/40 bg-white/40"
                }`}
              >
                {index + 1}
              </span>
              <span className={isActive ? "text-blueberry" : undefined}>{step.label}</span>
            </div>
            {index < PROGRESS_STEPS.length - 1 && <span className="text-slate-300">—</span>}
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <main className="min-h-screen bg-cream text-darkText">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8">
        <div className="rounded-[2.75rem] border border-babyBlue/30 bg-gradient-to-br from-white via-cream to-babyBlue/20 p-10 shadow-soft">
          <div className="flex flex-col items-center gap-6 text-center">
            {renderProgress()}
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-babyBlue">Create Profile</p>
              <h1 className="mt-3 font-playful text-4xl text-blueberry">
                Welcome to Taylor Made Baby Planning
              </h1>
              <p className="mt-4 max-w-2xl text-sm text-slate-600">
                A couple of thoughtful details and your sparkly concierge tools will be ready. We’ll tuck everything safely away as you go so nothing gets lost.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-12">
            <section className="rounded-[2.5rem] border border-babyBlue/30 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="font-heading text-lg text-blueberry">Family Basics</h2>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Tell us who we’re celebrating
                </p>
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <label className="text-sm">
                  Parent 1 Name
                  <input
                    type="text"
                    value={formData.parentOneName}
                    onChange={handleInputChange("parentOneName")}
                    className="mt-2 w-full rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
                    placeholder="Taylor Made"
                    required
                  />
                  {errors.parentOneName && <p className="mt-1 text-xs text-babyPink">{errors.parentOneName}</p>}
                </label>

                <label className="text-sm">
                  Parent 2 Name (optional)
                  <input
                    type="text"
                    value={formData.parentTwoName}
                    onChange={handleInputChange("parentTwoName")}
                    className="mt-2 w-full rounded-2xl border border-babyBlue/20 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
                    placeholder="We love doting partners and grandparents too"
                  />
                </label>

                <label className="text-sm">
                  Baby Name
                  <input
                    type="text"
                    value={formData.babyName}
                    onChange={handleInputChange("babyName")}
                    className="mt-2 w-full rounded-2xl border border-babyBlue/20 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
                    placeholder="Optional — we love surprises too!"
                  />
                </label>

                <label className="text-sm">
                  Baby Gender (optional)
                  <select
                    value={formData.babyGender}
                    onChange={handleInputChange("babyGender")}
                    className="mt-2 w-full rounded-2xl border border-babyBlue/20 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
                  >
                    {BABY_GENDER_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm">
                  Invite Email
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    readOnly={Boolean(invitedEmail)}
                    className={`mt-2 w-full rounded-2xl px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none ${
                      invitedEmail
                        ? "cursor-not-allowed border border-babyBlue/20 bg-babyBlue/10"
                        : "border border-babyBlue/40 bg-white"
                    }`}
                    placeholder="you@taylormadebaby.com"
                    required
                  />
                  {errors.email && <p className="mt-1 text-xs text-babyPink">{errors.email}</p>}
                </label>

                <label className="text-sm">
                  Password
                  <input
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange("password")}
                    className="mt-2 w-full rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
                    placeholder="Create a secure password"
                    required
                  />
                  {errors.password && <p className="mt-1 text-xs text-babyPink">{errors.password}</p>}
                </label>

                <label className="text-sm">
                  Phone (optional)
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange("phone")}
                    className="mt-2 w-full rounded-2xl border border-babyBlue/20 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
                    placeholder="(123) 456-7890"
                  />
                </label>

                <label className="text-sm">
                  Zip Code
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={handleInputChange("zipCode")}
                    className="mt-2 w-full rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
                    placeholder="ZIP to tailor deliveries"
                    required
                  />
                  {errors.zipCode && <p className="mt-1 text-xs text-babyPink">{errors.zipCode}</p>}
                </label>

                <label className="text-sm lg:col-span-2">
                  Profile Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="mt-2 w-full rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry file:mr-4 file:rounded-full file:border-0 file:bg-babyPink/40 file:px-4 file:py-2 file:text-xs file:font-heading file:uppercase file:tracking-[0.3em] file:text-blueberry"
                  />
                  {formData.photoDataUrl && (
                    <div className="mt-4 inline-flex items-center gap-4 rounded-2xl border border-babyBlue/30 bg-babyBlue/10 p-4">
                      <img
                        src={formData.photoDataUrl}
                        alt="Profile preview"
                        className="h-16 w-16 rounded-2xl object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-blueberry">{formData.photoFileName}</p>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((current) => ({
                              ...current,
                              photoDataUrl: "",
                              photoFileName: "",
                            }))
                          }
                          className="text-xs font-heading uppercase tracking-[0.3em] text-blueberry"
                        >
                          Remove photo
                        </button>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </section>

            {role === "client" ? (
              <section className="rounded-[2.5rem] border border-babyPink/35 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <h2 className="font-heading text-lg text-blueberry">Client Concierge Details</h2>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Shape your bespoke plan</p>
                </div>
                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <label className="text-sm">
                    Due Date
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={handleInputChange("dueDate")}
                      className="mt-2 w-full rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
                      required
                    />
                    {errors.dueDate && <p className="mt-1 text-xs text-babyPink">{errors.dueDate}</p>}
                  </label>

                  <label className="text-sm">
                    Package Choice
                    <select
                      value={formData.packageChoice}
                      onChange={handleInputChange("packageChoice")}
                      className="mt-2 w-full rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
                      required
                    >
                      <option value="" disabled>
                        Choose your concierge package
                      </option>
                      {PACKAGE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.packageChoice && <p className="mt-1 text-xs text-babyPink">{errors.packageChoice}</p>}
                  </label>

                  <label className="text-sm lg:col-span-2">
                    Mentor Preference (optional)
                    <select
                      value={formData.mentorPreference}
                      onChange={handleInputChange("mentorPreference")}
                      className="mt-2 w-full rounded-2xl border border-babyBlue/20 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
                    >
                      <option value="">Let Taylor match us</option>
                      {MENTOR_PREFERENCE_HINTS.map((pref) => (
                        <option key={pref} value={pref}>
                          {pref}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-slate-500">
                      Optional — drop hints if you already adore someone on the mentor collective.
                    </p>
                  </label>
                </div>
              </section>
            ) : (
              <section className="rounded-[2.5rem] border border-pastelPurple/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <h2 className="font-heading text-lg text-blueberry">Mentor Welcome Details</h2>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Help families find their guide</p>
                </div>
                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <label className="text-sm">
                    Specialty / Expertise
                    <input
                      type="text"
                      value={formData.specialty}
                      onChange={handleInputChange("specialty")}
                      className="mt-2 w-full rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
                      placeholder="Sleep whisperer, registry guru..."
                      required
                    />
                    {errors.specialty && <p className="mt-1 text-xs text-babyPink">{errors.specialty}</p>}
                  </label>

                  <label className="text-sm">
                    Availability
                    <select
                      value={formData.availability}
                      onChange={handleInputChange("availability")}
                      className="mt-2 w-full rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
                      required
                    >
                      {MENTOR_AVAILABILITY.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.availability && <p className="mt-1 text-xs text-babyPink">{errors.availability}</p>}
                  </label>

                  <label className="text-sm">
                    Max Clients
                    <input
                      type="number"
                      min="1"
                      value={formData.maxClients}
                      onChange={handleInputChange("maxClients")}
                      className="mt-2 w-full rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
                      placeholder="How many families feel cozy to support"
                      required
                    />
                    {errors.maxClients && <p className="mt-1 text-xs text-babyPink">{errors.maxClients}</p>}
                  </label>

                  <label className="text-sm lg:col-span-2">
                    Short Bio
                    <textarea
                      value={formData.bio}
                      onChange={handleInputChange("bio")}
                      rows={4}
                      className="mt-2 w-full rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
                      placeholder="Share your story and what lights you up when guiding families."
                      required
                    />
                    {errors.bio && <p className="mt-1 text-xs text-babyPink">{errors.bio}</p>}
                  </label>

                  <label className="text-sm lg:col-span-2">
                    Certifications (PDF or images)
                    <input
                      type="file"
                      multiple
                      accept=".pdf,image/*"
                      onChange={handleCertificationsChange}
                      className="mt-2 w-full rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry file:mr-4 file:rounded-full file:border-0 file:bg-babyPink/40 file:px-4 file:py-2 file:text-xs file:font-heading file:uppercase file:tracking-[0.3em] file:text-blueberry"
                    />
                    {formData.certificationFiles.length > 0 && (
                      <ul className="mt-4 space-y-3 text-sm text-blueberry">
                        {formData.certificationFiles.map((file) => (
                          <li
                            key={file.name}
                            className="flex items-center justify-between rounded-2xl border border-pastelPurple/40 bg-pastelPurple/10 px-4 py-3"
                          >
                            <span>{file.name}</span>
                            <a
                              href={file.dataUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-heading uppercase tracking-[0.3em] text-blueberry"
                            >
                              Preview
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </label>
                </div>
              </section>
            )}

            {submitError && (
              <p className="rounded-2xl border border-babyPink/40 bg-babyPink/20 px-4 py-3 text-sm text-blueberry">
                {submitError}
              </p>
            )}

            <footer className="flex flex-col gap-3 rounded-[2.5rem] border border-babyBlue/25 bg-white/95 px-6 py-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                Step 2 of 3 · Create profile
              </p>
              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex items-center justify-center rounded-full bg-babyPink px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition ${
                  submitting ? "opacity-60" : "hover:-translate-y-1 hover:shadow-dreamy"
                }`}
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-blueberry border-t-transparent" />
                    Saving…
                  </span>
                ) : (
                  "Save & Continue"
                )}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CreateProfile;
