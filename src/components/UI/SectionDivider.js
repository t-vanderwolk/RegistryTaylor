import React from "react";

const SectionDivider = ({ className = "" }) => {
  return (
    <div className={`flex justify-center my-10 ${className}`}>
      <svg
        width="360"
        height="28"
        viewBox="0 0 360 28"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="pastelLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F9C6D8" />
            <stop offset="50%" stopColor="#D9D6FF" />
            <stop offset="100%" stopColor="#BFDFF6" />
          </linearGradient>
        </defs>
        <g stroke="url(#pastelLine)" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M70 14 H290" />
        </g>
        <circle cx="40" cy="14" r="4" fill="#FEE5F1" opacity="0.85" />
        <circle cx="320" cy="14" r="4" fill="#DDEFFE" opacity="0.85" />
      </svg>
    </div>
  );
};

export default SectionDivider;
