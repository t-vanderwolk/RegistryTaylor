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
    <div className="bg-softSky/40 text-cozyGray p-6 md:p-8 rounded-3xl shadow-soft border border-softLavender/40 text-center backdrop-blur">
      <h2 className="text-xl md:text-2xl font-serif font-semibold text-babyPink mb-3">
        Countdown to Baby!
      </h2>
      <p className="text-5xl md:text-6xl font-cursive text-babyBlue drop-shadow">
        {daysLeft > 0 ? `${daysLeft} days` : "It's Baby Day! 🎉"}
      </p>
    </div>
  );
}
