import { useState, useEffect } from "react";

export default function DueDateCountdown({ dueDate }) {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const updateCountdown = () => {
      const today = new Date();
      const target = new Date(dueDate);
      const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
      setDaysLeft(diff);
    };

    updateCountdown(); // run immediately
    const interval = setInterval(updateCountdown, 1000 * 60 * 60); // update hourly
    return () => clearInterval(interval);
  }, [dueDate]);

  return (
    <div className="bg-white text-deepSlate p-6 md:p-8 rounded-3xl shadow-soft border border-softGold/30 text-center">
      <h2 className="text-xl md:text-2xl font-serif font-semibold tracking-[0.2em] uppercase text-softGold mb-3">
        Countdown to Baby
      </h2>
      <p className="text-5xl md:text-6xl font-cursive text-deepSlate">
        {daysLeft > 0 ? `${daysLeft} days` : "It's Baby Day!"}
      </p>
    </div>
  );
}
