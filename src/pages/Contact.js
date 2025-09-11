import React from "react";

const Contact = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Contact / Booking</h1>
      <p>
        Ready to get started? Let’s make baby prep simple, stress-free, and
        Taylored just for you.
      </p>
      <p>
        Email:{" "}
        <a href="mailto:TheRegistryTaylor@gmail.com">
          TheRegistryTaylor@gmail.com
        </a>
      </p>
      <button style={{ padding: "1rem 2rem", fontSize: "1.2rem" }}>
        Book Your Consultation
      </button>
    </div>
  );
};

export default Contact;