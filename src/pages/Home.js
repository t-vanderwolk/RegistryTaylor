import React from "react";
import { Link } from "react-router-dom";
import Section from "../components/UI/Section";

const Home = () => {
  return (
    <div>

      {/* =======================
          HERO SECTION (Centered)
      ======================= */}
      <Section center>
        <h1 className="font-serif text-5xl md:text-6xl mb-4">
          ✨ The Registry Taylor ✨
        </h1>
        <p className="text-lg md:text-xl text-neutral-600">
          From registry to nursery — every detail Taylor-Made for you.
        </p>
        <Link to="/contact">
          <button className="mt-6 px-6 py-3 rounded-full bg-black text-white hover:bg-neutral-800 transition">
            Book Your Consultation
          </button>
        </Link>
      </Section>

      {/* =======================
          INTRO / VALUE (Left)
      ======================= */}
      <Section>
        <p className="cc-lead max-w-2xl">
          Preparing for a baby should feel exciting, not overwhelming. At{" "}
          <span className="font-serif">The Registry Taylor</span>, I guide you
          through every step of baby prep — from registries and strollers to
          nursery design, showers, and family dynamics.
        </p>
        <p className="mt-6 max-w-2xl">
          With my <em>Taylor-Made</em> approach, you’ll feel supported,
          confident, and ready to welcome your little one with ease.
        </p>
      </Section>

      {/* =======================
          SERVICES SNAPSHOT (Left)
      ======================= */}
      <Section title="Services Snapshot — Taylor-Made for You">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-serif text-xl mb-2">Taylor-Made Registry</h3>
            <p>Custom registries designed around your lifestyle and values.</p>
          </div>
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-serif text-xl mb-2">Taylor-Made Gear</h3>
            <p>Honest advice on strollers, car seats, and baby gear.</p>
          </div>
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-serif text-xl mb-2">Taylor-Made Nursery</h3>
            <p>
              From layout to décor — spaces that are safe, stylish, and
              functional.
            </p>
          </div>
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-serif text-xl mb-2">Taylor-Made Showers</h3>
            <p>Planning made simple, from themes to thank-yous.</p>
          </div>
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-serif text-xl mb-2">Taylor-Made Support</h3>
            <p>
              Yes, even in-law diplomacy — I’ll help keep everyone on the same
              page.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <Link to="/services" className="btn btn-outline">
            Explore All Services →
          </Link>
        </div>
      </Section>

      {/* =======================
          HOW IT WORKS (Left)
      ======================= */}
      <Section title="How It Works">
        <ol className="mt-6 space-y-6 max-w-2xl text-left">
          <li>
            <strong>Book Your Consultation</strong> — Start with a quick call or
            virtual meeting.
          </li>
          <li>
            <strong>Share Your Vision</strong> — Tell me your must-haves,
            worries, and style.
          </li>
          <li>
            <strong>Get Your Plan</strong> — Receive a personalized registry,
            gear guide, or nursery design plan.
          </li>
          <li>
            <strong>Enjoy the Journey</strong> — With the details handled, you
            can focus on the moments that matter.
          </li>
        </ol>
      </Section>

      {/* =======================
          TESTIMONIALS (Left)
      ======================= */}
      <Section title="Testimonials">
        <div className="space-y-6 max-w-2xl">
          <blockquote className="italic">
            “Taylor made our registry feel effortless — no stress, no
            second-guessing.” — Jenna M.
          </blockquote>
          <blockquote className="italic">
            “She helped us choose a stroller that truly works for our
            lifestyle. Game-changer!” — Rachel &amp; Matt K.
          </blockquote>
          <blockquote className="italic">
            “Our nursery turned out better than I ever imagined — polished,
            functional, and ready for baby.” — Amanda S.
          </blockquote>
        </div>
      </Section>

      {/* =======================
          MID-PAGE CTA (Centered)
      ======================= */}
      <Section center className="bg-neutral-50">
        <h2 className="font-serif text-2xl">✨ Ready to start planning? ✨</h2>
        <p className="mt-4">
          Book your consultation today — baby prep made simple, personal, and
          stress-free.
        </p>
        <Link to="/contact">
          <button className="mt-6 btn btn-primary">Let’s Get Started →</button>
        </Link>
      </Section>

      {/* =======================
          ABOUT PREVIEW (Left)
      ======================= */}
      <Section title="About Me">
        <p className="max-w-2xl">
          Hi, I’m Taylor! Think of me as your go-to guide (and maybe your new
          best friend) for all things baby prep. I’ve spent years helping
          families navigate the overwhelming world of strollers, car seats,
          nurseries, and registries.
        </p>
        <p className="mt-6 max-w-2xl">
          Now, I bring that experience to you in a warm, personalized way that
          takes away the stress and leaves you excited, prepared, and confident.
        </p>
        <div className="mt-6">
          <Link to="/about" className="btn btn-outline">
            Learn More About Me →
          </Link>
        </div>
      </Section>

      {/* =======================
          FOOTER CONTACT (Centered)
      ======================= */}
      <Section center className="bg-neutral-100">
        <h2 className="font-serif text-2xl">
          Let’s make baby prep easy — and even fun.
        </h2>
        <p className="mt-4">📧 Email: RegistryTaylor@gmail.com</p>
        <Link to="/contact">
          <button className="mt-6 btn btn-primary">
            Book Your Consultation
          </button>
        </Link>
      </Section>
    </div>
  );
};

export default Home;