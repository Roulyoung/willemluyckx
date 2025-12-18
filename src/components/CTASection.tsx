import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export const CTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      toast.success("Gelukt! Check je inbox voor de Gratis Techniek Check.");
      setEmail("");
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-padding bg-foreground text-background relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute border-l border-background/20"
              style={{
                left: `${i * 5}%`,
                height: "100%",
                transform: `rotate(${i % 2 === 0 ? 15 : -15}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container-narrow mx-auto relative z-10 text-center">
        <p className="reveal text-primary font-medium uppercase tracking-[0.3em] text-sm mb-4 opacity-0">
          Gratis Techniek Check
        </p>
        <h2 className="reveal delay-100 font-display text-4xl md:text-5xl lg:text-6xl mb-6 opacity-0">
          ONTDEK WAT JE
          <br />
          <span className="text-primary">TEGENHOUDT</span>
        </h2>
        <p className="reveal delay-200 text-background/70 text-lg max-w-xl mx-auto mb-10 opacity-0">
          Ontvang een persoonlijke video-analyse van je looptechniek. Ik laat je
          precies zien waar je energie lekt en hoe je sneller kunt worden.
        </p>

        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit}
            className="reveal delay-300 flex flex-col sm:flex-row gap-4 max-w-md mx-auto opacity-0"
          >
            <Input
              type="email"
              placeholder="je@email.nl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-14 bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-primary"
            />
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="shrink-0 group"
            >
              Verstuur
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        ) : (
          <div className="reveal delay-300 flex items-center justify-center gap-3 text-primary opacity-0">
            <CheckCircle className="w-6 h-6" />
            <span className="text-lg font-medium">
              Check je inbox voor de volgende stappen!
            </span>
          </div>
        )}

        <p className="reveal delay-400 text-background/40 text-sm mt-6 opacity-0">
          Geen spam. Alleen waardevolle content over hardlopen.
        </p>
      </div>
    </section>
  );
};
