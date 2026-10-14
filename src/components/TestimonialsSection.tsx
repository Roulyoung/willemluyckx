import { Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localeRoutes";
import { testimonialCopy } from "@/lib/testimonials";

const initials = (name: string) => name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();

export const TestimonialsSection = ({ locale, full = false }: { locale: Locale; full?: boolean }) => {
  const copy = testimonialCopy[locale];
  const reviews = full ? copy.reviews : copy.reviews.filter((_, index) => index !== 2).slice(0, 4);
  return <section id={full ? "testimonials" : "home-testimonials"} className="mx-auto max-w-7xl px-5 py-12 md:px-8">
    <div className="mx-auto max-w-4xl space-y-4 text-center"><div className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">TopFit Running</div><h2 className="text-3xl font-black text-slate-950 md:text-5xl">{copy.title}</h2><p className="text-lg leading-8 text-slate-600">{copy.subtitle}</p><div className="flex flex-wrap justify-center gap-2 pt-2">{copy.labels.map(label=><span key={label} className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-800">{label}</span>)}</div></div>
    <div className={`mt-8 grid gap-5 ${full ? "lg:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-4"}`}>{reviews.map(review=><Card key={review.name} className="border-slate-200 bg-white shadow-sm"><CardContent className="flex h-full flex-col gap-5 p-6"><div className="flex items-center justify-between gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">{initials(review.name)}</div><Quote className="h-7 w-7 text-blue-200"/></div>{full?<details className="group"><summary className="cursor-pointer list-none text-lg font-semibold leading-8 text-slate-800"><span className="group-open:hidden">“{review.shortQuote}”</span><span className="hidden text-sm font-semibold text-blue-700 group-open:inline">{copy.readMore}</span></summary><div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">{review.quote.split("\n\n").map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div></details>:<blockquote className="text-base font-semibold leading-7 text-slate-800">“{review.shortQuote}”</blockquote>}<div className="mt-auto border-t border-slate-100 pt-4"><p className="font-black text-slate-950">{review.name}</p><p className="mt-1 text-sm leading-6 text-slate-500">{review.role}</p></div></CardContent></Card>)}</div>
    {!full?<div className="mt-8 text-center"><Button variant="heroOutline" asChild><Link to={`${localizedPath(locale,"over-willem")}#testimonials`}>{copy.readAll}</Link></Button></div>:null}
  </section>;
};
