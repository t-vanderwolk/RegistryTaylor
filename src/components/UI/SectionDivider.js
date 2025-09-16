import React from "react";

const SectionDivider = ({ className = "" }) => {
  return (
    <div className={`flex justify-center my-12 ${className}`}>
      <div className="h-[2px] w-48 bg-softGold/60" />
    </div>
  );
};

export default SectionDivider;
