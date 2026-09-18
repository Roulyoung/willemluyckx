import { applyProposition } from "./proposition";
import type { Locale } from "@/lib/i18n";

export type LocaleContent = {
  menu: Array<{ label: string; href: string; children?: Array<{ label: string; href: string }> }>;
  nav: Array<{ label: string; href: string }>;
  hero: { eyebrow: string; title: string; lead: string; primaryCta: string; secondaryCta: string };
  proof: { headline: string; description: string; stats: Array<{ value: string; label: string }> };
  offers: Array<{ slug: string; title: string; price: string; summary: string; bullets: string[]; featured?: boolean }>;
  services: Array<{ title: string; summary: string; tag: string }>;
  shop: Array<{ slug: string; title: string; summary: string; price: string; type: string }>;
  blog: Array<{ slug: string; title: string; excerpt: string; category: string; readTime: string }>;
  hardloopwedstrijden: Array<{
    title: string;
    location: string;
    country: string;
    date: string;
    distance: string;
    elevation: string;
    surface: string;
    level: string;
    websiteUrl: string;
    registrationUrl: string;
    contactUrl: string;
    featured?: boolean;
  }>;
  about: { eyebrow: string; title: string; paragraphs: string[] };
  cta: { title: string; lead: string; button: string };
  pageHighlights: Record<string, { title: string; intro: string; bullets: string[] }>;
  faq: Array<{ q: string; a: string }>;
  footer: { title: string; lead: string };
};

const services = {
  nl: [
    { title: "Trainingsschema's", summary: "Je krijgt structuur die past bij jouw niveau, belastbaarheid en doel, zodat je gericht beter kunt trainen.", tag: "Core" },
    { title: "Looptechniek", summary: "Je verbetert houding, ritme en efficientie, zodat lopen lichter voelt en minder energie kost.", tag: "Technique" },
    { title: "Online coaching", summary: "Je bespreekt training, herstel en vragen direct met Willem, zodat je sneller kunt bijsturen.", tag: "Premium" },
    { title: "Clinics & kampen", summary: "Je oefent techniek en trainingsprincipes in de praktijk, zodat je beter begrijpt wat je doet.", tag: "Events" },
    { title: "Mukti Running", summary: "Je leert vrijer lopen met minder spanning, zodat prestatie en plezier beter samenkomen.", tag: "Philosophy" },
  ],
  en: [
    { title: "Training plans", summary: "You get structure that fits your level, recovery capacity and goal so your training keeps moving forward.", tag: "Core" },
    { title: "Running technique", summary: "You improve posture, rhythm and efficiency so running feels lighter and costs less energy.", tag: "Technique" },
    { title: "Online coaching", summary: "You discuss training, recovery and questions directly with Willem so you can adjust sooner.", tag: "Premium" },
    { title: "Clinics & camps", summary: "You practice technique and training principles in real sessions so you understand what you are doing.", tag: "Events" },
    { title: "Mukti Running", summary: "You learn to run with less tension and more freedom so performance and enjoyment work together.", tag: "Philosophy" },
  ],
  he: [
    { title: "Training plans", summary: "You get a personal plan for your level and goal.", tag: "Core" },
    { title: "Running technique", summary: "You get video analysis with clear improvement points and drills.", tag: "Technique" },
    { title: "Online coaching", summary: "You discuss training, recovery, nutrition and focus in a Zoom call.", tag: "Premium" },
    { title: "Clinics & camps", summary: "You train in a group day with nature, theory and practice.", tag: "Events" },
    { title: "Mukti Running", summary: "You experience running as freedom, energy and mental space.", tag: "Philosophy" },
  ],
} satisfies Record<Locale, LocaleContent["services"]>;

const offerMenu = {
  nl: [
    { label: "Abonnementen", href: "/nl/abonnementen" },
    { label: "Fysieke coaching", href: "/nl/fysieke-coaching" },
    { label: "Trainingsschema's", href: "/nl/trainingsschemas" },
    { label: "Looptechniek", href: "/nl/looptechniek" },
    { label: "Mukti Running", href: "/nl/mukti-running" },
    { label: "Clinics", href: "/nl/clinics" },
    { label: "Online Coaching", href: "/nl/online-coaching" },
  ],
  en: [
    { label: "Subscriptions", href: "/en/subscriptions" },
    { label: "Physical coaching", href: "/en/physical-coaching" },
    { label: "Training plans", href: "/en/training-plans" },
    { label: "Running technique", href: "/en/running-technique" },
    { label: "Mukti Running", href: "/en/mukti-running" },
    { label: "Clinics", href: "/en/clinics" },
    { label: "Online Coaching", href: "/en/online-coaching" },
  ],
  he: [
    { label: "Subscriptions", href: "/he/subscriptions" },
    { label: "Physical coaching", href: "/he/physical-coaching" },
    { label: "Training plans", href: "/he/training-plans" },
    { label: "Running technique", href: "/he/running-technique" },
    { label: "Mukti Running", href: "/he/mukti-running" },
    { label: "Clinics", href: "/he/clinics" },
    { label: "Online Coaching", href: "/he/online-coaching" },
  ],
} satisfies Record<Locale, Array<{ label: string; href: string }>>;

const pageHighlights = {
  nl: {
    home: {
      title: "Home",
      intro: "Voor lopers die met meer plezier, betere techniek en gerichte begeleiding van Willem duurzaam beter willen lopen.",
      bullets: ["Persoonlijke trainingsschema's", "Looptechniek analyse", "Online coaching", "Clinics en trainingskampen"],
    },
    abonnementen: {
      title: "Abonnementen",
      intro: "Twee duidelijke trajecten met schema, begeleiding en het Runningbook als vaste basis.",
      bullets: ["Premium voor maximale begeleiding", "Basis voor zelfstandig trainen met steun", "Altijd inclusief PDF Runningbook"],
    },
    hardloopkalender: {
      title: "Hardloopkalender",
      intro: "Vind sneller een hardloopwedstrijd die past bij je afstand, je agenda en je doel.",
      bullets: ["Vergelijk wedstrijden per afstand en periode", "Kies een doel dat past bij je training", "Gebruik de kalender als startpunt voor je voorbereiding"],
    },
    "fysieke-coaching": {
      title: "Fysieke coaching",
      intro: "Persoonlijke coaching op locatie in de gym of buiten, met ruimte om techniek echt te verfijnen.",
      bullets: ["Training op locatie in de omgeving Leiden", "Buiten lopen naast water en in een mooie omgeving", "Meer aandacht voor techniek, houding en ritme"],
    },
    trainingsschemas: {
      title: "Trainingsschema's",
      intro: "Je krijgt professionele schema's voor beginners, 5 km, 10 km, halve marathon, marathon en trailrunning.",
      bullets: ["Opbouw op maat", "Slimme belasting en herstel", "Schema op maat mogelijk"],
    },
    looptechniek: {
      title: "Looptechniek",
      intro: "Een efficiÃ«nte loophouding helpt je sneller, lichter en blessurevrijer te lopen.",
      bullets: ["Video analyse", "Persoonlijke oefeningen", "Duidelijke verbeterpunten"],
    },
    "mukti-running": {
      title: "Mukti Running",
      intro: "Hardlopen als innerlijke bevrijding: loskomen van spanning, druk en voortdurend moeten presteren.",
      bullets: ["Bevrijding van prestatiedruk", "Rust, ademhaling en aanwezigheid", "Lopen als tegenwicht voor stress"],
    },
    clinics: {
      title: "Clinics",
      intro: "B2B-clinics op locatie voor bedrijven, clubs en groepen die inhoud, energie en een professionele setting zoeken.",
      bullets: ["Maatwerk voor teams en events", "Theorie, praktijk en begeleiding", "Professionele uitvoering op locatie"],
    },
    trainingskampen: {
      title: "Trainingskampen",
      intro: "Meerdaagse hardloopervaringen met focus op beleving, opbouw en samen trainen in een inspirerende omgeving.",
      bullets: ["Meerdaags programma", "Herstel, techniek en pacing", "Samen trainen en opladen"],
    },
    "online-coaching": {
      title: "Online coaching",
      intro: "Persoonlijke Zoom-coaching voor training, motivatie, blessures, voeding en herstel.",
      bullets: ["1-op-1 begeleiding", "Maandelijkse consulten", "Evaluatie van je schema"],
    },
    blog: {
      title: "Blog / Kennisbank",
      intro: "Praktische artikelen over training, herstel, voeding, hartslagzones en marathonvoorbereiding.",
      bullets: ["Praktische trainingstips", "Trainingsleer", "Herstel en mindset"],
    },
    "over-willem": {
      title: "Over Willem Luijckx",
      intro: "Willem Luijckx is atletiektrainer, conditietrainer, opleider, docent en auteur met ruim 40 jaar ervaring in Nederland en Israel.",
      bullets: ["40+ jaar ervaring", "Nederland en Israel", "Traineropleidingen en trainingsleer", "Holistische prestatievisie"],
    },
    contact: {
      title: "Contact",
      intro: "Vragen, intake en samenwerkingen lopen via een helder contactpunt.",
      bullets: ["E-mail", "Contactformulier", "WhatsApp"],
    },
  },
  en: {
    home: {
      title: "Home",
      intro: "For runners who want to run better with more enjoyment, stronger technique and direct guidance from Willem.",
      bullets: ["Personal training plans", "Running technique analysis", "Online coaching", "Clinics and training camps"],
    },
    subscriptions: {
      title: "Subscriptions",
      intro: "Two clear plans with structure, guidance and the Runningbook as the foundation.",
      bullets: ["Premium for maximum support", "Base for self-led runners who still want guidance", "Always includes the PDF Runningbook"],
    },
    "running-calendar": {
      title: "Running calendar",
      intro: "Find a race that fits your distance, schedule and goal faster.",
      bullets: ["Compare races by distance and timing", "Choose a goal that fits your training", "Use the calendar as the start of your build-up"],
    },
    "physical-coaching": {
      title: "Physical coaching",
      intro: "Personal coaching on location in the gym or outside, with space to refine technique properly.",
      bullets: ["Training on location in the Leiden area", "Outdoor running near water and in a scenic setting", "More focus on technique, posture and rhythm"],
    },
    "training-plans": {
      title: "Training plans",
      intro: "You get professional plans for beginners, 5K, 10K, half marathon, marathon and trail running.",
      bullets: ["Tailored progression", "Smart load and recovery", "Custom plans available"],
    },
    "running-technique": {
      title: "Running technique",
      intro: "Efficient technique helps you run faster, lighter and with fewer injuries.",
      bullets: ["Video analysis", "Personal drills", "Clear improvement points"],
    },
    "mukti-running": {
      title: "Mukti Running",
      intro: "Running as inner liberation: letting go of tension, pressure and the need to constantly perform.",
      bullets: ["Freedom from performance pressure", "Calm, breathing and presence", "Running as an antidote to stress"],
    },
    clinics: {
      title: "Clinics",
      intro: "B2B clinics on location for companies, clubs and groups that want content, energy and a professional setup.",
      bullets: ["Theory and nutrition", "Strength and intervals", "Shared lunch and guidance"],
    },
    "training-camps": {
      title: "Training camps",
      intro: "Multi-day running experiences focused on atmosphere, build-up and training together in inspiring surroundings.",
      bullets: ["Multi-day program", "Pacing, recovery and technique", "Train and recharge together"],
    },
    "online-coaching": {
      title: "Online coaching",
      intro: "Personal Zoom coaching for training, motivation, injuries, nutrition and recovery.",
      bullets: ["1-on-1 guidance", "Monthly consults", "Plan review and feedback"],
    },
    blog: {
      title: "Blog / Knowledge base",
      intro: "Practical articles on training, recovery, nutrition, heart rate zones and marathon prep.",
      bullets: ["Practical training tips", "Training principles", "Recovery and mindset"],
    },
    "about-willem": {
      title: "About Willem Luijckx",
      intro: "Willem Luijckx is an athletics coach, conditioning coach, educator, teacher and author with more than 40 years of experience in the Netherlands and Israel.",
      bullets: ["40+ years of experience", "Netherlands and Israel", "Coach education and training theory", "Holistic performance vision"],
    },
    contact: {
      title: "Contact",
      intro: "Intake, partnerships and questions all flow through one clear contact route.",
      bullets: ["E-mail", "Contact form", "WhatsApp"],
    },
  },
  he: {
    home: {
      title: "Home",
      intro: "You will find clear, professional running guidance with a direct focus on plans, technique, coaching and inspiration.",
      bullets: ["Personal training plans", "Running technique analysis", "Online coaching", "Clinics and training camps"],
    },
    subscriptions: {
      title: "Subscriptions",
      intro: "Two clear plans with structure, guidance and the Runningbook as the foundation.",
      bullets: ["Premium for maximum support", "Base for self-led runners who still want guidance", "Always includes the PDF Runningbook"],
    },
    "running-calendar": {
      title: "Running calendar",
      intro: "Find a race that fits your distance, schedule and goal faster.",
      bullets: ["Compare races by distance and timing", "Choose a goal that fits your training", "Use the calendar as the start of your build-up"],
    },
    "training-plans": {
      title: "Training plans",
      intro: "You get professional plans for beginners, 5K, 10K, half marathon, marathon and trail running.",
      bullets: ["Tailored progression", "Smart load and recovery", "Custom plans available"],
    },
    "running-technique": {
      title: "Running technique",
      intro: "Efficient technique helps you run faster, lighter and with fewer injuries.",
      bullets: ["Video analysis", "Personal drills", "Clear improvement points"],
    },
    "mukti-running": {
      title: "Mukti Running",
      intro: "Running as inner liberation: letting go of tension, pressure and the need to constantly perform.",
      bullets: ["Freedom from performance pressure", "Calm, breathing and presence", "Running as an antidote to stress"],
    },
    clinics: {
      title: "Clinics",
      intro: "B2B clinics on location for companies, clubs and groups that want content, energy and a professional setup.",
      bullets: ["Theory and nutrition", "Strength and intervals", "Shared lunch and guidance"],
    },
    trainingskampen: {
      title: "Training camps",
      intro: "Multi-day running experiences focused on atmosphere, build-up and training together in inspiring surroundings.",
      bullets: ["Multi-day program", "Pacing, recovery and technique", "Train and recharge together"],
    },
    "online-coaching": {
      title: "Online coaching",
      intro: "Personal Zoom coaching for training, motivation, injuries, nutrition and recovery.",
      bullets: ["1-on-1 guidance", "Monthly consults", "Plan review and feedback"],
    },
    blog: {
      title: "Blog / Knowledge base",
      intro: "Practical articles on training, recovery, nutrition, heart rate zones and marathon prep.",
      bullets: ["Practical training tips", "Training principles", "Recovery and mindset"],
    },
    "about-willem": {
      title: "About Willem Luijckx",
      intro: "Willem Luijckx is an athletics coach, conditioning coach, educator, teacher and author with more than 40 years of experience in the Netherlands and Israel.",
      bullets: ["40+ years of experience", "Netherlands and Israel", "Coach education and training theory", "Holistic performance vision"],
    },
    contact: {
      title: "Contact",
      intro: "Intake, partnerships and questions all flow through one clear contact route.",
      bullets: ["E-mail", "Contact form", "WhatsApp"],
    },
  },
} satisfies Record<Locale, LocaleContent["pageHighlights"]>;

export const topFitContent: Record<Locale, LocaleContent> = {
  nl: {
    menu: [
      { label: "Over TopFit", href: "/nl/over-willem" },
      { label: "Aanbod", href: "/nl/abonnementen", children: offerMenu.nl },
      { label: "Blog / Kennisbank", href: "/nl/blog" },
    ],
    nav: [
      { label: "Over TopFit", href: "/nl/over-willem" },
      { label: "Trainingsschema's", href: "/nl/trainingsschemas" },
      { label: "Looptechniek", href: "/nl/looptechniek" },
      { label: "Mukti Running", href: "/nl/mukti-running" },
      { label: "Clinics", href: "/nl/clinics" },
      { label: "Online Coaching", href: "/nl/online-coaching" },
      { label: "Blog / Kennisbank", href: "/nl/blog" },
    ],
    hero: {
      eyebrow: "TopFit Running",
      title: "Loop je vrij, presteer met plezier",
      lead: "Voor lopers die met meer plezier, betere techniek en gerichte begeleiding van Willem duurzaam beter willen lopen.",
      primaryCta: "Ren beter",
      secondaryCta: "Bekijk abonnementen",
    },
    proof: {
      headline: "Wat je van TopFit Running merkt",
      description: "Rustige, professionele begeleiding met aandacht voor schema, techniek, herstel, plezier en mentale balans.",
      stats: [
        { value: "40+", label: "jaar ervaring" },
        { value: "1-op-1", label: "persoonlijke begeleiding" },
        { value: "Mukti", label: "vrijheid in beweging" },
      ],
    },
    offers: [],
    services: services.nl,
    shop: [],
    blog: [
      { slug: "voeding-voor-langeafstandslopers", title: "Voeding voor langeafstandslopers: herstel, gezondheid en duurzame prestaties", excerpt: "Waarom onbewerkte voeding, maaltijdvolgorde en rustig eten directe invloed hebben op herstel en prestaties.", category: "Voeding", readTime: "9 min" },
      { slug: "mukti-running-wat-het-is-en-waarom-het-bij-topfit-past", title: "Mukti Running: hardlopen met vrijheid, rust en minder druk", excerpt: "Waarom vrijheid, rust en bewuste inspanning centraal staan in deze kijk op lopen.", category: "Mukti", readTime: "6 min" },
      { slug: "trainingsleer-in-de-praktijk", title: "Trainingsleer voor langeafstandslopen: principes voor effectieve duurtraining", excerpt: "Hoe supercompensatie, opbouw en herstel samen zorgen voor duurzame progressie.", category: "Training", readTime: "8 min" },
      { slug: "blessurevrij-opbouwen", title: "Blessurevrij hardlopen: een holistische benadering voor een leven lang hardloopplezier", excerpt: "Tien praktische regels om belasting, herstel en belastbaarheid beter in balans te houden.", category: "Herstel", readTime: "8 min" },
      { slug: "waarom-looptechniek-loont", title: "Looptechniek voor langeafstandslopers: verbeter je prestaties en vermijd blessures", excerpt: "Waarom houding, cadans en stabiliteit direct invloed hebben op efficientie en belastbaarheid.", category: "Techniek", readTime: "9 min" },
    ],
    hardloopwedstrijden: [],
    about: {
      eyebrow: "Over Willem Luijckx",
      title: "Coach, opleider en docent met 40+ jaar ervaring",
      paragraphs: [
        "Willem Luijckx is atletiektrainer, conditietrainer, opleider, docent en auteur met ruim 40 jaar ervaring in Nederland en Israel.",
        "Zijn aanpak verbindt langeafstandslopen, trainingsleer, looptechniek, conditietraining, herstel en mentale balans in een holistische methode voor duurzame prestaties.",
      ],
    },
    cta: {
      title: "Begin nu met je intake",
      lead: "Vertel Willem waar je nu staat, waar je naartoe wilt en wat jouw lichaam aankan, zodat je gericht kunt starten met begeleiding die bij je past.",
      button: "Begin nu met je intake",
    },
    pageHighlights: pageHighlights.nl,
    faq: [],
    footer: { title: "TopFit Running", lead: "Hardlopen met vrijheid, plezier en kwaliteit." },
  },
  en: {
    menu: [
      { label: "About TopFit", href: "/en/about-willem" },
      { label: "Offerings", href: "/en/subscriptions", children: offerMenu.en },
      { label: "Blog / Knowledge Base", href: "/en/blog" },
    ],
    nav: [
      { label: "About TopFit", href: "/en/about-willem" },
      { label: "Training Plans", href: "/en/training-plans" },
      { label: "Running Technique", href: "/en/running-technique" },
      { label: "Mukti Running", href: "/en/mukti-running" },
      { label: "Clinics", href: "/en/clinics" },
      { label: "Online Coaching", href: "/en/online-coaching" },
      { label: "Blog / Knowledge Base", href: "/en/blog" },
    ],
    hero: {
      eyebrow: "TopFit Running",
      title: "Run free, perform with pleasure.",
      lead: "For runners who want to run better with more enjoyment, stronger technique and direct guidance from Willem.",
      primaryCta: "Run better",
      secondaryCta: "View subscriptions",
    },
    proof: {
      headline: "What you notice from TopFit Running",
      description: "Calm, professional guidance with attention to plans, technique, recovery, enjoyment and mental balance.",
      stats: [
        { value: "40+", label: "years of experience" },
        { value: "1-on-1", label: "personal guidance" },
        { value: "Mukti", label: "freedom in motion" },
      ],
    },
    offers: [],
    services: services.en,
    shop: [],
    blog: [
      { slug: "mukti-running-what-it-is-and-why-it-fits-topfit", title: "Mukti Running: what it is and why it fits TopFit", excerpt: "Why freedom, calm and conscious effort sit at the center of this running philosophy.", category: "Mukti", readTime: "6 min" },
      { slug: "training-principles-in-practice", title: "Training principles in practice", excerpt: "How to combine training, recovery and progression.", category: "Training", readTime: "6 min" },
      { slug: "building-without-injury", title: "Building without injury", excerpt: "The basics of sustainable running development.", category: "Recovery", readTime: "5 min" },
      { slug: "why-running-technique-pays-off", title: "Why running technique pays off", excerpt: "Technique improves efficiency and enjoyment fast.", category: "Technique", readTime: "7 min" },
    ],
    hardloopwedstrijden: [],
    about: {
      eyebrow: "About Willem Luijckx",
      title: "Coach, educator and teacher with 40+ years of experience",
      paragraphs: [
        "Willem Luijckx is an athletics coach, conditioning coach, educator, teacher and author with more than 40 years of experience in the Netherlands and Israel.",
        "His method connects distance running, training theory, running technique, conditioning, recovery and mental balance in one holistic approach to sustainable performance.",
      ],
    },
    cta: {
      title: "Start your intake now",
      lead: "Tell Willem where you are now, where you want to go and what your body can handle so your guidance starts from the right place.",
      button: "Start your intake now",
    },
    pageHighlights: pageHighlights.en,
    faq: [],
    footer: { title: "TopFit Running", lead: "Run with freedom, pleasure and quality." },
  },
  he: {
    menu: [
      { label: "About TopFit", href: "/he/about-willem" },
      { label: "Offerings", href: "/he/subscriptions", children: offerMenu.he },
      { label: "Blog / Knowledge Base", href: "/he/blog" },
    ],
    nav: [
      { label: "About TopFit", href: "/he/about-willem" },
      { label: "Training Plans", href: "/he/training-plans" },
      { label: "Running Technique", href: "/he/running-technique" },
      { label: "Mukti Running", href: "/he/mukti-running" },
      { label: "Clinics", href: "/he/clinics" },
      { label: "Online Coaching", href: "/he/online-coaching" },
      { label: "Blog / Knowledge Base", href: "/he/blog" },
    ],
    hero: {
      eyebrow: "TopFit Running",
      title: "Run free, perform with pleasure.",
      lead: "For runners who want to run better with more enjoyment, stronger technique and direct guidance from Willem.",
      primaryCta: "Run better",
      secondaryCta: "View subscriptions",
    },
    proof: {
      headline: "What you notice from TopFit Running",
      description: "Calm, professional guidance with attention to plans, technique, recovery, enjoyment and mental balance.",
      stats: [
        { value: "40+", label: "years of experience" },
        { value: "1-on-1", label: "personal guidance" },
        { value: "Mukti", label: "freedom in motion" },
      ],
    },
    offers: [],
    services: services.he,
    shop: [],
    blog: [
      { slug: "mukti-running-what-it-is-and-why-it-fits-topfit", title: "Mukti Running: what it is and why it fits TopFit", excerpt: "Why freedom, calm and conscious effort sit at the center of this running philosophy.", category: "Mukti", readTime: "6 min" },
      { slug: "training-principles-in-practice", title: "Training principles in practice", excerpt: "How to combine training, recovery and progression.", category: "Training", readTime: "6 min" },
      { slug: "building-without-injury", title: "Building without injury", excerpt: "The basics of sustainable running development.", category: "Recovery", readTime: "5 min" },
      { slug: "why-running-technique-pays-off", title: "Why running technique pays off", excerpt: "Technique improves efficiency and enjoyment fast.", category: "Technique", readTime: "7 min" },
    ],
    hardloopwedstrijden: [],
    about: {
      eyebrow: "About Willem Luijckx",
      title: "Coach, educator and teacher with 40+ years of experience",
      paragraphs: [
        "Willem Luijckx is an athletics coach, conditioning coach, educator, teacher and author with more than 40 years of experience in the Netherlands and Israel.",
        "His method connects distance running, training theory, running technique, conditioning, recovery and mental balance in one holistic approach to sustainable performance.",
      ],
    },
    cta: {
      title: "Start your intake now",
      lead: "Tell Willem where you are now, where you want to go and what your body can handle so your guidance starts from the right place.",
      button: "Start your intake now",
    },
    pageHighlights: pageHighlights.he,
    faq: [],
    footer: { title: "TopFit Running", lead: "Run with freedom, pleasure and quality." },
  },
};

for (const locale of ["nl", "en", "he"] as const) {
  topFitContent[locale] = applyProposition(topFitContent[locale], locale);
}

export const getLocaleContent = (locale: Locale) => topFitContent[locale];

