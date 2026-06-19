import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Locale } from "@/lib/i18n";
import { topFitSiteConfig } from "@/lib/siteConfig";

const fadeClass = (_loaded: boolean) => "animate-fade-up";

export const ContactPage = ({
  locale,
  loaded,
}: {
  locale: Locale;
  loaded: boolean;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(locale === "en" ? "Contact request" : "Contactverzoek");
    const body = encodeURIComponent(`Naam: ${name}\nEmail: ${email}\n\nBoodschap:\n${message}`);
    window.location.href = `mailto:${topFitSiteConfig.contact.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section className={`mx-auto grid max-w-7xl gap-10 px-5 py-10 md:px-8 lg:grid-cols-[0.95fr_1.05fr] ${fadeClass(loaded)}`}>
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700 shadow-sm shadow-blue-950/5">
          <MessageCircle className="h-4 w-4" />
          Contact
        </div>
        <h1 className="max-w-4xl text-4xl font-black uppercase tracking-[0.04em] text-slate-950 sm:text-5xl md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]">
          {locale === "en" ? "Get in touch" : "Neem contact op"}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
          {locale === "en"
            ? "Send your name, email address and message. We will reply as soon as possible."
            : "Stuur je naam, e-mailadres en boodschap. We reageren zo snel mogelijk."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="heroOutline" size="lg" asChild>
            <a href={topFitSiteConfig.contact.whatsappHref} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              {topFitSiteConfig.contact.phoneDisplay}
            </a>
          </Button>
          <Button variant="heroOutline" size="lg" asChild>
            <a href={topFitSiteConfig.contact.phoneHref}>{locale === "en" ? "Call now" : "Bel nu"}</a>
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-slate-700">
                {locale === "en" ? "Name" : "Naam"}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-950 outline-none transition-colors focus:border-blue-400 focus:bg-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-950 outline-none transition-colors focus:border-blue-400 focus:bg-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-semibold text-slate-700">
                {locale === "en" ? "Message" : "Boodschap"}
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={7}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition-colors focus:border-blue-400 focus:bg-white"
                required
              />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full">
              {locale === "en" ? "Send message" : "Verstuur bericht"}
            </Button>
          </form>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            {locale === "en"
              ? "Or send a WhatsApp message to the number above."
              : "Of stuur een WhatsApp-bericht naar het nummer hierboven."}
          </p>
        </CardContent>
      </Card>
    </section>
  );
};
