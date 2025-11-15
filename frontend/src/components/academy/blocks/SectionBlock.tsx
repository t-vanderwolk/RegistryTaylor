type SectionBlockProps = {
  heading?: string;
  subheading?: string;
  paragraphs: string[];
};

export default function SectionBlock({ heading, subheading, paragraphs }: SectionBlockProps) {
  return (
    <section className="space-y-3 md:space-y-4">
      {heading ? (
        <header className="space-y-2">
          <h3 className="font-serif text-2xl text-[#3E2F35] md:text-[2rem]">{heading}</h3>
          <span className="block h-[2px] w-12 bg-[#C8A6B6]" aria-hidden />
          {subheading ? <p className="text-sm text-[#3E2F35]/70 md:text-base">{subheading}</p> : null}
        </header>
      ) : null}
      <div className="space-y-4 text-base leading-[1.7] text-[#3E2F35]/85 md:space-y-6 md:text-lg md:leading-[1.9]">
        {paragraphs.map((paragraph, idx) => (
          <p key={idx} className="indent-6">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
