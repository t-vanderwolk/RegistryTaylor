import React from "react";

const TestTailwind = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-ivory/80 text-charcoal">
      <h1 className="text-4xl font-serif text-charcoal mb-4">
        Tailwind Test ✨
      </h1>
      <p className="text-charcoal/75 mb-6">
        If you see styles (big heading, gray background, styled button), Tailwind is working.
      </p>
      <button className="btn-mauve px-6 py-2">Tailwind Button</button>
    </div>
  );
};

export default TestTailwind;
