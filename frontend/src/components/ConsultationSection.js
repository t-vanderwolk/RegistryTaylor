import React, { useEffect, useRef, useState } from "react";

const ConsultationSection = () => {
  const widgetRef = useRef(null);
  const scriptId = "totsquad-booking-script";
  const [containerHeight, setContainerHeight] = useState(768);

  useEffect(() => {
    const getResponsiveHeight = () => {
      if (typeof window === "undefined") {
        return 768;
      }

      const width = window.innerWidth;

      if (width <= 360) return 880;
      if (width <= 480) return 820;
      if (width <= 640) return 780;
      return 768;
    };

    const updateHeight = () => setContainerHeight(getResponsiveHeight());

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    const scriptUrl = "https://babyconcierge.totsquad.com/embed.js";
    const existingScript = document.getElementById(scriptId);

    // Remove prior instance so navigating away and back reloads the widget
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    const container = widgetRef.current;
    script.id = scriptId;
    script.src = scriptUrl;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = "";
      }
      script.remove();
    };
  }, []);

  return (
    <div
      id="consultation"
      className="embedded-booking"
      data-url="https://babyconcierge.totsquad.com"
      data-query="&t=s&uuid=84602e01-c352-4443-a7c8-a8d27e9e207c"
      data-employee="taylor-vanderwolk"
      data-lang="en"
      data-autoresize="1"
      data-showsidebar="1"
      data-showservices="0"
      style={{
        minWidth: "0px",
        width: "100%",
        minHeight: `${containerHeight}px`,
      }}
      ref={widgetRef}
    ></div>
  );
};

export default ConsultationSection;
