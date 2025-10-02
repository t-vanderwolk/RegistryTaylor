import React from "react";

const SectionDivider = ({ className = "" }) => {
  return (
    <div className={`my-12 flex justify-center ${className}`}>
      <div className="mx-auto h-[2px] w-20 rounded-full bg-primary/60" />
    </div>
  );
};

export default SectionDivider;
