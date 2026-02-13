import { content } from "@western-mass-septic/config";

export default function HeroSection() {
  const { hero } = content;

  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex items-center justify-center text-white"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${hero.backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)`,
          zIndex: -1,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
          {hero.headline}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
          {hero.subheadline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {hero.ctas.map((cta, idx) => (
            <a
              key={idx}
              href={cta.href}
              className={
                cta.variant === "primary"
                  ? "btn-primary text-lg px-8 py-4"
                  : "inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded border-2 border-white text-white hover:bg-white/20 transition-all duration-200"
              }
            >
              {cta.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
