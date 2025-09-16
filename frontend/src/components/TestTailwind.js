import React from "react";

const TestTailwind = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cloudWhite/80 text-cozyGray">
      <h1 className="text-4xl font-serif text-cozyGray mb-4">
        Tailwind Test ✨
      </h1>
      <p className="text-cozyGray/75 mb-6">
        If you see styles (big heading, gray background, styled button), Tailwind is working.
      </p>
      <button className="btn-primary px-6 py-2">Tailwind Button</button>
    </div>
  );
};

export default TestTailwind;
