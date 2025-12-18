import { useEffect, useRef } from "react";
import willemImage from "@/assets/willem-portrait.jpg";

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
              Over Willem
            </p>
            <h2 className="reveal delay-100 font-display text-4xl md:text-5xl lg:text-6xl mb-8 opacity-0">
              VAN ISRAËLISCH KAMPIOEN
              <br />
              <span className="text-primary">TOT VONDELPARK COACH</span>
            </h2>

            <div className="reveal delay-200 space-y-6 text-muted-foreground opacity-0">
              <p className="text-lg">
                Willem Luyckx is voormalig Israëlisch kampioen op de 3000m
                steeple en 5000m. Zijn zoektocht naar de ultieme trainingsmethode
                bracht hem naar de hoogvlaktes van Iten, Kenia en Addis Abeba,
                Ethiopië.
              </p>
              <p>
                Daar deelde hij jarenlang de rode stofpaden met de absolute
                wereldtop. Hij leerde niet alleen hoe ze trainen, maar ook hoe ze
                denken. De rust, de focus, de eenvoud.
              </p>
              <p>
                Voor de liefde verhuisde Willem naar Nederland. Nu deelt hij zijn
                passie en kennis in het Vondelpark en bij Team Zevenheuvelen.
                Zijn missie: de geheimen van de Afrikaanse loopschool toegankelijk
                maken voor elke ambitieuze Nederlandse loper.
              </p>
            </div>

            {/* Quote */}
            <blockquote className="reveal delay-300 mt-10 pl-6 border-l-4 border-primary opacity-0">
              <p className="italic text-lg">
                "Ik zie in het park te veel mensen 'harken'. Hardlopen moet geen
                strijd zijn, het moet een vloeiende beweging worden."
              </p>
              <cite className="block mt-4 text-sm text-muted-foreground not-italic">
                — Willem Luyckx
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
                  <div>
                    <p className="font-display text-3xl md:text-4xl text-primary">14:03</p>
                    <p className="text-xs uppercase tracking-widest opacity-70">5K PR</p>
                  </div>
                  <div>
                    <p className="font-display text-3xl md:text-4xl text-primary">29:30</p>
                    <p className="text-xs uppercase tracking-widest opacity-70">10K PR</p>
                  </div>
                  <div>
                    <p className="font-display text-3xl md:text-4xl text-primary">15+</p>
                    <p className="text-xs uppercase tracking-widest opacity-70">Jaar Ervaring</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
