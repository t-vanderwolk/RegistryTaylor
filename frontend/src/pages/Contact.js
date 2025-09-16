import React from "react";
import Section from "../components/UI/Section";

const Contact = () => {
  return (
    <div className="min-h-screen bg-transparent text-cozyGray">
      <Section title="Contact / Booking" center tightTop compact className="bg-alt-blue">
        <p className="max-w-xl mx-auto text-cozyGray/80 leading-relaxed">
          Ready to get started? Let’s make baby prep simple, stress-free, and
          Taylor-Made just for you.
        </p>
        <p className="mt-4 text-cozyGray font-medium">Email: RegistrywithTaylor@gmail.com</p>
        <button className="mt-6 btn-primary text-sm sm:text-base px-7 sm:px-8 py-3">Book Your Consultation</button>
      </Section>
    </div>
  );
};

export default Contact;
