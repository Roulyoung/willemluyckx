import type { Locale } from "./i18n";
import type { LocaleContent } from "./topfitContent";

export const offerPath = (locale: Locale, slug?: string) => `/${locale}/${locale === "nl" ? "aanbod" : "offers"}${slug ? `/${slug}` : ""}`;

export const propositionOffers = (locale: Locale): LocaleContent["offers"] => locale === "nl" ? [
  { slug: "schema", title: "12 weken TopFit Running", price: "€19 / 12 weken", summary: "Willem maakt jouw hardloopschema op maat en stuurt het persoonlijk toe. Een betaalbare kennismaking met de visie van TopFit Running.", bullets: ["Afgestemd op jouw afstand, niveau en doel", "Duidelijke trainingsopbouw voor 12 weken", "Persoonlijk samengesteld door Willem en toegestuurd na je intake", "Inclusief het TopFit Running Boek als pdf"], featured: true },
  { slug: "zoom", title: "Persoonlijke Zoom Check", price: "€40 / 30 minuten", summary: "Twijfel je over je tempo’s, trainingsopbouw, techniek of herstel? Bespreek jouw vragen met Willem en krijg gericht, praktisch advies.", bullets: ["30 minuten één-op-één via Zoom", "Jouw vragen staan centraal", "Een losse afspraak wanneer jij advies nodig hebt"] },
  { slug: "fysiek", title: "Persoonlijke fysieke training", price: "€80 / uur", summary: "Werk één-op-één aan jouw looptechniek, houding, mobiliteit, kracht, coördinatie en trainingsaanpak.", bullets: ["Afgestemd op jouw niveau, doelen en aandachtspunten", "Directe feedback in de praktijk", "Oefeningen waarmee je zelfstandig verder kunt"] },
  { slug: "clinic", title: "TopFit Running Clinic", price: "€130 / persoon", summary: "Van theorie naar praktijk: ervaar hoe je efficiënter, soepeler en gezonder kunt hardlopen. Inclusief lunch.", bullets: ["10.00–16.00 uur; maatwerk in overleg", "Ook voor individuele lopers; minimaal 10 deelnemers", "€120 als je een TopFit Running-schema hebt gekocht"] },
  { slug: "lezing", title: "Lezingen", price: "€500 / 90 minuten", summary: "Inspirerende, praktijkgerichte lezingen voor atletiekclubs, loopgroepen, trainers, organisaties en bedrijven.", bullets: ["Mukti Running, trainingsleer, voeding of blessurepreventie", "Afgestemd op de doelgroep", "Andere onderwerpen of een combinatie in overleg"] },
] : locale === "he" ? [
  { slug: "schema", title: "12 שבועות של TopFit Running", price: "€19 / 12 שבועות", summary: "וילם מכין עבורכם תוכנית ריצה אישית ושולח אותה ישירות. היכרות נגישה עם הגישה של TopFit Running.", bullets: ["מותאם למרחק, לרמה ולמטרה שלכם", "מבנה אימונים ברור ל־12 שבועות", "נבנה אישית על ידי וילם ונשלח לאחר מילוי השאלון", "כולל את ספר TopFit Running כקובץ PDF"], featured: true },
  { slug: "zoom", title: "פגישת Zoom אישית", price: "€40 / 30 דקות", summary: "יש לכם שאלות על קצב, בניית האימון, טכניקה או התאוששות? שוחחו עם וילם וקבלו עצה מעשית וממוקדת.", bullets: ["30 דקות אישיות ב־Zoom", "התמקדות בשאלות שלכם", "פגישה נפרדת כשאתם זקוקים לייעוץ"] },
  { slug: "fysiek", title: "אימון אישי פנים אל פנים", price: "€80 / שעה", summary: "עבדו באופן אישי על טכניקת הריצה, היציבה, התנועתיות, הכוח, הקואורדינציה ושיטת האימון.", bullets: ["מותאם לרמה, למטרות ולצרכים שלכם", "משוב מעשי ומיידי", "תרגילים להמשך עבודה עצמאית"] },
  { slug: "clinic", title: "סדנת TopFit Running", price: "€130 / משתתף", summary: "מהתיאוריה למעשה: למדו לרוץ ביעילות, בנינוחות ובבריאות. ארוחת צהריים כלולה.", bullets: ["10:00–16:00; שעות מותאמות בתיאום", "פתוח גם לרצים יחידים; מינימום 10 משתתפים", "€120 למי שרכש תוכנית TopFit Running"] },
  { slug: "lezing", title: "הרצאות", price: "€500 / 90 דקות", summary: "הרצאות מעוררות השראה ומעשיות למועדוני אתלטיקה, קבוצות ריצה, מאמנים, ארגונים וחברות.", bullets: ["Mukti Running, עקרונות אימון, תזונה או מניעת פציעות", "מותאם לקהל", "נושאים אחרים או שילוב נושאים בתיאום"] },
] : [
  { slug: "schema", title: "12 weeks of TopFit Running", price: "€19 / 12 weeks", summary: "Willem creates your running plan personally and sends it to you. An affordable introduction to the TopFit Running approach.", bullets: ["Tailored to your distance, level and goal", "A clear training progression for 12 weeks", "Personally created by Willem and sent after your intake", "Includes the TopFit Running Book as a PDF"], featured: true },
  { slug: "zoom", title: "Personal Zoom Check", price: "€40 / 30 minutes", summary: "Questions about your pace, training progression, technique or recovery? Discuss them with Willem and get focused, practical advice.", bullets: ["30 minutes one-to-one on Zoom", "Focused on your questions", "Book an individual session when you need advice"] },
  { slug: "fysiek", title: "Personal in-person training", price: "€80 / hour", summary: "Work one-to-one on running technique, posture, mobility, strength, coordination and your approach to training.", bullets: ["Tailored to your level, goals and needs", "Direct practical feedback", "Exercises to continue independently"] },
  { slug: "clinic", title: "TopFit Running Clinic", price: "€130 / person", summary: "From theory to practice: experience more efficient, relaxed and healthy running. Lunch included.", bullets: ["10:00–16:00; tailored times by arrangement", "Open to individual runners; minimum 10 participants", "€120 if you have purchased a TopFit Running plan"] },
  { slug: "lezing", title: "Talks", price: "€500 / 90 minutes", summary: "Inspiring, practical talks for athletics clubs, running groups, coaches, organisations and businesses.", bullets: ["Mukti Running, training principles, nutrition or injury prevention", "Tailored to the audience", "Other subjects or combined themes by arrangement"] },
];

// Commercial copy is versioned with the site. The existing Sheet still owns
// calendar, blog and other editorial data, but cannot restore retired packages.
export const applyProposition = (content: LocaleContent, locale: Locale): LocaleContent => {
  const nl = locale === "nl";
  const he = locale === "he";
  const t = (nlText: string, enText: string, heText: string) => he ? heText : nl ? nlText : enText;
  const offers = propositionOffers(locale);
  const links = [
    ...offers.map(offer => ({ label: offer.title, href: offerPath(locale, offer.slug) })),
    { label: t("Looptechniek", "Running technique", "טכניקת ריצה"), href: `/${locale}/${nl ? "looptechniek" : "running-technique"}` },
    { label: "Mukti Running", href: `/${locale}/mukti-running` },
  ];
  const overview = { title: t("Aanbod", "Offers", "הצעות"), intro: t("Een persoonlijk schema van €19 als start. Verdiep je training met persoonlijke begeleiding, clinics en lezingen.", "Start with a €19 personal plan. Develop your running with personal guidance, clinics and talks.", "התחילו בתוכנית אישית ב־€19. התקדמו בעזרת ליווי אישי, סדנאות והרצאות."), bullets: offers.map(offer => `${offer.title} — ${offer.price}`) };
  const highlights = { ...content.pageHighlights, home: { ...content.pageHighlights.home, intro: t("Gezond, efficiënt en met plezier hardlopen. Niet méér trainen, maar beter trainen.", "Run healthily, efficiently and with enjoyment. Train better, not just more.", "לרוץ בבריאות, ביעילות ובהנאה. להתאמן טוב יותר, לא רק יותר.") } };
  for (const key of ["aanbod", "offers", "abonnementen", "subscriptions", "shop"]) highlights[key] = overview;
  const keys = [["trainingsschemas", "training-plans"], ["online-coaching", "coaching"], ["fysieke-coaching", "physical-coaching"], ["clinics"], ["lezingen", "talks"]];
  offers.forEach((offer, index) => keys[index].forEach(key => { highlights[key] = { title: offer.title, intro: offer.summary, bullets: offer.bullets }; }));
  return {
    ...content,
    offers,
    pageHighlights: highlights,
    about: {
      ...content.about,
      paragraphs: nl
        ? [
            "Willem Luijckx is atletiektrainer, conditietrainer, opleider, docent en auteur met ruim 40 jaar ervaring in Nederland en Israël.",
            "Hij was jarenlang hoofdtrainer van de midden- en langeafstandselectie van Israël en was in Nederland tien jaar trainer voor de midden- en lange afstand bij A.V. Castricum en DEM.",
            "Zijn methode verbindt langeafstandslopen, trainingsleer, looptechniek, conditie, herstel en mentale balans in één holistische benadering van duurzame prestaties.",
          ]
        : he ? [
            "וילם לויצקס הוא מאמן אתלטיקה וכושר, מרצה, מורה וסופר, בעל יותר מ־40 שנות ניסיון בהולנד ובישראל.",
            "במשך שנים רבות שימש כמאמן הראשי של נבחרת ישראל בריצות בינוניות וארוכות, ובהולנד אימן במשך עשר שנים רצים למרחקים בינוניים וארוכים במועדוני A.V. Castricum ו־DEM.",
            "השיטה שלו משלבת ריצה למרחקים, תורת האימון, טכניקת ריצה, כושר, התאוששות ואיזון נפשי בגישה הוליסטית לביצועים בני קיימא.",
          ] : [
            "Willem Luijckx is an athletics coach, conditioning coach, educator, teacher and author with more than 40 years of experience in the Netherlands and Israel.",
            "He spent many years as head coach of Israel’s middle- and long-distance selection and, in the Netherlands, coached middle- and long-distance runners at A.V. Castricum and DEM for ten years.",
            "His method connects distance running, training theory, running technique, conditioning, recovery and mental balance in one holistic approach to sustainable performance.",
          ],
    },
    menu: [
      { label: t("Over TopFit", "About TopFit", "אודות TopFit"), href: `/${locale}/${nl ? "over-willem" : "about-willem"}` },
      { label: overview.title, href: offerPath(locale), children: links },
      { label: t("Blog / Kennisbank", "Blog / Knowledge", "בלוג / מרכז ידע"), href: `/${locale}/blog` },
      { label: t("Hardloopkalender", "Race calendar", "לוח מרוצים"), href: `/${locale}/${nl ? "hardloopkalender" : "running-calendar"}` },
    ],
    nav: links,
    hero: { eyebrow: "TopFit Running", title: t("Gezond, efficiënt en met plezier hardlopen", "Healthy, efficient and enjoyable running", "ריצה בריאה, יעילה ומהנה"), lead: t("Een hardloopschema kun je tegenwoordig overal vinden. Goede persoonlijke begeleiding niet. Begin met een schema op maat van €19 en ontdek wat beter trainen voor jou betekent.", "Running plans are easy to find. Good personal guidance is not. Start with a €19 tailored plan and discover what better training means for you.", "כיום קל למצוא תוכנית ריצה. ליווי אישי טוב קשה יותר למצוא. התחילו בתוכנית מותאמת ב־€19 וגלו מה פירוש להתאמן טוב יותר עבורכם."), primaryCta: t("Jouw schema voor €19", "Your plan for €19", "התוכנית שלכם ב־€19"), secondaryCta: t("Ontdek de begeleiding", "Explore personal guidance", "גלו את הליווי האישי") },
    services: offers.slice(1).map(offer => ({ title: offer.title, summary: offer.summary, tag: offer.price })),
    shop: [],
    cta: { title: t("Niet méér trainen, maar beter trainen", "Train better, not just more", "להתאמן טוב יותר, לא רק יותר"), lead: t("Begin met een persoonlijk schema voor 12 weken. Willem stemt het af op jouw doel en niveau en stuurt het daarna toe.", "Start with a personal 12-week plan. Willem tailors it to your goal and level and sends it to you.", "התחילו בתוכנית אישית ל־12 שבועות. וילם יתאים אותה למטרה ולרמה שלכם וישלח אותה אליכם."), button: t("Bekijk het schema van €19", "Explore the €19 plan", "לתוכנית ב־€19") },
    faq: [
      { q: t("Is dit een abonnement?", "Is this a subscription?", "האם זה מנוי?"), a: t("Nee. Je betaalt eenmalig €19 voor een persoonlijk schema voor 12 weken. Begeleiding boek je los wanneer je die nodig hebt.", "No. A personal 12-week plan costs a one-off €19. Book guidance separately when you need it.", "לא. משלמים €19 פעם אחת עבור תוכנית אישית ל־12 שבועות. אפשר להזמין ליווי בנפרד בעת הצורך.") },
      { q: t("Hoe ontvang ik mijn schema?", "How do I receive my plan?", "איך מקבלים את התוכנית?"), a: t("Vul je intake in met je doel, afstand, niveau en trainingsmogelijkheden. Willem maakt het schema op maat en stuurt het daarna toe.", "Complete your intake with your goal, distance, level and training availability. Willem creates your plan personally and sends it to you.", "ממלאים את שאלון הקליטה עם המטרה, המרחק, הרמה ואפשרויות האימון. וילם מכין תוכנית מותאמת ושולח אותה אליכם.") },
      { q: t("Kan ik individueel meedoen aan een clinic?", "Can I join a clinic as an individual?", "האם אפשר להשתתף בסדנה באופן יחידני?"), a: t("Ja. Een clinic gaat door met minimaal 10 deelnemers. Lunch is inbegrepen. Met een eerder gekocht TopFit Running-schema betaal je €120 in plaats van €130.", "Yes. Clinics run with at least 10 participants and include lunch. If you have purchased a TopFit Running plan, the price is €120 instead of €130.", "כן. הסדנה מתקיימת עם לפחות 10 משתתפים וכוללת ארוחת צהריים. מי שכבר רכש תוכנית TopFit Running משלם €120 במקום €130.") },
    ],
    footer: { title: "TopFit Running", lead: t("Gezond, efficiënt en met plezier hardlopen. Persoonlijke schema’s, begeleiding, clinics en lezingen.", "Healthy, efficient and enjoyable running. Personal plans, guidance, clinics and talks.", "ריצה בריאה, יעילה ומהנה. תוכניות אישיות, ליווי, סדנאות והרצאות.") },
  };
};
