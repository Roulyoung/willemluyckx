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
            <Link to={offerPath(locale, offer.slug)}>{locale === "nl" ? "Bekijk mogelijkheden" : locale === "he" ? "לפרטים נוספים" : "Explore this offer"}<ArrowUpRight className="ml-2 h-4 w-4 shrink-0" /></Link>
          </Button>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const PropositionIntro = ({ locale }: { locale: Locale }) => (
  <section id="services" className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:px-8 lg:grid-cols-2">
    <div className="space-y-5">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">{locale === "nl" ? "Onze visie" : locale === "he" ? "הגישה שלנו" : "Our approach"}</p>
      <h2 className="text-3xl font-black text-slate-950 md:text-5xl">{locale === "nl" ? "Niet méér trainen, maar beter trainen." : locale === "he" ? "להתאמן טוב יותר, לא רק יותר." : "Train better, not just more."}</h2>
      <p className="text-lg leading-8 text-slate-600">{locale === "nl" ? "Op internet en met AI kun je eenvoudig een gratis trainingsschema maken. Daarom vinden wij dat een goed hardloopschema betaalbaar en toegankelijk moet zijn. Maar goed trainen is méér dan een rijtje kilometers en tempo’s." : locale === "he" ? "באינטרנט ובעזרת בינה מלאכותית קל למצוא תוכנית אימון בחינם. אנחנו מאמינים שתוכנית טובה צריכה להיות נגישה ובמחיר הוגן, אך אימון טוב הוא יותר מרשימת מרחקים וקצבים." : "The internet and AI make it easy to find a free training plan. We believe a good plan should be affordable and accessible. Good training takes more than a list of distances and paces."}</p>
    </div>
    <div className="space-y-5 rounded-3xl bg-blue-50 p-7 md:p-9">
      <h3 className="text-2xl font-black text-slate-950">{locale === "nl" ? "Waarom TopFit Running?" : locale === "he" ? "למה TopFit Running?" : "Why TopFit Running?"}</h3>
      <p className="leading-8 text-slate-700">{locale === "nl" ? "Wij geloven niet in één perfecte loopstijl of één trainingsmethode voor iedereen. Bij TopFit Running kijken we naar het totaal: trainingsopbouw, looptechniek, kracht en core, mobiliteit, herstel, voeding en de balans tussen belasting en belastbaarheid." : locale === "he" ? "אנחנו לא מאמינים בסגנון ריצה מושלם אחד או בשיטת אימון אחת שמתאימה לכולם. ב־TopFit Running מסתכלים על התמונה המלאה: בניית האימון, טכניקה, כוח וליבה, תנועתיות, התאוששות, תזונה והאיזון בין עומס ליכולת." : "We do not believe in one perfect running style or training method for everyone. We consider the whole picture: training progression, technique, strength and core, mobility, recovery, nutrition and the balance between training load and capacity."}</p>
      <p className="leading-8 text-slate-700">{locale === "nl" ? "Een goede loper ontwikkelt een lichaam dat sterk, soepel, stabiel en ontspannen kan bewegen. Efficiënt hardlopen vraagt om een balans tussen fysiologie en biomechanica: voldoende paslengte en afzet, zonder onnodig energieverlies door verticale beweging, afremming of correcties." : locale === "he" ? "רץ טוב מפתח גוף שיכול לנוע בכוח, בגמישות, ביציבות וברוגע. ריצה יעילה מאזנת בין פיזיולוגיה לביומכניקה: אורך צעד ודחיפה מספיקים ללא בזבוז אנרגיה מיותר." : "A runner develops a body that can move with strength, mobility, stability and ease. Efficient running balances physiology and biomechanics: enough stride length and propulsion, without unnecessary energy loss from vertical movement, braking or corrections."}</p>
      <p className="font-semibold leading-7 text-blue-900">{locale === "nl" ? "Een schema vertelt je wat je kunt trainen. Persoonlijke begeleiding helpt je ontdekken hoe je beter traint — op een manier die bij jou past." : locale === "he" ? "תוכנית אומרת מה להתאמן. ליווי אישי עוזר לגלות איך להתאמן טוב יותר בדרך שמתאימה לכם." : "A plan tells you what to train. Personal guidance helps you discover how to train better, in a way that suits you."}</p>
    </div>
  </section>
);

export const OffersPage = ({ locale }: { locale: Locale }) => (
  <>
    <section className="mx-auto max-w-7xl space-y-8 px-5 py-12 md:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">TopFit Running</p>
      <h1 className="max-w-4xl text-4xl font-black text-slate-950 md:text-6xl">{locale === "nl" ? "Een betaalbare start. Persoonlijke aandacht om verder te komen." : locale === "he" ? "התחלה נגישה. תשומת לב אישית כדי להתקדם." : "An affordable start. Personal attention to help you progress."}</h1>
      <p className="max-w-3xl text-lg leading-8 text-slate-600">{locale === "nl" ? "Begin met een schema op maat voor €19. Kies daarnaast de begeleiding die je nodig hebt: een Zoom Check, fysieke training, een clinic of een lezing voor jouw groep." : locale === "he" ? "התחילו בתוכנית מותאמת ב־€19. הוסיפו את הליווי הדרוש לכם: פגישת Zoom, אימון אישי, סדנה או הרצאה לקבוצה." : "Start with a tailored plan for €19. Add the guidance you need: a Zoom Check, in-person training, a clinic or a talk for your group."}</p>
      <div id="guidance"><OfferCards locale={locale} /></div>
    </section>
    <PropositionIntro locale={locale} />
  </>
);

export const OfferDetailPage = ({ locale, slug }: { locale: Locale; slug: string }) => {
  const location = useLocation();
  const nl = locale === "nl";
  const he = locale === "he";
  const t = (nlText: string, enText: string, heText: string) => he ? heText : nl ? nlText : enText;
  const checkoutOnly = slug === "schema-checkout";
  const offer = propositionOffers(locale).find(item => item.slug === (checkoutOnly ? "schema" : slug));
  if (!offer) return <Navigate to={offerPath(locale)} replace />;
  const schema = slug === "schema";
  if (checkoutOnly) {
    return <>
      <section className="mx-auto max-w-4xl space-y-5 px-5 py-12 md:px-8">
        <Link className="text-sm font-semibold text-blue-700" to={offerPath(locale, "schema")}>{t("← Terug naar het schema", "← Back to the plan", "חזרה לתוכנית →")}</Link>
        <h1 className="text-4xl font-black text-slate-950 md:text-6xl">{t("Je schema afrekenen", "Pay for your plan", "תשלום עבור התוכנית")}</h1>
        <p className="text-lg leading-8 text-slate-600">{t("Reken veilig €19 af. Na de betaling kun je de intake invullen.", "Pay €19 securely. After payment, you can complete the intake.", "שלמו €19 באופן מאובטח. לאחר התשלום תוכלו למלא את שאלון הקליטה.")}</p>
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
  ] : he ? [
    ["Mukti Running", "בריאות, תנועה מודעת, רוגע והנאה, במבט רחב יותר מביצועים וזמנים בלבד."],
    ["עקרונות אימון", "בנייה אחראית ואיזון בין עומס להתאוששות."],
    ["תזונה לרצים", "תובנות מעשיות על תזונה, אנרגיה והתאוששות."],
    ["מניעת פציעות", "ריצה לאורך זמן בעזרת טכניקה, כוח, תנועתיות והתאוששות."],
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
  ] : he ? [
    ["10:00–12:00", "תרגול: חימום, טכניקת ריצה, פארטלק ושחרור עם מתיחות ותרגילי כוח."],
    ["12:00–12:30", "התאוששות וזמן לשאלות אישיות."],
    ["12:30–13:15", "ארוחת צהריים משותפת (כלולה)."],
    ["13:15–13:30", "הפסקה והכנה להרצאה."],
    ["13:30–15:30", "הרצאה עם זמן לשאלות."],
    ["15:30–16:00", "הנחיות אישיות, סיכום וסיום."],
  ] : [
    ["10:00–12:00", "Practical session: warm-up, running technique, fartlek training and cool-down with stretching and bodyweight strength exercises."],
    ["12:00–12:30", "Recovery and personal questions."],
    ["12:30–13:15", "Lunch together (included)."],
    ["13:15–13:30", "Break and preparation for the talk."],
    ["13:30–15:30", "A talk, for example on Mukti Running, with questions."],
    ["15:30–16:00", "Personal feedback, review and closing."],
  ];
  if (he && slug === "clinic") return <section className="mx-auto max-w-7xl space-y-8 px-5 py-12 md:px-8"><Link className="font-semibold text-blue-700" to={offerPath(locale)}>כל ההצעות →</Link><div className="grid gap-8 lg:grid-cols-2"><div className="space-y-5"><h1 className="text-4xl font-black md:text-6xl">{offer.title}</h1><p className="text-3xl font-bold text-blue-700">{offer.price}</p><p className="text-lg leading-8 text-slate-600">{offer.summary}</p><ul className="space-y-3">{offer.bullets.map(item=><li key={item} className="flex gap-3"><Check className="h-5 w-5 text-blue-600"/>{item}</li>)}</ul><Button variant="hero" asChild><Link to={requestHref}>בירור אפשרויות</Link></Button></div><img src={runningImage} alt="סדנת ריצה" className="h-[30rem] w-full rounded-3xl object-cover"/></div><Card><CardContent className="space-y-5 p-7"><h2 className="text-3xl font-black">מהתיאוריה למעשה</h2><p className="leading-8 text-slate-600">סדנה מעשית בסביבה ירוקה עבור קבוצות, חברות ורצים יחידים. נעבוד על טכניקה, יעילות, כוח, תנועתיות, התאוששות ומניעת פציעות. מינימום 10 משתתפים.</p><p className="rounded-2xl bg-blue-50 p-5 font-semibold text-blue-900">€130 למשתתף, כולל ארוחת צהריים. מי שכבר רכש תוכנית TopFit Running משלם €120.</p><h3 className="text-2xl font-black">תוכנית לדוגמה · 10:00–16:00</h3><dl className="divide-y rounded-2xl border px-5">{schedule.map(([time,text])=><div key={time} className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr]"><dt className="font-bold text-blue-700">{time}</dt><dd>{text}</dd></div>)}</dl></CardContent></Card></section>;
  if (he && slug === "lezing") return <section className="mx-auto max-w-7xl space-y-8 px-5 py-12 md:px-8"><Link className="font-semibold text-blue-700" to={offerPath(locale)}>כל ההצעות →</Link><div className="max-w-4xl space-y-5"><h1 className="text-4xl font-black md:text-6xl">{offer.title}</h1><p className="text-3xl font-bold text-blue-700">{offer.price}</p><p className="text-lg leading-8 text-slate-600">{offer.summary}</p><Button variant="hero" asChild><Link to={requestHref}>בירור אפשרויות</Link></Button></div><div className="grid gap-5 md:grid-cols-2">{topics.map(([title,text])=><Card key={title}><CardContent className="space-y-3 p-7"><h2 className="text-2xl font-black">{title}</h2><p className="leading-7 text-slate-600">{text}</p></CardContent></Card>)}</div><p className="text-lg font-semibold text-blue-900">90 דקות ב־€500 להרצאה. אפשר לבחור נושא, לשלב נושאים או לתאם נושא אחר עם וילם.</p></section>;
  return <>
    <section id={schema ? "trainingplans-hero" : `${slug}-hero`} className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:px-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="min-w-0 space-y-6">
        <Link className="text-sm font-semibold text-blue-700" to={offerPath(locale)}>{t("← Alle mogelijkheden", "← All offers", "כל ההצעות →")}</Link>
        <h1 className="text-4xl font-black text-slate-950 md:text-6xl">{offer.title}</h1>
        <p className="text-3xl font-bold text-blue-700">{offer.price}</p>
        <p className="text-lg leading-8 text-slate-600">{offer.summary}</p>
        <ul className="space-y-3">{offer.bullets.map(bullet => <li key={bullet} className="flex gap-3 leading-7 text-slate-700"><Check className="mt-1 h-5 w-5 shrink-0 text-blue-600" />{bullet}</li>)}</ul>
        <Button id={schema ? "trainingplans-next" : undefined} variant="hero" size="lg" className="h-auto min-h-14 whitespace-normal px-6 text-center" asChild><Link to={requestHref}>{schema ? t("Koop nu je persoonlijke schema", "Buy your personal plan", "רכישת התוכנית האישית") : t("Informeer naar mogelijkheden", "Ask about availability", "בירור אפשרויות")}</Link></Button>
        {schema && <p className="text-sm leading-7 text-slate-600">{t("Vul je intake in. Willem maakt het schema op maat op basis van jouw afstand, niveau, doelen en beschikbare trainingsdagen en stuurt het daarna toe.", "Complete your intake. Willem creates your plan based on your distance, level, goals and available training days, then sends it to you.", "מלאו את שאלון הקליטה. וילם יכין תוכנית בהתאם למרחק, לרמה, למטרות ולימי האימון הזמינים וישלח אותה אליכם.")}</p>}
      </div>
      <img src={runningImage} alt={t("Willem tijdens het hardlopen", "Willem running", "וילם בזמן ריצה")} className="h-[26rem] w-full rounded-3xl object-cover object-center lg:h-full lg:max-h-[38rem]" />
    </section>
    {schema && <section id="trainingplans-table" className="mx-auto max-w-7xl px-5 pb-12 md:px-8"><Card><CardContent className="space-y-5 p-7 md:p-9"><h2 className="text-3xl font-black">{t("Een helder schema voor 12 weken", "A clear 12-week plan", "תוכנית ברורה ל־12 שבועות")}</h2><p className="max-w-3xl leading-8 text-slate-600">{t("Je ontvangt een duidelijke trainingsopbouw voor 12 weken, afgestemd op jouw afstand, niveau en doel. De inhoudelijke verdieping over techniek, kracht en core, mobiliteit, herstel, voeding en leefstijl valt buiten het schema van €19.", "You receive a clear 12-week training progression tailored to your distance, level and goal. In-depth guidance on technique, strength and core, mobility, recovery, nutrition and lifestyle is separate from the €19 plan.", "תקבלו מבנה אימונים ברור ל־12 שבועות, המותאם למרחק, לרמה ולמטרה שלכם. ליווי מעמיק בטכניקה, כוח, תנועתיות, התאוששות, תזונה ואורח חיים אינו כלול בתוכנית של €19.")}</p><p className="font-semibold text-blue-800">{t("Wil je hierover persoonlijke uitleg en advies? Boek een losse Zoom Check van 30 minuten voor €40.", "Want personal explanation and advice on these topics? Book a separate 30-minute Zoom Check for €40.", "רוצים הסבר וייעוץ אישי? הזמינו פגישת Zoom נפרדת של 30 דקות ב־€40.")}</p><Link className="inline-block font-semibold text-blue-700 underline" to={offerPath(locale, "zoom")}>{t("Bekijk de Zoom Check", "Explore the Zoom Check", "לפרטים על פגישת Zoom")}</Link></CardContent></Card></section>}
    {slug === "clinic" && <section className="mx-auto max-w-7xl space-y-7 px-5 pb-12 md:px-8"><h2 className="text-3xl font-black">{nl ? "Van theorie naar praktijk" : "From theory to practice"}</h2><p className="max-w-3xl leading-8 text-slate-600">{nl ? "Theorie en praktijk in een bosrijke omgeving, voor teams, bedrijven én individuele lopers. We besteden aandacht aan looptechniek en loopeconomie, trainingsleer, kracht en core, mobiliteit, herstel en blessurepreventie. Je krijgt persoonlijke aanwijzingen die je direct kunt toepassen. Minimaal 10 deelnemers." : "Theory and practice in a wooded setting for teams, businesses and individual runners. We cover technique and running economy, training principles, strength and core, mobility, recovery and injury prevention. You receive personal tips to use immediately. Minimum 10 participants."}</p><p className="rounded-2xl bg-blue-50 p-5 font-semibold text-blue-900">{nl ? "Normaal €130 per persoon, inclusief lunch. Heb je een TopFit Running-schema gekocht? Dan betaal je €120. Vermeld dit bij je aanvraag." : "Normally €130 per person, including lunch. Purchased a TopFit Running plan? Your price is €120. Mention this in your enquiry."}</p><h3 className="text-2xl font-black">{nl ? "Voorbeeldprogramma · 10.00–16.00 uur" : "Example programme · 10:00–16:00"}</h3><p className="text-slate-600">{nl ? "De inhoud en tijden kunnen in overleg worden afgestemd op de groep." : "Content and times can be adapted to your group by arrangement."}</p><dl className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white px-6">{schedule.map(([time, text]) => <div key={time} className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr]"><dt className="font-bold text-blue-700">{time}</dt><dd className="leading-7 text-slate-700">{text}</dd></div>)}</dl></section>}
    {slug === "lezing" && <section className="mx-auto max-w-7xl space-y-6 px-5 pb-12 md:px-8"><h2 className="text-3xl font-black">{nl ? "Een lezing die past bij jouw doelgroep" : "A talk tailored to your audience"}</h2><p className="text-lg leading-8 text-slate-600">{nl ? "90 minuten voor €500 per lezing. Kies een onderwerp, combineer thema’s of bespreek een ander onderwerp met Willem." : "90 minutes for €500 per talk. Choose a subject, combine themes or discuss another topic with Willem."}</p><div className="grid gap-5 md:grid-cols-2">{topics.map(([title, text]) => <Card key={title}><CardContent className="space-y-3 p-7"><h3 className="text-2xl font-bold">{title}</h3><p className="leading-7 text-slate-600">{text}</p></CardContent></Card>)}</div></section>}
  </>;
};
