import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Dummy data (replace with real testimonials)
const testimonials = [
  {
    name: "Emily R.",
    role: "First-Time Mom",
    quote: `TaylorMade Baby Co. made everything so much easier. 
I didn’t have to stress about what to buy or when to do things — it was all organized for me. 
It felt like having a wedding planner for pregnancy.`,
  },
  {
    name: "Sarah L.",
    role: "Second Pregnancy",
    quote: `The concierge support was incredible. 
Whenever I felt overwhelmed, I could just send a quick message and get clarity. 
It gave me peace of mind every step of the way.`,
  },
  {
    name: "Amanda D.",
    role: "Working Mom-to-Be",
    quote: `The membership saved me so much time. 
The checklists and reminders kept me on track. 
It felt like a supportive friend who always knew what was next.`,
  },
];

const TestimonialsCarousel = () => {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <section className="relative mx-auto max-w-4xl px-6 py-12 text-center">
      <h2 className="mb-8 text-2xl font-serif text-[#5E5873] sm:text-3xl">
        What Moms Are Saying
      </h2>

      <div className="relative overflow-hidden rounded-2xl bg-white/80 p-8 shadow-md ring-1 ring-pink-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <blockquote className="space-y-3 text-sm leading-relaxed text-[#5E5873] sm:text-base">
              {testimonials[index].quote
                .split(/\n+/g) // <-- FIX: split on newlines safely
                .map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
            </blockquote>

            <footer className="mt-6 text-sm font-semibold text-pink-600">
              — {testimonials[index].name},{" "}
              <span className="font-normal text-[#8A8595]">
                {testimonials[index].role}
              </span>
            </footer>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={handlePrev}
          className="rounded-full bg-pink-100 px-4 py-2 text-sm font-medium text-pink-700 shadow hover:bg-pink-200"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          className="rounded-full bg-pink-100 px-4 py-2 text-sm font-medium text-pink-700 shadow hover:bg-pink-200"
        >
          Next →
        </button>
      </div>

      {/* Dots */}
      <div className="mt-4 flex justify-center gap-2">
        {testimonials.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${
              i === index ? "bg-pink-500" : "bg-pink-200"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsCarousel;