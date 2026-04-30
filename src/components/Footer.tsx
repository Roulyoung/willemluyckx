import { Instagram, Mail, MapPin } from "lucide-react";
import { footerContent } from "@/content/siteContent";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container-wide mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <span className="font-display text-2xl tracking-wide text-foreground">
              {footerContent.brandMain}
              <span className="text-primary">.</span>
              {footerContent.brandLast}
            </span>
            <p className="mt-4 text-muted-foreground text-sm max-w-xs">
              {footerContent.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-lg mb-4">{footerContent.navigationTitle}</h4>
            <ul className="space-y-3">
              {footerContent.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg mb-4">{footerContent.contactTitle}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                {footerContent.location}
              </li>
              <li>
                <a
                  href={`mailto:${footerContent.email}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  {footerContent.email}
                </a>
              </li>
              <li>
                <a
                  href={footerContent.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  <Instagram className="w-4 h-4 text-primary" />
                  {footerContent.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Willem Luyckx. {footerContent.rightsText}
          </p>
          <p className="text-muted-foreground text-xs uppercase tracking-widest">
            {footerContent.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
};
