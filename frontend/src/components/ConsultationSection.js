import React, { useEffect, useRef } from "react";

const ConsultationSection = () => {
  const widgetWrapperRef = useRef(null);

  useEffect(() => {
    const wrapper = widgetWrapperRef.current;
    if (!wrapper) return undefined;

    const src = "https://babyconcierge.totsquad.com/embed.js";
    const existingLocalScript = wrapper.querySelector(
      `script[data-embedded-booking-script="true"]`,
    );

    if (existingLocalScript) {
      if (typeof window !== "undefined" && window.renderBookingWidgets) {
        window.renderBookingWidgets();
      }
      return undefined;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.embeddedBookingScript = "true";
    script.onload = () => {
      if (typeof window !== "undefined" && window.renderBookingWidgets) {
        window.renderBookingWidgets();
      }
    };

    wrapper.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-cream via-white to-pastelPurple/10">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-babyPink">
            Complimentary Service
          </p>
          <h2 className="font-playful text-4xl text-blueberry">
            Schedule Your Free Consultation ✨
          </h2>
          <p className="max-w-2xl mx-auto font-body text-sm text-darkText/70">
            Let’s chat about your registry, nursery, or concierge plan.  
            Pick a time that works for you — we’ll handle the rest.
          </p>
        </header>

        <div
          ref={widgetWrapperRef}
          className="rounded-[2.5rem] border border-babyBlue/30 bg-white/90 p-6 shadow-soft backdrop-blur"
        >
          <div
            className="embedded-booking w-full rounded-2xl"
            data-url="https://babyconcierge.totsquad.com"
            data-query="&t=s&uuid=84602e01-c352-4443-a7c8-a8d27e9e207c"
            data-employee="taylor-vanderwolk"
            data-lang="en"
            data-autoresize="0"
            data-showsidebar="1"
            data-showservices="0"
            style={{ minWidth: "320px", height: "768px" }}
          />
          <noscript>
            <p className="mt-4 rounded-2xl border border-babyPink/40 bg-babyPink/20 px-4 py-3 text-sm text-blueberry">
              Enable JavaScript to schedule your consultation.
            </p>
          </noscript>
        </div>
      </div>
    </section>
  );
};

export default ConsultationSection;
