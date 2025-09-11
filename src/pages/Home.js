import React from "react";
import { Link } from "react-router-dom";
import Section from "../components/UI/Section";

const Home = () => {
  const sections = [
    {
      center: true,
      content: (
        <>
          <h1 className="font-serif text-5xl md:text-6xl mb-4 animate-fadeIn">
            ✨ The Registry Taylor ✨
          </h1>
          <p className="text-lg md:text-xl text-neutral-600">
            From registry to nursery — every detail Taylor-Made for you.
          </p>
          <Link to="/contact">
            <button className="mt-6 btn dark">Book Your Consultation</button>
          </Link>
        </>
      ),
    },
    {
      title: "Introduction",
      content: (
        <>
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
        </>
      ),
    },
    {
      title: "Services Snapshot — Taylor-Made for You",
      content: (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Taylor-Made Registry",
                desc: "Custom registries designed around your lifestyle and values.",
              },
              {
                title: "Taylor-Made Gear",
                desc: "Honest advice on strollers, car seats, and baby gear.",
              },
              {
                title: "Taylor-Made Nursery",
                desc: "From layout to décor — spaces that are safe, stylish, and functional.",
              },
              {
                title: "Taylor-Made Showers",
                desc: "Planning made simple, from themes to thank-yous.",
              },
              {
                title: "Taylor-Made Support",
                desc: "Yes, even in-law diplomacy — I’ll help keep everyone on the same page.",
              },
            ].map((service, i) => (
              <div
                key={i}
                className="p-6 border border-gray-300 rounded-xl shadow hover:shadow-lg bg-white transition"
              >
                <h3 className="font-serif text-xl mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/services" className="btn">
              Explore All Services →
            </Link>
          </div>
        </>
      ),
    },
    {
      title: "How It Works",
      content: (
        <ol className="mt-6 space-y-6 max-w-2xl text-left list-decimal list-inside">
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
      ),
    },
    {
      title: "Testimonials",
      center: true,
      content: (
        <div className="space-y-6 max-w-2xl mx-auto">
          <blockquote className="italic text-gray-700 border-l-4 border-black pl-4">
            “Taylor made our registry feel effortless — no stress, no
            second-guessing.” — Jenna M.
          </blockquote>
          <blockquote className="italic text-gray-700 border-l-4 border-black pl-4">
            “She helped us choose a stroller that truly works for our lifestyle.
            Game-changer!” — Rachel &amp; Matt K.
          </blockquote>
          <blockquote className="italic text-gray-700 border-l-4 border-black pl-4">
            “Our nursery turned out better than I ever imagined — polished,
            functional, and ready for baby.” — Amanda S.
          </blockquote>
        </div>
      ),
    },
    {
      center: true,
      content: (
        <>
          <h2 className="font-serif text-2xl">✨ Ready to start planning? ✨</h2>
          <p className="mt-4 text-gray-600">
            Book your consultation today — baby prep made simple, personal, and
            stress-free.
          </p>
          <Link to="/contact">
            <button className="mt-6 btn dark">Let’s Get Started →</button>
          </Link>
        </>
      ),
    },
    {
      title: "About Me",
      content: (
        <>
          <p className="max-w-2xl">
            Hi, I’m Taylor! Think of me as your go-to guide (and maybe your new
            best friend) for all things baby prep. I’ve spent years helping
            families navigate the overwhelming world of strollers, car seats,
            nurseries, and registries.
          </p>
          <p className="mt-6 max-w-2xl">
            Now, I bring that experience to you in a warm, personalized way
            that takes away the stress and leaves you excited, prepared, and
            confident.
          </p>
          <div className="mt-6">
            <Link to="/about" className="btn">
              Learn More About Me →
            </Link>
          </div>
        </>
      ),
    },
    {
      center: true,
      content: (
        <>
          <h2 className="font-serif text-2xl">
            Let’s make baby prep easy — and even fun.
          </h2>
          <p className="mt-4">📧 Email: RegistryTaylor@gmail.com</p>
          <Link to="/contact">
            <button className="mt-6 btn">Book Your Consultation</button>
          </Link>
        </>
      ),
    },
  ];

  return (
    <div>
      {sections.map((section, i) => (
        <Section
          key={i}
          index={i}
          center={section.center}
          title={section.title}
        >
          {section.content}
        </Section>
      ))}
    </div>
  );
};

export default Home;
