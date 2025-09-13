import React from "react";

const TestTailwind = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-accent">
      <h1 className="text-4xl font-serif text-black mb-4">
        Tailwind Test ✨
      </h1>
      <p className="text-black/70 mb-6">
        If you see styles (big heading, gray background, styled button), Tailwind is working.
      </p>
      <button className="btn btn-primary">Tailwind Button</button>
    </div>
  );
};

export default TestTailwind;
