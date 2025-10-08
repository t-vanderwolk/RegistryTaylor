import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

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
  const { persist, setAuthState } = useAuth();
  const searchParams = new URLSearchParams(location.search);

  const initialInviteCode = (
    location.state?.inviteCode ||
    searchParams.get("invite") ||
    searchParams.get("code") ||
    ""
  )
    .trim()
    .toUpperCase();

  const [inviteCode] = useState(initialInviteCode);
  const [inviteInfo, setInviteInfo] = useState(location.state?.inviteInfo || null);
  const [inviteStatus, setInviteStatus] = useState(
    inviteInfo ? "ready" : initialInviteCode ? "loading" : "error"
  );
  const [inviteError, setInviteError] = useState(
    inviteInfo || initialInviteCode
      ? ""
      : "Invite code missing. Request a new invite to continue."
  );

  const initialRoleCandidate =
    location.state?.role || inviteInfo?.role || searchParams.get("role");
  const initialRole = initialRoleCandidate === "mentor" ? "mentor" : "client";
  const [role, setRole] = useState(initialRole);

  const initialInvitedEmail =
    location.state?.invitedEmail ||
    location.state?.email ||
    searchParams.get("email") ||
    "";
  const [forcedEmail, setForcedEmail] = useState(initialInvitedEmail);
  const invitedEmail = forcedEmail;

  const [formData, setFormData] = useState(() => ({
    ...initialFormState(initialRole),
    email: initialInvitedEmail,
  }));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const storageKey = useMemo(
    () => `tm_create_profile_${role}_${inviteCode || 'unknown'}`,
    [inviteCode, role],
  );

  useEffect(() => {
    setDraftLoaded(false);
    setFormData({ ...initialFormState(role), email: forcedEmail });
    setErrors({});
    setSubmitError("");
  }, [role, forcedEmail, inviteCode]);

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
            email: forcedEmail || parsed.email || current.email,
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
  }, [forcedEmail, storageKey]);

  useEffect(() => {
    if (!draftLoaded) return;
    localStorage.setItem(storageKey, JSON.stringify(formData));
  }, [draftLoaded, formData, storageKey]);

  useEffect(() => {
    if (!inviteCode) {
      setInviteStatus('error');
      setInviteError('Invite code missing. Request a new invite to continue.');
      return;
    }

    if (inviteInfo || inviteStatus === 'error') {
      return;
    }

    let cancelled = false;
    const fetchInvite = async () => {
      setInviteStatus('loading');
      try {
        const response = await api.get(`/api/v1/auth/invites/${encodeURIComponent(inviteCode)}`);
        if (cancelled) return;
        const invite = response.data?.data;
        setInviteInfo(invite);
        setInviteStatus('ready');
        setInviteError('');
      } catch (error) {
        if (!cancelled) {
          setInviteStatus('error');
          setInviteError(
            error.response?.data?.error?.message ||
              'We could not find that invite or it has already been used.'
          );
        }
      }
    };

    fetchInvite();

    return () => {
      cancelled = true;
    };
  }, [inviteCode, inviteInfo, inviteStatus]);

  useEffect(() => {
    if (!inviteInfo) return;

    const resolvedRole = inviteInfo.role === 'mentor' ? 'mentor' : 'client';
    if (resolvedRole !== role) {
      setRole(resolvedRole);
    }

    if (inviteInfo.assigned_email && inviteInfo.assigned_email !== forcedEmail) {
      setForcedEmail(inviteInfo.assigned_email);
    }

    setFormData((current) => {
      const next = { ...current };

      if (inviteInfo.assigned_name && !next.parentOneName) {
        next.parentOneName = inviteInfo.assigned_name;
      }

      if (inviteInfo.assigned_email) {
        next.email = inviteInfo.assigned_email;
      }

      const metadata = inviteInfo.metadata || {};

      if (resolvedRole === 'client') {
        if (metadata.due_date && !next.dueDate) {
          next.dueDate = metadata.due_date;
        }
        if (metadata.package_choice && !next.packageChoice) {
          next.packageChoice = metadata.package_choice;
        }
        if (metadata.mentor_preference && !next.mentorPreference) {
          next.mentorPreference = metadata.mentor_preference;
        }
      } else {
        if (metadata.specialty && !next.specialty) {
          next.specialty = metadata.specialty;
        }
      }

      return next;
    });
  }, [inviteInfo, role, forcedEmail]);

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

    if (inviteStatus !== "ready") {
      setSubmitError("We’re still verifying your invite. Please try again in a moment.");
      return;
    }

    const validationErrors = validationRules(role, formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const trimmedName = formData.parentOneName?.trim() || formData.parentOneName;
      const trimmedEmail = formData.email?.trim() || formData.email;
      const trimmedPhone = formData.phone?.trim() || formData.phone || null;
      const trimmedZip = formData.zipCode?.trim() || formData.zipCode || null;

      const baseProfile =
        role === "client"
          ? {
              parent_one_name: trimmedName,
              parent_two_name: formData.parentTwoName || null,
              baby_name: formData.babyName || null,
              baby_gender: formData.babyGender || null,
              due_date: formData.dueDate || null,
              package_choice: formData.packageChoice || null,
              mentor_preference: formData.mentorPreference || null,
            }
          : {
              specialty: formData.specialty,
              bio: formData.bio,
              availability: formData.availability,
              max_clients: Number(formData.maxClients) || 0,
              certifications: formData.certificationFiles.map((file) => file.name),
            };

      const payload = {
        code: inviteCode,
        name: trimmedName,
        email: trimmedEmail,
        password: formData.password,
        phone: trimmedPhone,
        zip_code: trimmedZip,
        profile: baseProfile,
      };

      const response = await api.post("/api/v1/auth/register-with-invite", payload);
      const result = response.data?.data;

      if (!result?.token || !result?.user) {
        throw new Error("We couldn’t save your profile just yet.");
      }

      persist(result.token, result.user);
      setAuthState({ token: result.token, user: result.user, role: result.user.role || role });

      localStorage.removeItem(storageKey);

      const destinationsByRole = {
        client: "/dashboard",
        mentor: "/mentor",
        admin: "/admin",
      };

      const destination = destinationsByRole[result.user.role] || "/portal";
      navigate(destination, { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.error?.message ||
        error.message ||
        "We couldn’t save your profile just yet.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (inviteStatus === 'loading') {
    return (
      <main className="min-h-screen bg-cream text-darkText flex items-center justify-center">
        <p className="text-sm font-heading uppercase tracking-[0.3em] text-slate-500">
          Verifying your invite…
        </p>
      </main>
    );
  }

  if (inviteStatus === 'error') {
    return (
      <main className="min-h-screen bg-cream text-darkText flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-[2.5rem] border border-babyPink/40 bg-white/95 p-8 text-center shadow-soft">
          <h1 className="font-playful text-3xl text-blueberry">We need a fresh invite</h1>
          <p className="mt-3 text-sm text-slate-600">{inviteError}</p>
          <button
            type="button"
            onClick={() => navigate('/request-invite')}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-babyPink px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition hover:-translate-y-1 hover:shadow-dreamy"
          >
            Request Invite
          </button>
        </div>
      </main>
    );
  }

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
                    placeholder="RegistryWithTaylor@gmail.com"
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
