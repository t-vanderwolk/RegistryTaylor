import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "5rem 2rem",
          background: "#f4f4f4",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          The Registry Taylor
        </h1>
       <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
  From registry to nursery — every detail, Taylor-maid for you.
</p>
        <p style={{ maxWidth: "700px", margin: "0 auto 2rem" }}>
          Preparing for a baby should feel exciting, not overwhelming. That’s
          where I come in. At <strong>The Registry Taylor</strong>, I help
          parents navigate every step of baby prep with ease — from personalized
          registry curation and gear shopping to nursery design, family
          coordination, and even baby shower planning.
        </p>
        <Link to="/contact">
          <button
            style={{
              padding: "1rem 2rem",
              fontSize: "1.2rem",
              background: "#ff6699",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Book Your Consultation
          </button>
        </Link>
      </section>

      {/* Services Preview */}
      <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <h2>Services at a Glance</h2>
        <p>
          I handle the details so you can focus on enjoying the journey. Here’s
          a peek at what I offer:
        </p>
        <ul style={{ listStyle: "none", padding: 0, marginTop: "2rem" }}>
          <li>✔️ Registry Curation</li>
          <li>✔️ Personal Shopping</li>
          <li>✔️ Nursery Design</li>
          <li>✔️ In-Law Interface</li>
          <li>✔️ Baby Shower Planning</li>
        </ul>
        <Link to="/services">
          <button
            style={{
              marginTop: "2rem",
              padding: "1rem 2rem",
              fontSize: "1.1rem",
              background: "#333",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            See All Services
          </button>
        </Link>
      </section>

      {/* How It Works */}
      <section style={{ padding: "4rem 2rem", background: "#f9f9f9" }}>
        <h2 style={{ textAlign: "center" }}>How It Works</h2>
        <ol style={{ maxWidth: "600px", margin: "2rem auto" }}>
          <li><strong>Book Your Consultation</strong> — Start with a quick call or virtual meeting.</li>
          <li><strong>Share Your Vision</strong> — Tell me your must-haves, worries, and wish list.</li>
          <li><strong>Get Your Plan</strong> — Receive a curated registry, personalized shopping list, or nursery design plan.</li>
          <li><strong>Enjoy the Journey</strong> — Focus on welcoming your baby with confidence.</li>
        </ol>
        <div style={{ textAlign: "center" }}>
          <Link to="/contact">
            <button
              style={{
                padding: "1rem 2rem",
                fontSize: "1.2rem",
                background: "#ff6699",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Let’s Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <h2>What Parents Are Saying</h2>
        <blockquote>
          “Taylor made our registry so simple — no stress, no second-guessing. I
          felt completely supported!” — Jenna M.
        </blockquote>
        <blockquote>
          “She helped us pick a stroller that actually works for our lifestyle.
          Best decision ever.” — Rachel &amp; Matt K.
        </blockquote>
        <blockquote>
          “Our nursery turned out better than I ever dreamed — stylish,
          functional, and ready for baby.” — Amanda S.
        </blockquote>
      </section>

      {/* Blog Section */}
      <section style={{ padding: "4rem 2rem", background: "#f4f4f4" }}>
        <h2 style={{ textAlign: "center" }}>Tips, Taylored</h2>
        <p style={{ textAlign: "center" }}>
          Quick guides and expert advice to make baby prep easier, from registry
          must-haves to stroller shopping tips.
        </p>
      </section>

      {/* FAQ */}
      <section style={{ padding: "4rem 2rem" }}>
        <h2 style={{ textAlign: "center" }}>FAQ</h2>
        <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
          <p><strong>Do you work virtually?</strong> Yes! I work with parents nationwide through virtual consultations.</p>
          <p><strong>Can you help me even if I’ve already started my registry?</strong> Absolutely — I can refine, reorganize, or fill in the gaps.</p>
          <p><strong>Do you only work with luxury products?</strong> Not at all. I help you find what fits your lifestyle and budget.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;