import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ConsultationSection from "../../components/ConsultationSection";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";

const computeCountdown = (dueDate) => {
  if (!dueDate) return null;
  const target = new Date(dueDate);
  if (Number.isNaN(target.getTime())) return null;

  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, overdue: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, overdue: false };
};

const Dashboard = () => {
  const { user } = useAuth();
  const [profileState, setProfileState] = useState({ status: "loading", data: null, error: null });
  const [countdown, setCountdown] = useState(null);

  const clientProfile = profileState.data?.profile || {};

  const primaryName = useMemo(() => {
    const base = clientProfile.parent_one_name || user?.name || "friend";
    return base.split(" ")[0];
  }, [clientProfile.parent_one_name, user?.name]);

  const babyName = clientProfile.baby_name || "Little One";
  const dueDate = clientProfile.due_date;
  const familyIntro = clientProfile.family_intro;
  const packageChoice = clientProfile.package_choice || "Concierge";

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      setProfileState((current) => ({ ...current, status: "loading", error: null }));
      try {
        const response = await api.get("/api/v1/profile/me");
        if (!cancelled) {
          setProfileState({ status: "ready", data: response.data?.data || {}, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          const message = error.response?.data?.error?.message || "Unable to load your concierge profile.";
          setProfileState({ status: "error", data: null, error: message });
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!dueDate) {
      setCountdown(null);
      return undefined;
    }

    setCountdown(computeCountdown(dueDate));
    const interval = setInterval(() => {
      setCountdown(computeCountdown(dueDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [dueDate]);

  const countdownCopy = useMemo(() => {
    if (!countdown) return "Set your due date in Bio";
    if (countdown.overdue) {
      return "Baby countdown complete";
    }
    return [
      `${countdown.days}d`,
      `${String(countdown.hours).padStart(2, "0")}h`,
      `${String(countdown.minutes).padStart(2, "0")}m`,
      `${String(countdown.seconds).padStart(2, "0")}s`,
    ].join(" • ");
  }, [countdown]);

  const bioLink = "/client-portal/bio";

  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] border border-babyPink/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center rounded-full border border-babyPink/40 bg-babyPink/15 px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.3em] text-blueberry">
              {packageChoice} Experience
            </span>
            <h1 className="font-heading text-3xl text-blueberry">Welcome back, {primaryName}!</h1>
            <p className="max-w-2xl text-sm font-body leading-relaxed text-darkText/75">
              {familyIntro || (
                <>
                  Your concierge circle has everything aligned. Update your <Link to={bioLink} className="font-heading text-blueberry underline">Bio</Link> so we can keep adding personal touches.
                </>
              )}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-babyBlue/30 bg-babyBlue/10 px-6 py-5 text-center">
              <p className="text-xs font-heading uppercase tracking-[0.35em] text-darkText/50">Baby</p>
              <p className="mt-2 text-2xl font-heading text-blueberry">{babyName}</p>
            </div>
            <div className="rounded-3xl border border-babyPink/40 bg-babyPink/15 px-6 py-5 text-center">
              <p className="text-xs font-heading uppercase tracking-[0.35em] text-darkText/50">Countdown</p>
              <p className="mt-2 font-heading text-xl text-blueberry">{countdownCopy}</p>
            </div>
          </div>
        </div>
        {profileState.status === "error" && (
          <p className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-body text-rose-600">
            {profileState.error}
          </p>
        )}
      </section>

      <section className="rounded-[2.5rem] border border-babyBlue/30 bg-white/90 p-8 shadow-soft backdrop-blur-sm">
        <h2 className="font-heading text-2xl text-blueberry">Upcoming Support</h2>
        <p className="mt-3 text-sm font-body text-darkText/70">
          We are polishing every detail for you, {primaryName}. These are your next concierge touchpoints.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-babyBlue/30 bg-babyBlue/10 px-5 py-4">
            <p className="font-heading text-blueberry">Nursery Styling Session</p>
            <p className="mt-2 text-sm text-darkText/70">Tuesday, 2:00 PM · {clientProfile.mentor_preference || "Assigned Mentor"}</p>
          </div>
          <div className="rounded-3xl border border-babyPink/40 bg-babyPink/10 px-5 py-4">
            <p className="font-heading text-blueberry">Registry Refinement Call</p>
            <p className="mt-2 text-sm text-darkText/70">Thursday, 11:30 AM · Taylor Concierge</p>
          </div>
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-babyPink/40 bg-white/90 p-8 shadow-soft backdrop-blur-sm">
        <h2 className="font-heading text-2xl text-blueberry">Quick Actions</h2>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            to="/client-portal/services"
            className="rounded-full bg-babyPink px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition hover:-translate-y-1 hover:shadow-dreamy"
          >
            Book Consultation
          </Link>
          <Link
            to="/private-blog"
            className="rounded-full bg-babyBlue px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition hover:-translate-y-1 hover:shadow-dreamy"
          >
            Add Blog Topic
          </Link>
          <Link
            to="/client-portal/belly-pics"
            className="rounded-full bg-pastelPurple/80 px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-white shadow-pop transition hover:-translate-y-1 hover:shadow-dreamy"
          >
            Upload Belly Pic
          </Link>
          <Link
            to={bioLink}
            className="rounded-full border border-babyBlue/40 px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft transition hover:-translate-y-1 hover:shadow-dreamy"
          >
            Refresh Bio
          </Link>
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-babyBlue/30 bg-white/90 p-8 shadow-soft backdrop-blur-sm">
        <h2 className="font-heading text-2xl text-blueberry">Messages & Updates</h2>
        <div className="mt-4 space-y-3">
          <article className="rounded-3xl border border-babyBlue/30 bg-babyBlue/10 px-5 py-4">
            <p className="font-heading text-blueberry">{clientProfile.mentor_preference || "Assigned Mentor"}</p>
            <p className="mt-2 text-sm text-darkText/75">
              &ldquo;I added three travel-ready must-haves to your registry. Take a peek and let me know what you love!&rdquo;
            </p>
          </article>
          <article className="rounded-3xl border border-babyPink/30 bg-babyPink/10 px-5 py-4">
            <p className="font-heading text-blueberry">Taylor · Concierge</p>
            <p className="mt-2 text-sm text-darkText/75">
              &ldquo;White-glove delivery is confirmed for Friday morning. Coffee and pastries will be waiting when you arrive.&rdquo;
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-babyPink/40 bg-white/95 p-0 shadow-soft backdrop-blur-sm">
        <div className="space-y-4 border-b border-babyPink/30 px-8 py-6">
          <span className="inline-flex items-center rounded-full border border-babyPink/40 bg-babyPink/15 px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.3em] text-blueberry">
            Concierge Video Support
          </span>
          <h2 className="font-heading text-2xl text-blueberry">Need to talk? Schedule a video call.</h2>
          <p className="max-w-xl text-sm font-body leading-relaxed text-darkText/70">
            Book time directly with your concierge team for milestone planning, registry refreshes, or a quick check-in.
          </p>
        </div>
        <div className="px-2 pb-8 pt-4 sm:px-4">
          <ConsultationSection />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
