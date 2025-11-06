import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={[
<<<<<<< HEAD
        "rounded-[2rem] border border-mauve/40 bg-white/90 p-6 shadow-[0_20px_50px_-30px_rgba(46,46,46,0.25)] backdrop-blur",
=======
        "rounded-[2rem] border border-primary/40 bg-white/90 p-6 shadow-[0_20px_50px_-30px_rgba(46,46,46,0.25)] backdrop-blur",
>>>>>>> heroku/main
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
};

export default Card;
