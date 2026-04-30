import type { Locale } from "@/lib/i18n";

export type LocaleContent = {
  nav: Array<{ label: string; href: string }>;
  hero: { eyebrow: string; title: string; lead: string; primaryCta: string; secondaryCta: string };
  proof: { headline: string; description: string; stats: Array<{ value: string; label: string }> };
  offers: Array<{ title: string; price: string; summary: string; bullets: string[]; featured?: boolean }>;
  services: Array<{ title: string; summary: string; tag: string }>;
  shop: Array<{ slug: string; title: string; summary: string; price: string; type: string }>;
  blog: Array<{ slug: string; title: string; excerpt: string; category: string; readTime: string }>;
  about: { eyebrow: string; title: string; paragraphs: string[] };
  cta: { title: string; lead: string; button: string };
  pageHighlights: Record<string, { title: string; intro: string; bullets: string[] }>;
  faq: Array<{ q: string; a: string }>;
  footer: { title: string; lead: string };
};

const services = {
  nl: [
    { title: "Persoonlijke trainingsschema's", summary: "Volledig op maat, voor elk niveau en elk doel.", tag: "Core" },
    { title: "Persoonlijke coaching", summary: "Zoomgesprekken over training, herstel, focus en blessures.", tag: "Premium" },
    { title: "Clinics en trainingsdagen", summary: "Theorie, praktijk en begeleiding in een inspirerende setting.", tag: "Events" },
    { title: "Looptechniek analyse", summary: "Analyse, verbeterplan en gerichte corrigerende oefeningen.", tag: "Technique" },
  ],
  en: [
    { title: "Personal training plans", summary: "Fully tailored for every level and every goal.", tag: "Core" },
    { title: "Personal coaching", summary: "Zoom calls on training, recovery, focus and injuries.", tag: "Premium" },
    { title: "Clinics and training days", summary: "Theory, practice and coaching in an inspiring setting.", tag: "Events" },
    { title: "Running technique analysis", summary: "Analysis, improvement plan and targeted corrective drills.", tag: "Technique" },
  ],
  he: [
    { title: "תוכניות אימון אישיות", summary: "מותאמות לחלוטין, לכל רמה ולכל מטרה.", tag: "Core" },
    { title: "אימון אישי", summary: "שיחות זום על אימון, התאוששות, מיקוד ופציעות.", tag: "Premium" },
    { title: "קליניקות וימי אימון", summary: "תיאוריה, פרקטיקה וליווי בסביבה מעוררת השראה.", tag: "Events" },
    { title: "ניתוח טכניקת ריצה", summary: "ניתוח, תכנית שיפור ותרגילי תיקון ממוקדים.", tag: "Technique" },
  ],
} satisfies Record<Locale, LocaleContent["services"]>;

const pageHighlights = {
  nl: {
    abonnementen: {
      title: "Abonnementen",
      intro: "Twee duidelijke trajecten met schema, begeleiding en het Runningbook als vaste basis.",
      bullets: ["Premium voor maximale begeleiding", "Basis voor zelfstandig trainen met steun", "Altijd inclusief PDF Runningbook"],
    },
    subscriptions: {
      title: "Abonnementen",
      intro: "Twee duidelijke trajecten met schema, begeleiding en het Runningbook als vaste basis.",
      bullets: ["Premium voor maximale begeleiding", "Basis voor zelfstandig trainen met steun", "Altijd inclusief PDF Runningbook"],
    },
    shop: {
      title: "Shop",
      intro: "Digitale producten, services en fysieke sportvoeding naast de abonnementen.",
      bullets: ["Runningbook PDF", "Intake calls", "Sportrepen en recovery shakes"],
    },
    coaching: {
      title: "Persoonlijke coaching",
      intro: "Online gesprekken over training, herstel, belastbaarheid en vragen uit de praktijk.",
      bullets: ["1x per maand of 1x per 2 weken", "30 minuten per sessie", "Sterke extra waarde naast een abonnement"],
    },
    clinics: {
      title: "Clinics en trainingsdagen",
      intro: "Theorie en praktijk in een sfeervolle buitenomgeving.",
      bullets: ["10:00 - 16:00", "Koffie, thee en lunch", "Programma wordt vooraf gepubliceerd"],
    },
    blog: {
      title: "Blog",
      intro: "Autoriteit, SEO en verdieping rond training, voeding, techniek en herstel.",
      bullets: ["Trainingsleer", "Blessurepreventie", "Clinics en camps"],
    },
    "over-willem": {
      title: "Over Willem",
      intro: "Willem neerzetten als coach, docent en gids met 40+ jaar ervaring.",
      bullets: ["40+ jaar ervaring", "Internationaal perspectief", "Prestatie en plezier"],
    },
    contact: {
      title: "Contact",
      intro: "Intake, samenwerkingen en vragen lopen via één heldere contactroute.",
      bullets: ["E-mail", "Telefoon", "WhatsApp"],
    },
    "looptechniek-analyse": {
      title: "Looptechniek analyse",
      intro: "Analyse plus corrigerende oefeningen en een concreet verbeterplan.",
      bullets: ["Video of live analyse", "Persoonlijke tips", "Runningbook als naslagwerk"],
    },
    voeding: {
      title: "Voedingsschema op maat",
      intro: "Voeding voor herstel, energie en prestatie.",
      bullets: ["Persoonlijke planning", "Herstel en performance", "Aanvulling op het Runningbook"],
    },
    trainingskampen: {
      title: "Trainingskampen",
      intro: "Nederland, Ethiopië, Kenia en Europa als toekomstig groeipodium.",
      bullets: ["Voorbereiding met Runningbook", "Internationale ambitie", "Later uit te bouwen"],
    },
  },
  en: {
    subscriptions: {
      title: "Subscriptions",
      intro: "Two clear plans with structure, guidance and the Runningbook as the foundation.",
      bullets: ["Premium for maximum support", "Base for self-led runners who still want guidance", "Always includes the PDF Runningbook"],
    },
    shop: {
      title: "Shop",
      intro: "Digital products, services and physical sports nutrition next to the recurring services.",
      bullets: ["Runningbook PDF", "Intake calls", "Energy bars and recovery shakes"],
    },
    coaching: {
      title: "Personal coaching",
      intro: "Online conversations about training, recovery, load management and real-world questions.",
      bullets: ["Monthly or bi-weekly", "30 minutes per session", "High-value add-on for subscribers"],
    },
    clinics: {
      title: "Clinics and training days",
      intro: "Theory and practice in an inspiring natural setting.",
      bullets: ["10:00 - 16:00", "Coffee, tea and lunch", "Program published ahead of time"],
    },
    blog: {
      title: "Blog",
      intro: "Authority, SEO and depth around training, nutrition, technique and recovery.",
      bullets: ["Training principles", "Injury prevention", "Clinics and camps"],
    },
    "about-willem": {
      title: "About Willem",
      intro: "Position Willem as coach, teacher and guide with 40+ years of experience.",
      bullets: ["40+ years of experience", "International perspective", "Performance and pleasure"],
    },
    contact: {
      title: "Contact",
      intro: "Intake, partnerships and questions all flow through one clear contact route.",
      bullets: ["E-mail", "Phone", "WhatsApp"],
    },
  },
  he: {
    subscriptions: {
      title: "מנויים",
      intro: "שני מסלולים ברורים עם מבנה, ליווי ו-Runningbook כבסיס.",
      bullets: ["פרימיום לליווי מקסימלי", "בסיס לרצים עצמאיים שרוצים גם הכוונה", "תמיד כולל PDF של Runningbook"],
    },
    shop: {
      title: "חנות",
      intro: "מוצרים דיגיטליים, שירותים ותזונת ספורט פיזית לצד המנויים.",
      bullets: ["Runningbook PDF", "שיחות פתיחה", "חטיפי אנרגיה ושייקי התאוששות"],
    },
    coaching: {
      title: "אימון אישי",
      intro: "שיחות אונליין על אימון, התאוששות, עומסים ושאלות מהשטח.",
      bullets: ["פעם בחודש או פעם בשבועיים", "30 דקות לפגישה", "תוספת ערך חזקה למנויים"],
    },
    clinics: {
      title: "קליניקות וימי אימון",
      intro: "תיאוריה ופרקטיקה בסביבה טבעית ומעוררת השראה.",
      bullets: ["10:00 - 16:00", "קפה, תה וארוחת צהריים", "התוכנית מפורסמת מראש"],
    },
    blog: {
      title: "בלוג",
      intro: "סמכות, SEO ותוכן מעמיק על אימון, תזונה, טכניקה והתאוששות.",
      bullets: ["עקרונות אימון", "מניעת פציעות", "קליניקות וקאמפים"],
    },
    "about-willem": {
      title: "אודות וילם",
      intro: "למקם את וילם כמאמן, מורה ומלווה עם יותר מ-40 שנות ניסיון.",
      bullets: ["40+ שנות ניסיון", "מבט בינלאומי", "ביצועים ותענוג"],
    },
    contact: {
      title: "צור קשר",
      intro: "פניות, שיתופי פעולה ושאלות עוברים דרך ערוץ אחד ברור.",
      bullets: ["אימייל", "טלפון", "WhatsApp"],
    },
  },
} satisfies Record<Locale, LocaleContent["pageHighlights"]>;

export const topFitContent: Record<Locale, LocaleContent> = {
  nl: {
    nav: [
      { label: "Abonnementen", href: "/nl/abonnementen" },
      { label: "Coaching", href: "/nl/coaching" },
      { label: "Clinics", href: "/nl/clinics" },
      { label: "Shop", href: "/nl/shop" },
      { label: "Blog", href: "/nl/blog" },
      { label: "Over Willem", href: "/nl/over-willem" },
      { label: "Contact", href: "/nl/contact" },
    ],
    hero: {
      eyebrow: "TopFit Running",
      title: "Loop je vrij, presteer vanzelf",
      lead: "Abonnementen, coaching, clinics, shop en kennis in één premium platform voor lopers die verder willen dan een schema.",
      primaryCta: "Start je schema",
      secondaryCta: "Bekijk de shop",
    },
    proof: {
      headline: "Een compleet systeem, geen los trainingsschema",
      description: "TopFit Running combineert begeleiding, kennis en praktische tools. Meer structuur, meer vertrouwen en betere prestaties.",
      stats: [
        { value: "40+", label: "jaar ervaring" },
        { value: "6 mnd", label: "premium begeleiding" },
        { value: "PDF", label: "Runningbook inbegrepen" },
      ],
    },
    offers: [
      {
        title: "Premium pakket",
        price: "€99 / maand",
        summary: "Voor lopers die maximale begeleiding willen en geen detail willen missen.",
        bullets: ["Minimaal 6 maanden", "Maandelijks persoonlijk schema", "1x per maand online gesprek", "Runningbook PDF inbegrepen"],
        featured: true,
      },
      {
        title: "Basispakket",
        price: "€69 / maand",
        summary: "Voor lopers die zelfstandig trainen, maar wel richting en feedback willen.",
        bullets: ["Minimaal 3 maanden", "Maandelijks trainingsschema", "Eenmalig online gesprek", "Runningbook PDF inbegrepen"],
      },
      {
        title: "Clinic ticket",
        price: "€125 / persoon",
        summary: "Maandelijkse clinic met theorie, praktijk, begeleiding en lunch.",
        bullets: ["10:00 - 16:00", "Koffie, thee en lunch", "Persoonlijke tips & begeleiding", "Locatie vooraf gepubliceerd"],
      },
    ],
    services: services.nl,
    shop: [
      { slug: "runningbook-pdf", title: "TopFit Runningbook PDF", summary: "De kennisbasis voor elke abonnee en loper.", price: "Inbegrepen", type: "digital" },
      { slug: "intake-call", title: "Persoonlijke intake", summary: "Kennismaking en startanalyse voor een passend plan.", price: "Op aanvraag", type: "service" },
      { slug: "clinic-ticket", title: "Clinic ticket", summary: "Toegang tot de maandelijkse clinic dag.", price: "€125", type: "ticket" },
      { slug: "sportrepen-pack", title: "Sportrepen pack", summary: "Fysieke energie-snacks voor training, wedstrijd en onderweg.", price: "Vanaf €14,95", type: "physical" },
      { slug: "recovery-shake", title: "Recovery shake", summary: "Herstelproduct voor na intensieve trainingen of lange duurlopen.", price: "Vanaf €19,95", type: "physical" },
    ],
    blog: [
      { slug: "trainingsleer-in-de-praktijk", title: "Trainingsleer in de praktijk", excerpt: "Hoe je schema, herstel en progressie slim combineert.", category: "Training", readTime: "6 min" },
      { slug: "blessurevrij-opbouwen", title: "Blessurevrij opbouwen", excerpt: "De basisprincipes voor duurzame loopontwikkeling.", category: "Herstel", readTime: "5 min" },
      { slug: "waarom-looptechniek-loont", title: "Waarom looptechniek loont", excerpt: "Techniek levert direct winst op in efficiëntie en plezier.", category: "Techniek", readTime: "7 min" },
    ],
    about: {
      eyebrow: "Over Willem",
      title: "40+ jaar ervaring, coach en docent",
      paragraphs: [
        "Willem Luijckx combineert prestatie, plezier en bewustzijn in een nuchtere aanpak.",
        "Van schema's tot clinics en trainingskampen: de site moet die complete begeleiding helder verkopen.",
      ],
    },
    cta: {
      title: "Klaar voor een traject dat verder gaat dan een schema?",
      lead: "Start met een abonnement, boek een intake of kies direct een clinic of shopproduct.",
      button: "Plan je intake",
    },
    pageHighlights: pageHighlights.nl,
    faq: [
      { q: "Is het Runningbook inbegrepen?", a: "Ja, voor abonnees zit het Runningbook PDF standaard inbegrepen." },
      { q: "Kunnen de programma's later uitbreiden?", a: "Ja, de opzet is modulair en kan later met trainingskampen en extra upsells worden uitgebreid." },
      { q: "Komt er een webshop erbij?", a: "Ja, de shop krijgt eigen producten naast de terugkerende diensten." },
      { q: "Werken we meertalig?", a: "Ja, Nederlands, Engels en Hebreeuws krijgen dezelfde structuur." },
    ],
    footer: { title: "TopFit Running", lead: "Abonnementen, coaching, clinics, shop en blog in één merkplatform." },
  },
  en: {
    nav: [
      { label: "Subscriptions", href: "/en/subscriptions" },
      { label: "Coaching", href: "/en/coaching" },
      { label: "Clinics", href: "/en/clinics" },
      { label: "Shop", href: "/en/shop" },
      { label: "Blog", href: "/en/blog" },
      { label: "About Willem", href: "/en/about-willem" },
      { label: "Contact", href: "/en/contact" },
    ],
    hero: {
      eyebrow: "TopFit Running",
      title: "Run free, perform naturally",
      lead: "Subscriptions, coaching, clinics, shop and knowledge in one premium platform for runners who want more than a plan.",
      primaryCta: "Start your plan",
      secondaryCta: "Visit the shop",
    },
    proof: {
      headline: "A complete system, not just a training plan",
      description: "TopFit Running combines guidance, knowledge and practical tools. More structure, more confidence, better performance.",
      stats: [
        { value: "40+", label: "years of experience" },
        { value: "6 mo", label: "premium support" },
        { value: "PDF", label: "Runningbook included" },
      ],
    },
    offers: [
      {
        title: "Premium package",
        price: "€99 / month",
        summary: "For runners who want maximum guidance and no detail missed.",
        bullets: ["Minimum 6 months", "Monthly personal plan", "One online call per month", "Runningbook PDF included"],
        featured: true,
      },
      {
        title: "Base package",
        price: "€69 / month",
        summary: "For runners who train independently but still want direction and feedback.",
        bullets: ["Minimum 3 months", "Monthly training plan", "One online call", "Runningbook PDF included"],
      },
      {
        title: "Clinic ticket",
        price: "€125 / person",
        summary: "Monthly clinic with theory, practice, guidance and lunch.",
        bullets: ["10:00 - 16:00", "Coffee, tea and lunch", "Tips and personal guidance", "Location published in advance"],
      },
    ],
    services: services.en,
    shop: [
      { slug: "runningbook-pdf", title: "TopFit Runningbook PDF", summary: "The knowledge base for every subscriber and runner.", price: "Included", type: "digital" },
      { slug: "intake-call", title: "Personal intake", summary: "Kickoff call and assessment for the right plan.", price: "On request", type: "service" },
      { slug: "clinic-ticket", title: "Clinic ticket", summary: "Access to the monthly clinic day.", price: "€125", type: "ticket" },
      { slug: "energy-bars-pack", title: "Energy bars pack", summary: "Physical energy snacks for training, racing and on the go.", price: "From €14.95", type: "physical" },
      { slug: "recovery-shake", title: "Recovery shake", summary: "Recovery product for after intense sessions or long runs.", price: "From €19.95", type: "physical" },
    ],
    blog: [
      { slug: "training-principles-in-practice", title: "Training principles in practice", excerpt: "How to combine training, recovery and progression.", category: "Training", readTime: "6 min" },
      { slug: "building-without-injury", title: "Building without injury", excerpt: "The basics of sustainable running development.", category: "Recovery", readTime: "5 min" },
      { slug: "why-running-technique-pays-off", title: "Why running technique pays off", excerpt: "Technique improves efficiency and enjoyment fast.", category: "Technique", readTime: "7 min" },
    ],
    about: {
      eyebrow: "About Willem",
      title: "40+ years of coaching and teaching experience",
      paragraphs: [
        "Willem Luijckx brings performance, pleasure and awareness together in a direct coaching style.",
        "From plans to clinics and future training camps: the site should sell that complete system clearly.",
      ],
    },
    cta: {
      title: "Ready for a system that goes beyond a plan?",
      lead: "Start with a subscription, book an intake or go straight to a clinic or shop item.",
      button: "Book your intake",
    },
    pageHighlights: pageHighlights.en,
    faq: [
      { q: "Is the Runningbook included?", a: "Yes, subscribers receive the Runningbook PDF by default." },
      { q: "Can the offer expand later?", a: "Yes, the structure is modular and can expand with training camps and upsells." },
      { q: "Will there be a shop next to subscriptions?", a: "Yes, the shop gets separate products next to recurring services." },
      { q: "Will the site support multiple languages?", a: "Yes, Dutch, English and Hebrew share the same structure." },
    ],
    footer: { title: "TopFit Running", lead: "Subscriptions, coaching, clinics, shop and blog in one brand platform." },
  },
  he: {
    nav: [
      { label: "מנויים", href: "/he/subscriptions" },
      { label: "אימון", href: "/he/coaching" },
      { label: "קליניקות", href: "/he/clinics" },
      { label: "חנות", href: "/he/shop" },
      { label: "בלוג", href: "/he/blog" },
      { label: "אודות וילם", href: "/he/about-willem" },
      { label: "צור קשר", href: "/he/contact" },
    ],
    hero: {
      eyebrow: "TopFit Running",
      title: "רץ חופשי, בצע טבעי",
      lead: "מנויים, אימון, קליניקות, חנות וידע בפלטפורמת פרימיום אחת לרצים שרוצים יותר מתוכנית.",
      primaryCta: "התחל את התכנית",
      secondaryCta: "למדו בחנות",
    },
    proof: {
      headline: "מערכת מלאה, לא רק תוכנית אימון",
      description: "TopFit Running מחברת ליווי, ידע וכלים מעשיים. יותר מבנה, יותר ביטחון, יותר תוצאות.",
      stats: [
        { value: "40+", label: "שנות ניסיון" },
        { value: "6 ח'", label: "ליווי פרימיום" },
        { value: "PDF", label: "Runningbook כלול" },
      ],
    },
    offers: [
      {
        title: "חבילת פרימיום",
        price: "€99 / חודש",
        summary: "לרצים שרוצים ליווי מקסימלי וללא פשרות.",
        bullets: ["לפחות 6 חודשים", "תוכנית אישית חודשית", "שיחת אונליין חודשית", "Runningbook PDF כלול"],
        featured: true,
      },
      {
        title: "חבילת בסיס",
        price: "€69 / חודש",
        summary: "לרצים עצמאיים שרוצים גם כיוון ומשוב.",
        bullets: ["לפחות 3 חודשים", "תוכנית אימון חודשית", "שיחת אונליין אחת", "Runningbook PDF כלול"],
      },
      {
        title: "כרטיס לקליניקה",
        price: "€125 / אדם",
        summary: "קליניקה חודשית עם תיאוריה, פרקטיקה, ליווי וארוחת צהריים.",
        bullets: ["10:00 - 16:00", "קפה, תה וארוחת צהריים", "טיפים וליווי אישי", "המיקום מפורסם מראש"],
      },
    ],
    services: services.he,
    shop: [
      { slug: "runningbook-pdf", title: "TopFit Runningbook PDF", summary: "בסיס הידע לכל מנוי ורץ.", price: "כלול", type: "digital" },
      { slug: "intake-call", title: "שיחת פתיחה אישית", summary: "שיחת היכרות והערכה לתוכנית המתאימה.", price: "לפי בקשה", type: "service" },
      { slug: "clinic-ticket", title: "כרטיס לקליניקה", summary: "כניסה ליום הקליניקה החודשי.", price: "€125", type: "ticket" },
      { slug: "energy-bars-pack", title: "חבילת חטיפי אנרגיה", summary: "חטיפים פיזיים לאימון, תחרות ובדרך.", price: "החל מ-€14.95", type: "physical" },
      { slug: "recovery-shake", title: "שייק התאוששות", summary: "מוצר התאוששות לאחר אימונים קשים או ריצות ארוכות.", price: "החל מ-€19.95", type: "physical" },
    ],
    blog: [
      { slug: "training-principles-in-practice", title: "עקרונות אימון בפועל", excerpt: "איך משלבים אימון, התאוששות והתקדמות בצורה חכמה.", category: "אימון", readTime: "6 דק'" },
      { slug: "building-without-injury", title: "בונים בלי פציעות", excerpt: "הבסיס לפיתוח ריצה בר-קיימא.", category: "התאוששות", readTime: "5 דק'" },
      { slug: "why-running-technique-pays-off", title: "למה טכניקת ריצה משתלמת", excerpt: "טכניקה משפרת יעילות והנאה במהירות.", category: "טכניקה", readTime: "7 דק'" },
    ],
    about: {
      eyebrow: "אודות וילם",
      title: "יותר מ-40 שנות אימון והוראה",
      paragraphs: [
        "וילם לויכס מחבר ביצועים, הנאה ומודעות בגישה ישירה וברורה.",
        "מתכניות ועד קליניקות וקאמפים עתידיים: האתר צריך למכור את המערכת השלמה הזו בצורה ברורה.",
      ],
    },
    cta: {
      title: "מוכנים למערכת שעוברת את גבולות התוכנית?",
      lead: "התחילו עם מנוי, קבעו שיחת פתיחה או עברו ישר לקליניקה או למוצר בחנות.",
      button: "קבעו שיחה",
    },
    pageHighlights: pageHighlights.he,
    faq: [
      { q: "האם ה-Runningbook כלול?", a: "כן, מנויים מקבלים את Runningbook PDF כברירת מחדל." },
      { q: "אפשר להרחיב את ההיצע בהמשך?", a: "כן, המודל מודולרי ויכול להתרחב בהמשך עם קאמפים ואפסיילים נוספים." },
      { q: "תהיה חנות לצד המנויים?", a: "כן, יהיו מוצרים נפרדים לצד השירותים החוזרים." },
      { q: "האתר יתמוך בכמה שפות?", a: "כן, הולנדית, אנגלית ועברית חולקות את אותה מבנה." },
    ],
    footer: { title: "TopFit Running", lead: "מנויים, אימון, קליניקות, חנות ובלוג בפלטפורמת מותג אחת." },
  },
};

export const getLocaleContent = (locale: Locale) => topFitContent[locale];
