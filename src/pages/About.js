import React from "react";
import Section from "../components/UI/Section";

const About = () => {
  return (
    <div>
      <Section title="About Me">
        <p className="max-w-2xl mx-auto">
          Hi, I’m Taylor! I know how overwhelming the world of baby gear,
          registries, and family input can feel. With years of hands-on
          experience helping hundreds of parents choose strollers, car seats,
          nursery furniture, and everything in between, I’ve learned that baby
          prep is about more than products — it’s about peace of mind.
        </p>
        <p className="mt-6 max-w-2xl mx-auto">
          Think of me as your go-to guide (and maybe your new best friend) for
          all things baby. I combine expert knowledge with a warm, supportive
          approach, making the process stress-free, personalized, and even fun.
        </p>
      </Section>
    </div>
  );
};

export default About;