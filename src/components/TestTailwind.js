import React from "react";

const TestTailwind = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-serif text-black mb-4">
        Tailwind Test ✨
      </h1>
      <p className="text-gray-600 mb-6">
        If you see styles (big heading, gray background, styled button), Tailwind is working.
      </p>
      <button className="px-6 py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition">
        Tailwind Button
      </button>
    </div>
  );
};

export default TestTailwind;