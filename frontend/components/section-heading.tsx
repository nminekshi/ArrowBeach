type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: 'left' | 'center';
};

export function SectionHeading({ eyebrow, title, description, align = 'left' }: SectionHeadingProps) {
  const alignment = align === 'center' ? 'mx-auto text-center' : 'text-left';

  return (
    <div className={`w-full ${alignment}`}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-ocean-700/70">{eyebrow}</p>
      <h2 className="font-display text-4xl leading-tight text-night sm:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-night/70 sm:text-lg">{description}</p>
    </div>
  );
}
