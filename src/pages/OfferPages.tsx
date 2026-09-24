import { Check, ArrowUpRight } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { offerPath, propositionOffers } from "@/lib/proposition";
import type { Locale } from "@/lib/i18n";
import runningImage from "@/assets/topfit/photos/willem-running.jpg";
import EmbeddedPackageCheckout from "@/components/EmbeddedPackageCheckout";

export const OfferCards = ({ locale }: { locale: Locale }) => (
  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
    {propositionOffers(locale).map(offer => (
      <Card key={offer.slug} className={`flex flex-col border-slate-200 bg-white shadow-sm ${offer.featured ? "ring-2 ring-blue-500/30" : ""}`}>
        <CardContent className="flex h-full flex-col gap-5 p-6 md:p-8">
          <p className="text-lg font-bold text-blue-700">{offer.price}</p>
          <h3 className="text-2xl font-black text-slate-950">{offer.title}</h3>
          <p className="text-sm leading-7 text-slate-600">{offer.summary}</p>
          <ul className="space-y-3 text-sm leading-6 text-slate-700">
            {offer.bullets.map(bullet => <li key={bullet} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-blue-600" /><span>{bullet}</span></li>)}
          </ul>
          <Button asChild variant={offer.featured ? "hero" : "heroOutline"} className="mt-auto h-auto min-h-12 whitespace-normal py-3">
            <Link to={offerPath(locale, offer.slug)}>{locale === "nl" ? "Bekijk mogelijkheden" : "Explore this offer"}<ArrowUpRight className="ml-2 h-4 w-4 shrink-0" /></Link>
          </Button>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const PropositionIntro = ({ locale }: { locale: Locale }) => (
  <section id="services" className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:px-8 lg:grid-cols-2">
    <div className="space-y-5">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">{locale === "nl" ? "Onze visie" : "Our approach"}</p>
      <h2 className="text-3xl font-black text-slate-950 md:text-5xl">{locale === "nl" ? "Niet méér trainen, maar beter trainen." : "Train better, not just more."}</h2>
      <p className="text-lg leading-8 text-slate-600">{locale === "nl" ? "Op internet en met AI kun je eenvoudig een gratis trainingsschema maken. Daarom vinden wij dat een goed hardloopschema betaalbaar en toegankelijk moet zijn. Maar goed trainen is méér dan een rijtje kilometers en tempo’s." : "The internet and AI make it easy to find a free training plan. We believe a good plan should be affordable and accessible. Good training takes more than a list of distances and paces."}</p>
    </div>
    <div className="space-y-5 rounded-3xl bg-blue-50 p-7 md:p-9">
      <h3 className="text-2xl font-black text-slate-950">{locale === "nl" ? "Waarom TopFit Running?" : "Why TopFit Running?"}</h3>
      <p className="leading-8 text-slate-700">{locale === "nl" ? "Wij geloven niet in één perfecte loopstijl of één trainingsmethode voor iedereen. Bij TopFit Running kijken we naar het totaal: trainingsopbouw, looptechniek, kracht en core, mobiliteit, herstel, voeding en de balans tussen belasting en belastbaarheid." : "We do not believe in one perfect running style or training method for everyone. We consider the whole picture: training progression, technique, strength and core, mobility, recovery, nutrition and the balance between training load and capacity."}</p>
      <p className="leading-8 text-slate-700">{locale === "nl" ? "Een goede loper ontwikkelt een lichaam dat sterk, soepel, stabiel en ontspannen kan bewegen. Efficiënt hardlopen vraagt om een balans tussen fysiologie en biomechanica: voldoende paslengte en afzet, zonder onnodig energieverlies door verticale beweging, afremming of correcties." : "A runner develops a body that can move with strength, mobility, stability and ease. Efficient running balances physiology and biomechanics: enough stride length and propulsion, without unnecessary energy loss from vertical movement, braking or corrections."}</p>
      <p className="font-semibold leading-7 text-blue-900">{locale === "nl" ? "Een schema vertelt je wat je kunt trainen. Persoonlijke begeleiding helpt je ontdekken hoe je beter traint — op een manier die bij jou past." : "A plan tells you what to train. Personal guidance helps you discover how to train better, in a way that suits you."}</p>
    </div>
  </section>
);

export const OffersPage = ({ locale }: { locale: Locale }) => (
  <>
    <section className="mx-auto max-w-7xl space-y-8 px-5 py-12 md:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">TopFit Running</p>
      <h1 className="max-w-4xl text-4xl font-black text-slate-950 md:text-6xl">{locale === "nl" ? "Een betaalbare start. Persoonlijke aandacht om verder te komen." : "An affordable start. Personal attention to help you progress."}</h1>
      <p className="max-w-3xl text-lg leading-8 text-slate-600">{locale === "nl" ? "Begin met een schema op maat voor €19. Kies daarnaast de begeleiding die je nodig hebt: een Zoom Check, fysieke training, een clinic of een lezing voor jouw groep." : "Start with a tailored plan for €19. Add the guidance you need: a Zoom Check, in-person training, a clinic or a talk for your group."}</p>
      <div id="guidance"><OfferCards locale={locale} /></div>
    </section>
    <PropositionIntro locale={locale} />
  </>
);

export const OfferDetailPage = ({ locale, slug }: { locale: Locale; slug: string }) => {
  const location = useLocation();
  const nl = locale === "nl";
  const checkoutOnly = slug === "schema-checkout";
  const offer = propositionOffers(locale).find(item => item.slug === (checkoutOnly ? "schema" : slug));
  if (!offer) return <Navigate to={offerPath(locale)} replace />;
  const schema = slug === "schema";
  if (checkoutOnly) {
    return <>
      <section className="mx-auto max-w-4xl space-y-5 px-5 py-12 md:px-8">
        <Link className="text-sm font-semibold text-blue-700" to={offerPath(locale, "schema")}>{nl ? "← Terug naar het schema" : "← Back to the plan"}</Link>
        <h1 className="text-4xl font-black text-slate-950 md:text-6xl">{nl ? "Je schema afrekenen" : "Pay for your plan"}</h1>
        <p className="text-lg leading-8 text-slate-600">{nl ? "Reken veilig €19 af. Na de betaling kun je de intake invullen." : "Pay €19 securely. After payment, you can complete the intake."}</p>
      </section>
      <EmbeddedPackageCheckout locale={locale} slug="schema" isSuccess={new URLSearchParams(location.search).get("success") === "1"} intakePath={`/intake?locale=${locale}&flow=checkout&product=schema`} loaded product={{ title: offer.title, price: offer.price, bullets: offer.bullets }} />
    </>;
  }
  const requestHref = schema ? `${offerPath(locale, "schema")}/afrekenen` : `/${locale}/contact?onderwerp=${encodeURIComponent(offer.title)}`;
  const topics = nl ? [
    ["Mukti Running", "Gezondheid, bewust bewegen, ontspanning en plezier, met een bredere blik dan alleen prestaties en tijden."],
    ["Trainingsleer", "Verantwoord opbouwen, belasting en herstel in balans en slimmer trainen in plaats van alleen méér."],
    ["Voeding voor hardlopers", "Praktische inzichten over voeding, energie, herstel en gezonde voedingsgewoonten voor sporters."],
    ["Blessurepreventie", "Duurzaam hardlopen met aandacht voor looptechniek, trainingsopbouw, kracht, mobiliteit en herstel."],
  ] : [
    ["Mukti Running", "Health, conscious movement, relaxation and enjoyment, with a broader view than performance and times alone."],
    ["Training principles", "Responsible progression, balancing load and recovery, and training smarter rather than simply more."],
    ["Nutrition for runners", "Practical insights into food, energy, recovery and healthy eating habits for athletes."],
    ["Injury prevention", "Sustainable running through technique, training progression, strength, mobility and recovery."],
  ];
  const schedule = nl ? [
    ["10.00–12.00", "Praktijk: warming-up, looptechniek, fartlektraining en cooling-down met stretching en krachtoefeningen met het lichaamsgewicht."],
    ["12.00–12.30", "Herstel en ruimte voor persoonlijke vragen."],
    ["12.30–13.15", "Gezamenlijke lunch (inbegrepen)."],
    ["13.15–13.30", "Pauze en voorbereiding op de lezing."],
    ["13.30–15.30", "Lezing, bijvoorbeeld over Mukti Running, met ruimte voor vragen."],
    ["15.30–16.00", "Persoonlijke aanwijzingen, terugblik en afsluiting."],
  ] : [
    ["10:00–12:00", "Practical session: warm-up, running technique, fartlek training and cool-down with stretching and bodyweight strength exercises."],
    ["12:00–12:30", "Recovery and personal questions."],
    ["12:30–13:15", "Lunch together (included)."],
    ["13:15–13:30", "Break and preparation for the talk."],
    ["13:30–15:30", "A talk, for example on Mukti Running, with questions."],
    ["15:30–16:00", "Personal feedback, review and closing."],
  ];
  return <>
    <section id={schema ? "trainingplans-hero" : `${slug}-hero`} className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:px-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="min-w-0 space-y-6">
        <Link className="text-sm font-semibold text-blue-700" to={offerPath(locale)}>{nl ? "← Alle mogelijkheden" : "← All offers"}</Link>
        <h1 className="text-4xl font-black text-slate-950 md:text-6xl">{offer.title}</h1>
        <p className="text-3xl font-bold text-blue-700">{offer.price}</p>
        <p className="text-lg leading-8 text-slate-600">{offer.summary}</p>
        <ul className="space-y-3">{offer.bullets.map(bullet => <li key={bullet} className="flex gap-3 leading-7 text-slate-700"><Check className="mt-1 h-5 w-5 shrink-0 text-blue-600" />{bullet}</li>)}</ul>
        <Button id={schema ? "trainingplans-next" : undefined} variant="hero" size="lg" className="h-auto min-h-14 max-w-full whitespace-normal px-6 text-center" asChild><Link to={requestHref}>{schema ? nl ? "Betaal je schema voor €19" : "Pay €19 for your plan" : nl ? "Informeer naar mogelijkheden" : "Ask about availability"}</Link></Button>
        {schema && <p className="text-sm leading-7 text-slate-600">{nl ? "Vul je intake in. Willem maakt het schema op maat op basis van jouw afstand, niveau, doelen en beschikbare trainingsdagen en stuurt het daarna toe." : "Complete your intake. Willem creates your plan based on your distance, level, goals and available training days, then sends it to you."}</p>}
      </div>
      <img src={runningImage} alt={nl ? "Willem tijdens het hardlopen" : "Willem running"} className="h-[26rem] w-full rounded-3xl object-cover object-center lg:h-full lg:max-h-[38rem]" />
    </section>
    {schema && <section id="trainingplans-table" className="mx-auto max-w-7xl px-5 pb-12 md:px-8"><Card><CardContent className="space-y-5 p-7 md:p-9"><h2 className="text-3xl font-black">{nl ? "Een helder schema voor 12 weken" : "A clear 12-week plan"}</h2><p className="max-w-3xl leading-8 text-slate-600">{nl ? "Je ontvangt een duidelijke trainingsopbouw voor 12 weken, afgestemd op jouw afstand, niveau en doel. De inhoudelijke verdieping over techniek, kracht en core, mobiliteit, herstel, voeding en leefstijl valt buiten het schema van €19." : "You receive a clear 12-week training progression tailored to your distance, level and goal. In-depth guidance on technique, strength and core, mobility, recovery, nutrition and lifestyle is separate from the €19 plan."}</p><p className="font-semibold text-blue-800">{nl ? "Wil je hierover persoonlijke uitleg en advies? Boek een losse Zoom Check van 30 minuten voor €40." : "Want personal explanation and advice on these topics? Book a separate 30-minute Zoom Check for €40."}</p><Link className="inline-block font-semibold text-blue-700 underline" to={offerPath(locale, "zoom")}>{nl ? "Bekijk de Zoom Check" : "Explore the Zoom Check"}</Link></CardContent></Card></section>}
    {slug === "clinic" && <section className="mx-auto max-w-7xl space-y-7 px-5 pb-12 md:px-8"><h2 className="text-3xl font-black">{nl ? "Van theorie naar praktijk" : "From theory to practice"}</h2><p className="max-w-3xl leading-8 text-slate-600">{nl ? "Theorie en praktijk in een bosrijke omgeving, voor teams, bedrijven én individuele lopers. We besteden aandacht aan looptechniek en loopeconomie, trainingsleer, kracht en core, mobiliteit, herstel en blessurepreventie. Je krijgt persoonlijke aanwijzingen die je direct kunt toepassen. Minimaal 10 deelnemers." : "Theory and practice in a wooded setting for teams, businesses and individual runners. We cover technique and running economy, training principles, strength and core, mobility, recovery and injury prevention. You receive personal tips to use immediately. Minimum 10 participants."}</p><p className="rounded-2xl bg-blue-50 p-5 font-semibold text-blue-900">{nl ? "Normaal €130 per persoon, inclusief lunch. Heb je een TopFit Running-schema gekocht? Dan betaal je €120. Vermeld dit bij je aanvraag." : "Normally €130 per person, including lunch. Purchased a TopFit Running plan? Your price is €120. Mention this in your enquiry."}</p><h3 className="text-2xl font-black">{nl ? "Voorbeeldprogramma · 10.00–16.00 uur" : "Example programme · 10:00–16:00"}</h3><p className="text-slate-600">{nl ? "De inhoud en tijden kunnen in overleg worden afgestemd op de groep." : "Content and times can be adapted to your group by arrangement."}</p><dl className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white px-6">{schedule.map(([time, text]) => <div key={time} className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr]"><dt className="font-bold text-blue-700">{time}</dt><dd className="leading-7 text-slate-700">{text}</dd></div>)}</dl></section>}
    {slug === "lezing" && <section className="mx-auto max-w-7xl space-y-6 px-5 pb-12 md:px-8"><h2 className="text-3xl font-black">{nl ? "Een lezing die past bij jouw doelgroep" : "A talk tailored to your audience"}</h2><p className="text-lg leading-8 text-slate-600">{nl ? "90 minuten voor €500 per lezing. Kies een onderwerp, combineer thema’s of bespreek een ander onderwerp met Willem." : "90 minutes for €500 per talk. Choose a subject, combine themes or discuss another topic with Willem."}</p><div className="grid gap-5 md:grid-cols-2">{topics.map(([title, text]) => <Card key={title}><CardContent className="space-y-3 p-7"><h3 className="text-2xl font-bold">{title}</h3><p className="leading-7 text-slate-600">{text}</p></CardContent></Card>)}</div></section>}
  </>;
};
