import { useEffect, useRef } from "react";
import { Trophy, MapPin, Timer, Medal } from "lucide-react";
import { proofContent } from "@/content/siteContent";

const iconMap = {
  Trophy,
  MapPin,
  Timer,
  Medal,
};

export const ProofSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="proof"
      ref={sectionRef}
      className="section-padding bg-foreground text-background"
    >
      <div className="container-wide mx-auto">
        {/* Quote */}
        <blockquote className="reveal max-w-4xl mx-auto text-center mb-20 opacity-0">
          <p className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
            "{proofContent.quotePrefix}{" "}
            <span className="text-primary">{proofContent.quoteHighlight}</span>"
          </p>
          <cite className="text-background/60 text-sm uppercase tracking-widest not-italic">
            - {proofContent.quoteAuthor}
          </cite>
        </blockquote>

        {/* Credentials Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {proofContent.credentials.map((cred, index) => {
            const Icon = iconMap[cred.icon as keyof typeof iconMap];
            return (
              <div
                key={cred.title}
                className={`reveal delay-${(index + 1) * 100} text-center p-6 md:p-8 border border-background/10 hover:border-primary/50 transition-colors duration-300 opacity-0`}
              >
                <Icon className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-display text-xl md:text-2xl mb-2">{cred.title}</h3>
                <p className="text-background/60 text-sm">{cred.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
