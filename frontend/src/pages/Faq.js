import React, { useState } from "react";
<<<<<<< HEAD
import Section from "../components/ui/Section";

const faqs = [
  {
    q: "How do invitations work?",
    a: "Membership is offered to a limited number of families each season. Share your story through the request form and we’ll curate a welcome call to confirm timing, support needs, and mentor pairing.",
  },
  {
    q: "What happens inside the Academy?",
    a: "The Taylor-Made Baby Academy blends education, reflection, and planning prompts. Members learn the framework, practice it with their mentor, and collect insights that prepare them for mentorship.",
  },
  {
    q: "When can I become a mentor?",
    a: "Members who complete the Academy and feel called to guide others can enter the Mentor in Training track. We provide certification, shadowing, and gentle coaching before you support new families.",
  },
  {
    q: "Do you only support in-person events?",
    a: "We serve families locally in Scottsdale and Phoenix, and virtually everywhere else. Whether it’s registry planning, nursery styling, or celebration production, your mentor guides each step remotely or on-site.",
  },
=======
import Section from "../components/UI/Section";

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
>>>>>>> heroku/main
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
<<<<<<< HEAD
    <div className="bg-transparent text-charcoal">
      <Section title="Frequently Asked Questions" compact className="bg-alt-yellow">
        <p className="mx-auto mb-6 max-w-2xl text-center text-sm text-charcoal/75">
          Learn more about the Taylor-Made journey—from invitations to mentorship. Each answer reflects how we help you Learn · Plan · Connect.
        </p>
=======
    <div className="bg-transparent text-cozyGray">
      <Section title="Frequently Asked Questions" compact className="bg-alt-yellow">
>>>>>>> heroku/main
        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
<<<<<<< HEAD
              className="border border-gold/25 bg-white rounded-2xl px-5 py-4 cursor-pointer shadow-soft hover:bg-gold/10 transition"
=======
              className="border border-softGold/25 bg-white rounded-2xl px-5 py-4 cursor-pointer shadow-soft hover:bg-softGold/10 transition"
>>>>>>> heroku/main
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            >
<<<<<<< HEAD
              <h3 className="font-serif text-lg text-charcoal">{faq.q}</h3>
              <p
                className={`mt-2 text-charcoal/75 transition-all duration-300 ${
=======
              <h3 className="font-serif text-lg text-cozyGray">{faq.q}</h3>
              <p
                className={`mt-2 text-cozyGray/75 transition-all duration-300 ${
>>>>>>> heroku/main
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
