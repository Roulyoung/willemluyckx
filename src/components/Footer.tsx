import { Instagram, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container-wide mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <span className="font-display text-2xl tracking-wide text-foreground">
              WILLEM<span className="text-primary">.</span>LUYCKX
            </span>
            <p className="mt-4 text-muted-foreground text-sm max-w-xs">
              Hardloopcoach met de kennis van de Keniaanse elite. Gebaseerd in
              Amsterdam.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-lg mb-4">Navigatie</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#methodiek"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  De Methodiek
                </a>
              </li>
              <li>
                <a
                  href="#programmas"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Programmas
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Over Willem
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Gratis Techniek Check
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                Vondelpark, Amsterdam
              </li>
              <li>
                <a
                  href="mailto:willem@luyckx.run"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  willem@luyckx.run
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  <Instagram className="w-4 h-4 text-primary" />
                  @willemluyckx
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Willem Luyckx. Alle rechten voorbehouden.
          </p>
          <p className="text-muted-foreground text-xs uppercase tracking-widest">
            Train Smart. Run Fast.
          </p>
        </div>
      </div>
    </footer>
  );
};
