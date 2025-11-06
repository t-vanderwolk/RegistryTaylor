import React from "react";
import { H2, P } from "./Typography";

type SectionProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

const Section: React.FC<SectionProps> = ({ title, description, children, className, id }) => {
  return (
    <section
      id={id}
      className={[
<<<<<<< HEAD
        "section-padding bg-ivory even:bg-white/80",
        "mx-auto w-full max-w-6xl",
=======
        "mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-10",
>>>>>>> heroku/main
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col gap-6">
        {(title || description) && (
          <div className="max-w-3xl">
<<<<<<< HEAD
            {title && <H2 className="mb-4 text-charcoal">{title}</H2>}
            {description && <P className="text-charcoal/75">{description}</P>}
=======
            {title && <H2 className="mb-4 text-ink">{title}</H2>}
            {description && <P className="text-ink/75">{description}</P>}
>>>>>>> heroku/main
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;
