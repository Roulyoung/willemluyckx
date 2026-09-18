import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
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
  const [searchParams] = useSearchParams();
  const subject = searchParams.get("onderwerp") ?? "";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMessage(subject ? `${locale === "nl" ? "Ik ontvang graag meer informatie over" : "I would like more information about"} ${subject}.` : "");
  }, [subject, locale]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message, locale }),
      });

      if (!response.ok) {
        throw new Error("contact submission failed");
      }

      setName("");
      setEmail("");
      setMessage("");
      toast.success(locale === "en" ? "Message sent" : "Bericht verstuurd");
    } catch {
      toast.error(locale === "en" ? "Message could not be sent" : "Bericht kon niet worden verstuurd");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact-hero" className={`mx-auto grid max-w-7xl gap-10 px-5 py-10 md:px-8 lg:grid-cols-[0.95fr_1.05fr] ${fadeClass(loaded)}`}>
      <div className="min-w-0 space-y-6">
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
              WhatsApp
            </a>
          </Button>
          <Button variant="heroOutline" size="lg" asChild>
            <Link to="/intake">{locale === "en" ? "Start intake" : "Start intake"}</Link>
          </Button>
        </div>
      </div>

      <Card id="contact-form" className="min-w-0 border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
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
            <Button type="submit" disabled={submitting} variant="hero" size="lg" className="h-auto min-h-14 w-full whitespace-normal px-4 text-center">
              {submitting ? (locale === "en" ? "Sending..." : "Versturen...") : locale === "en" ? "Send message" : "Verstuur bericht"}
            </Button>
          </form>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            {locale === "en"
              ? "Or use WhatsApp or the intake if you want a quicker route."
              : "Of gebruik WhatsApp of de intake als je sneller verder wilt."}
          </p>
        </CardContent>
      </Card>
    </section>
  );
};
