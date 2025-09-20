import React, { useEffect } from "react";

const ConsultationSection = () => {
  useEffect(() => {
    // Ensure script runs after component mounts
    const script = document.createElement("script");
    script.src = "https://babyconcierge.totsquad.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="w-full px-4 py-8 bg-white/90 rounded-2xl shadow-soft">
      <h2 className="text-center font-playful text-2xl text-blueberry mb-6">
        Book Your Free Consultation
      </h2>
      <div
        className="embedded-booking"
        data-url="https://babyconcierge.totsquad.com"
        data-query="&t=s&uuid=84602e01-c352-4443-a7c8-a8d27e9e207c"
        data-employee="taylor-vanderwolk"
        data-lang="en"
        data-autoresize="1"
        data-showsidebar="1"
        data-showservices="0"
        style={{ minWidth: "320px", height: "768px" }}
      />
    </section>
  );
};

export default ConsultationSection;