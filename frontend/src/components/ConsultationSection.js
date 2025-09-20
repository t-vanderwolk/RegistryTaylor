import React, { useEffect } from "react";

const ConsultationSection = () => {
  useEffect(() => {
    // Ensure the TotSquad embed script is loaded once
    const existingScript = document.querySelector(
      'script[src="https://babyconcierge.totsquad.com/embed.js"]'
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://babyconcierge.totsquad.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      id="consultation"
      className="embedded-booking"
      data-url="https://babyconcierge.totsquad.com"
      data-query="&t=s&uuid=84602e01-c352-4443-a7c8-a8d27e9e207c"
      data-employee="taylor-vanderwolk"
      data-lang="en"
      data-autoresize="0"
      data-showsidebar="1"
      data-showservices="0"
      style={{ minWidth: "320px", height: "768px" }}
    ></div>
  );
};

export default ConsultationSection;