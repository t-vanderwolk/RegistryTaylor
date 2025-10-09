import React from "react";

const SectionDivider = ({ className = "" }) => {
  return (
    <div className={["my-12 flex justify-center", className].filter(Boolean).join(" ")}
>
      <div className="mx-auto h-[2px] w-20 rounded-full bg-gold" />
    </div>
  );
};

export default SectionDivider;
