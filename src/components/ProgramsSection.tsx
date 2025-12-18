import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

const programs = [
  {
    name: "The Foundation",
    subtitle: "Techniek & Basis",
    price: "149",
    description:
      "Bouw een solide technische basis. Leer lopen zoals de elite.",
    features: [
      "8-weken techniek programma",
      "Video analyse van je loopvorm",
      "Cadans & houding oefeningen",
      "Mobiliteit routines",
      "Toegang tot community",
    ],
    popular: false,
  },
  {
    name: "Speed Evolution",
    subtitle: "PR-Gericht",
    price: "249",
    description:
      "Een volledig periodisatie plan gericht op je persoonlijk record.",
    features: [
      "12-weken trainingsschema",
      "Gepersonaliseerde zones",
      "Interval & tempo sessies",
      "Race strategie",
      "Wekelijkse feedback",
      "1x video call",
    ],
    popular: true,
  },
  {
    name: "Elite Mentorship",
    subtitle: "1-op-1 Coaching",
    price: "449",
    description:
      "Directe toegang tot Willem voor maximale persoonlijke begeleiding.",
    features: [
      "Volledig op maat programma",
      "Wekelijkse 1-op-1 calls",
      "Dagelijkse app ondersteuning",
      "Live video analyse",
      "Mentale coaching",
      "Race-dag begeleiding",
    ],
    popular: false,
  },
];

export const ProgramsSection = () => {
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
      id="programmas"
      ref={sectionRef}
      className="section-padding bg-secondary/50"
    >
      <div className="container-wide mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="reveal text-primary font-medium uppercase tracking-[0.3em] text-sm mb-4 opacity-0">
            Trainingsprogrammas
          </p>
          <h2 className="reveal delay-100 font-display text-4xl md:text-5xl lg:text-6xl mb-6 opacity-0">
            KIES JE PAD NAAR
            <br />
            <span className="text-primary">SNELHEID</span>
          </h2>
          <p className="reveal delay-200 text-muted-foreground text-lg opacity-0">
            Van techniek-basis tot elite mentorship. Elk programma is gebouwd op
            dezelfde principes die kampioenen maken.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {programs.map((program, index) => (
            <div
              key={program.name}
              className={`reveal delay-${(index + 3) * 100} relative bg-card p-8 lg:p-10 flex flex-col opacity-0 ${
                program.popular
                  ? "border-2 border-primary shadow-xl shadow-primary/10"
                  : "border border-border"
              }`}
            >
              {program.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 text-xs uppercase tracking-widest font-semibold">
                  Meest Gekozen
                </div>
              )}

              <div className="mb-8">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  {program.subtitle}
                </p>
                <h3 className="font-display text-3xl mb-4">{program.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {program.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display">€{program.price}</span>
                  <span className="text-muted-foreground text-sm">/maand</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {program.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={program.popular ? "hero" : "outline"}
                className="w-full group"
              >
                Start Nu
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
