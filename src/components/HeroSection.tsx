import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/hero-kenya.jpg";
import { heroContent } from "@/content/siteContent";

export const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = heroRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Running on the red dust roads of Kenya"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-wide mx-auto px-6 md:px-12 lg:px-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Subtitle */}
          <p className="reveal text-primary font-medium uppercase tracking-[0.3em] text-sm md:text-base mb-6 opacity-0">
            {heroContent.subtitle}
          </p>

          {/* Main Headline */}
          <h1 className="reveal delay-100 font-display text-5xl md:text-7xl lg:text-8xl text-background leading-[0.9] mb-8 opacity-0">
            {heroContent.headline.line1}
            <br />
            <span className="text-primary">{heroContent.headline.highlight}</span>
          </h1>

          {/* Subheadline */}
          <p className="reveal delay-200 text-lg md:text-xl text-background/80 max-w-2xl mx-auto mb-12 font-light opacity-0">
            {heroContent.description}
          </p>

          {/* CTA Buttons */}
          <div className="reveal delay-300 flex flex-col sm:flex-row gap-4 justify-center opacity-0">
            <Button variant="hero" size="lg" asChild>
              <a href={heroContent.primaryCta.href}>{heroContent.primaryCta.label}</a>
            </Button>
            <Button
              variant="heroOutline"
              size="lg"
              className="border-background/30 text-background hover:border-background hover:bg-background/10"
              asChild
            >
              <a href={heroContent.secondaryCta.href}>{heroContent.secondaryCta.label}</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <a
          href={heroContent.scrollTarget}
          className="flex flex-col items-center gap-2 text-background/60 hover:text-primary transition-colors"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </a>
      </div>
    </section>
  );
};