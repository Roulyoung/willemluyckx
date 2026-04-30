import { useEffect, useRef } from "react";
import willemImage from "@/assets/willem-portrait.jpg";
import { aboutContent } from "@/content/siteContent";

export const AboutSection = () => {
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
    <section id="about" ref={sectionRef} className="section-padding bg-background">
      <div className="container-wide mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Content */}
          <div>
            <p className="reveal text-primary font-medium uppercase tracking-[0.3em] text-sm mb-4 opacity-0">
              {aboutContent.label}
            </p>
            <h2 className="reveal delay-100 font-display text-4xl md:text-5xl lg:text-6xl mb-8 opacity-0">
              {aboutContent.heading.line1}
              <br />
              <span className="text-primary">{aboutContent.heading.highlight}</span>
            </h2>

            <div className="reveal delay-200 space-y-6 text-muted-foreground opacity-0">
              {aboutContent.paragraphs.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "text-lg" : undefined}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Quote */}
            <blockquote className="reveal delay-300 mt-10 pl-6 border-l-4 border-primary opacity-0">
              <p className="italic text-lg">{aboutContent.quote}</p>
              <cite className="block mt-4 text-sm text-muted-foreground not-italic">
                - {aboutContent.quoteAuthor}
              </cite>
            </blockquote>
          </div>

          {/* Image */}
          <div className="reveal delay-200 opacity-0">
            <div className="relative">
              <img
                src={willemImage}
                alt="Willem Luyckx - Running Coach"
                className="w-full grayscale"
              />
              {/* Stats overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/90 to-transparent p-8">
                <div className="grid grid-cols-3 gap-4 text-background text-center">
                  {aboutContent.stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="font-display text-3xl md:text-4xl text-primary">{stat.value}</p>
                      <p className="text-xs uppercase tracking-widest opacity-70">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};