import { useEffect, useRef } from "react";
import techniqueImage from "@/assets/technique-running.jpg";

const principles = [
  {
    number: "01",
    title: "Techniek Boven Kilometers",
    description:
      "Zonder de juiste cadans en houding ben je alleen maar energie aan het verspillen. Wij bouwen eerst de basis.",
  },
  {
    number: "02",
    title: "De Lydiard Methode",
    description:
      "Gebaseerd op Arthur Lydiard's bewezen periodisering: een sterke aerobe basis gevolgd door specifieke snelheidswerk.",
  },
  {
    number: "03",
    title: "Rust als Training",
    description:
      "De Kenianen begrijpen dat rust net zo belangrijk is als de harde intervallen. Recovery is waar de vooruitgang gebeurt.",
  },
  {
    number: "04",
    title: "Economisch Lopen",
    description:
      "Hardlopen moet geen strijd zijn, het moet een vloeiende beweging worden. Efficiëntie wint op de lange termijn.",
  },
];

export const MethodSection = () => {
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
      id="methodiek"
      ref={sectionRef}
      className="section-padding bg-background"
    >
      <div className="container-wide mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <div className="reveal order-2 lg:order-1 opacity-0">
            <div className="relative">
              <img
                src={techniqueImage}
                alt="Perfect running technique"
                className="w-full grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 bg-primary text-primary-foreground p-4 md:p-6">
                <p className="font-display text-3xl md:text-4xl">14:03</p>
                <p className="text-xs uppercase tracking-widest">5.000m PR</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <p className="reveal text-primary font-medium uppercase tracking-[0.3em] text-sm mb-4 opacity-0">
              De Keniaanse Methodiek
            </p>
            <h2 className="reveal delay-100 font-display text-4xl md:text-5xl lg:text-6xl mb-6 opacity-0">
              GEHEIMEN VAN DE
              <br />
              <span className="text-primary">AFRIKAANSE TOPLOPERS</span>
            </h2>
            <p className="reveal delay-200 text-muted-foreground text-lg mb-10 opacity-0">
              Ik breng de geheimen van de Afrikaanse toplopers naar de nuchtere
              Nederlandse loper. Geen mystiek, wel bewezen methodes.
            </p>

            {/* Principles */}
            <div className="space-y-8">
              {principles.map((principle, index) => (
                <div
                  key={principle.number}
                  className={`reveal delay-${(index + 3) * 100} flex gap-6 opacity-0`}
                >
                  <span className="font-display text-4xl text-primary/30">
                    {principle.number}
                  </span>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {principle.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
