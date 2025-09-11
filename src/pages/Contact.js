import React from "react";
import Section from "../components/UI/Section";

const Contact = () => {
  return (
    <div>
      <Section title="Contact / Booking">
        <p className="max-w-xl mx-auto">
          Ready to get started? Let’s make baby prep simple, stress-free, and
          Taylor-Made just for you.
        </p>
        <p className="mt-4">📧 Email: RegistryTaylor@gmail.com</p>
        <button className="mt-6 btn btn-primary">Book Your Consultation</button>
      </Section>
    </div>
  );
};

export default Contact;