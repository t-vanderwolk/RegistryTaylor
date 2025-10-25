import React, { useState } from "react";
import Section from "../components/ui/Section";

const faqs = [
  {
    q: "Do you work virtually?",
    a: "Yes! I work with parents nationwide through virtual consultations."
  },
  {
    q: "Can you help me even if I’ve already started my registry?",
    a: "Absolutely — I can refine, reorganize, or fill in the gaps."
  },
  {
    q: "Do you only work with luxury products?",
    a: "Not at all. I help you find what fits your lifestyle and budget."
  }
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="bg-transparent text-cozyGray">
      <Section title="Frequently Asked Questions" compact className="bg-alt-yellow">
        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-softGold/25 bg-white rounded-2xl px-5 py-4 cursor-pointer shadow-soft hover:bg-softGold/10 transition"
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            >
              <h3 className="font-serif text-lg text-cozyGray">{faq.q}</h3>
              <p
                className={`mt-2 text-cozyGray/75 transition-all duration-300 ${
                  openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default Faq;
