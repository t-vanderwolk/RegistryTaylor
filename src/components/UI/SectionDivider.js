import React from "react";

// Minimal gold centered solid line divider
const SectionDivider = ({ className = "" }) => {
  const gold = "#D4AF37"; // warm gold
  return (
    <div className={`flex justify-center my-10 ${className}`}>
      <svg
        width="380"
        height="24"
        viewBox="0 0 380 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g stroke={gold} strokeWidth="3.5" strokeLinecap="round" fill="none">
          {/* single centered line */}
          <path d="M90 12 H290" />
        </g>
      </svg>
    </div>
  );
};

export default SectionDivider;
