import { useEffect, useRef } from "react";
import techniqueImage from "@/assets/technique-running.jpg";
import { methodContent } from "@/content/siteContent";

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
                <p className="font-display text-3xl md:text-4xl">{methodContent.imageBadge.value}</p>
                <p className="text-xs uppercase tracking-widest">{methodContent.imageBadge.label}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <p className="reveal text-primary font-medium uppercase tracking-[0.3em] text-sm mb-4 opacity-0">
              {methodContent.label}
            </p>
            <h2 className="reveal delay-100 font-display text-4xl md:text-5xl lg:text-6xl mb-6 opacity-0">
              {methodContent.heading.line1}
              <br />
              <span className="text-primary">{methodContent.heading.highlight}</span>
            </h2>
            <p className="reveal delay-200 text-muted-foreground text-lg mb-10 opacity-0">
              {methodContent.description}
            </p>

            {/* Principles */}
            <div className="space-y-8">
              {methodContent.principles.map((principle, index) => (
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