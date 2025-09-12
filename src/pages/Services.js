import React from "react";
import Section from "../components/UI/Section";

const Services = () => {
  const services = [
    {
      title: "Registry Curation",
      desc: "A customized registry that fits your lifestyle, values, and priorities — no cookie-cutter lists here."
    },
    {
      title: "Personal Shopping",
      desc: "Honest, expert guidance on strollers, car seats, and nursery furniture — with recommendations that actually make sense for your family."
    },
    {
      title: "Nursery Design",
      desc: "From floor plans to finishing touches, I help you create a space that’s safe, stylish, and functional."
    },
    {
      title: "In-Law Interface",
      desc: "Let me handle the delicate art of coordinating family gifts and smoothing expectations, so everyone feels included without the stress."
    },
    {
      title: "Baby Shower Planning",
      desc: "From themes to thank-yous, I’ll help you plan a celebration that feels joyful and effortless."
    }
  ];

  return (
    <div>
      <Section title="Services">
        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service, index) => (
            <div key={index} className="cc-card text-left">
              <h3 className="font-serif mb-2 text-black">{service.title}</h3>
              <p className="text-black/80">{service.desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default Services;
