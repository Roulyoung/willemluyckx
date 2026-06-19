import type { Locale } from "@/lib/i18n";

export type LocaleContent = {
  menu: Array<{ label: string; href: string; children?: Array<{ label: string; href: string }> }>;
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
    { title: "Trainingsschema's", summary: "Je krijgt een persoonlijk schema voor jouw niveau en doel.", tag: "Core" },
    { title: "Looptechniek", summary: "Je krijgt videoanalyse met duidelijke verbeterpunten en oefeningen.", tag: "Technique" },
    { title: "Online coaching", summary: "Je bespreekt training, herstel, voeding en focus in een Zoomgesprek.", tag: "Premium" },
    { title: "Clinics & kampen", summary: "Je traint in groep tijdens dagen met natuur, theorie en praktijk.", tag: "Events" },
    { title: "Mukti Running", summary: "Je ervaart lopen als vrijheid, energie en mentale ruimte.", tag: "Philosophy" },
  ],
  en: [
    { title: "Training plans", summary: "You get a personal plan for your level and goal.", tag: "Core" },
    { title: "Running technique", summary: "You get video analysis with clear improvement points and drills.", tag: "Technique" },
    { title: "Online coaching", summary: "You discuss training, recovery, nutrition and focus in a Zoom call.", tag: "Premium" },
    { title: "Clinics & camps", summary: "You train in a group day with nature, theory and practice.", tag: "Events" },
    { title: "Mukti Running", summary: "You experience running as freedom, energy and mental space.", tag: "Philosophy" },
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
    { label: "Trainingsschema's", href: "/nl/trainingsschemas" },
    { label: "Looptechniek", href: "/nl/looptechniek" },
    { label: "Mukti Running", href: "/nl/mukti-running" },
    { label: "Clinics & Trainingskampen", href: "/nl/clinics-en-trainingskampen" },
    { label: "Online Coaching", href: "/nl/online-coaching" },
  ],
  en: [
    { label: "Subscriptions", href: "/en/subscriptions" },
    { label: "Training plans", href: "/en/training-plans" },
    { label: "Running technique", href: "/en/running-technique" },
    { label: "Mukti Running", href: "/en/mukti-running" },
    { label: "Clinics & Training Camps", href: "/en/clinics-and-training-camps" },
    { label: "Online Coaching", href: "/en/online-coaching" },
  ],
  he: [
    { label: "Subscriptions", href: "/he/subscriptions" },
    { label: "Training plans", href: "/he/training-plans" },
    { label: "Running technique", href: "/he/running-technique" },
    { label: "Mukti Running", href: "/he/mukti-running" },
    { label: "Clinics & Training Camps", href: "/he/clinics-and-training-camps" },
    { label: "Online Coaching", href: "/he/online-coaching" },
  ],
} satisfies Record<Locale, Array<{ label: string; href: string }>>;

const pageHighlights = {
  nl: {
    home: {
      title: "Home",
      intro: "Je vindt hier rustige, professionele hardloopbegeleiding met duidelijke keuzes voor schema, techniek, coaching en inspiratie.",
      bullets: ["Persoonlijke trainingsschema's", "Looptechniek analyse", "Online coaching", "Clinics en trainingskampen"],
    },
    abonnementen: {
      title: "Abonnementen",
      intro: "Twee duidelijke trajecten met schema, begeleiding en het Runningbook als vaste basis.",
      bullets: ["Premium voor maximale begeleiding", "Basis voor zelfstandig trainen met steun", "Altijd inclusief PDF Runningbook"],
    },
    trainingsschemas: {
      title: "Trainingsschema's",
      intro: "Je krijgt professionele schema's voor beginners, 5 km, 10 km, halve marathon, marathon en trailrunning.",
      bullets: ["Opbouw op maat", "Slimme belasting en herstel", "Schema op maat mogelijk"],
    },
    looptechniek: {
      title: "Looptechniek",
      intro: "Een efficiënte loophouding helpt je sneller, lichter en blessurevrijer te lopen.",
      bullets: ["Video analyse", "Persoonlijke oefeningen", "Duidelijke verbeterpunten"],
    },
    "mukti-running": {
      title: "Mukti Running",
      intro: "Hardlopen als innerlijke bevrijding: loskomen van spanning, druk en voortdurend moeten presteren.",
      bullets: ["Bevrijding van prestatiedruk", "Rust, ademhaling en aanwezigheid", "Lopen als tegenwicht voor stress"],
    },
    "clinics-en-trainingskampen": {
      title: "Clinics & trainingskampen",
      intro: "Groepsactiviteiten in inspirerende omgevingen zoals de duinen van Noordwijk.",
      bullets: ["Theorie en voeding", "Kracht en interval", "Gezamenlijke lunch en begeleiding"],
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
      title: "Over Willem",
      intro: "Willem is jouw coach, docent en gids met 40+ jaar ervaring.",
      bullets: ["40+ jaar ervaring", "Internationaal perspectief", "Prestatie en plezier"],
    },
    contact: {
      title: "Contact",
      intro: "Vragen, intake en samenwerkingen lopen via een helder contactpunt.",
      bullets: ["E-mail", "Telefoon", "WhatsApp"],
    },
  },
  en: {
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
    "clinics-and-training-camps": {
      title: "Clinics & training camps",
      intro: "Group experiences in inspiring settings such as dunes and nature routes.",
      bullets: ["Theory and nutrition", "Strength and intervals", "Shared lunch and guidance"],
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
      title: "About Willem",
      intro: "Willem is your coach, teacher and guide with 40+ years of experience.",
      bullets: ["40+ years of experience", "International perspective", "Performance and pleasure"],
    },
    contact: {
      title: "Contact",
      intro: "Intake, partnerships and questions all flow through one clear contact route.",
      bullets: ["E-mail", "Phone", "WhatsApp"],
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
    "clinics-and-training-camps": {
      title: "Clinics & training camps",
      intro: "Group experiences in inspiring settings such as dunes and nature routes.",
      bullets: ["Theory and nutrition", "Strength and intervals", "Shared lunch and guidance"],
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
      title: "About Willem",
      intro: "Willem is your coach, teacher and guide with 40+ years of experience.",
      bullets: ["40+ years of experience", "International perspective", "Performance and pleasure"],
    },
    contact: {
      title: "Contact",
      intro: "Intake, partnerships and questions all flow through one clear contact route.",
      bullets: ["E-mail", "Phone", "WhatsApp"],
    },
  },
} satisfies Record<Locale, LocaleContent["pageHighlights"]>;

export const topFitContent: Record<Locale, LocaleContent> = {
  nl: {
    menu: [
      { label: "Over Willem", href: "/nl/over-willem" },
      { label: "Aanbod", href: "/nl/abonnementen", children: offerMenu.nl },
      { label: "Blog / Kennisbank", href: "/nl/blog" },
    ],
    nav: [
      { label: "Over Willem", href: "/nl/over-willem" },
      { label: "Trainingsschema's", href: "/nl/trainingsschemas" },
      { label: "Looptechniek", href: "/nl/looptechniek" },
      { label: "Mukti Running", href: "/nl/mukti-running" },
      { label: "Clinics & Trainingskampen", href: "/nl/clinics-en-trainingskampen" },
      { label: "Online Coaching", href: "/nl/online-coaching" },
      { label: "Blog / Kennisbank", href: "/nl/blog" },
    ],
    hero: {
      eyebrow: "TopFit Running",
      title: "Hardlopen met vrijheid, plezier en kwaliteit.",
      lead: "Persoonlijke trainingsschema's, professionele coaching en inspirerende clinics voor iedere loper.",
      primaryCta: "Start jouw schema",
      secondaryCta: "Ontdek de aanpak",
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
    offers: [
      {
        title: "Premium pakket",
        price: "EUR 99 / maand",
        summary: "Voor lopers die maximale begeleiding willen en geen detail willen missen.",
        bullets: ["Minimaal 6 maanden", "Maandelijks persoonlijk schema", "1x per maand online gesprek", "Runningbook PDF inbegrepen"],
        featured: true,
      },
      {
        title: "Basispakket",
        price: "EUR 69 / maand",
        summary: "Voor lopers die zelfstandig trainen, maar wel richting en feedback willen.",
        bullets: ["Minimaal 3 maanden", "Maandelijks trainingsschema", "Eenmalig online gesprek", "Runningbook PDF inbegrepen"],
      },
      {
        title: "Clinic ticket",
        price: "EUR 125 / persoon",
        summary: "Maandelijkse clinic met theorie, praktijk, begeleiding en lunch.",
        bullets: ["10:00 - 16:00", "Koffie, thee en lunch", "Persoonlijke tips en begeleiding", "Locatie vooraf gepubliceerd"],
      },
    ],
    services: services.nl,
    shop: [
      { slug: "runningbook-pdf", title: "TopFit Runningbook PDF", summary: "De kennisbasis voor elke abonnee en loper.", price: "Inbegrepen", type: "digital" },
      { slug: "intake-call", title: "Persoonlijke intake", summary: "Kennismaking en startanalyse voor een passend plan.", price: "Op aanvraag", type: "service" },
      { slug: "clinic-ticket", title: "Clinic ticket", summary: "Toegang tot de maandelijkse clinic dag.", price: "EUR 125", type: "ticket" },
      { slug: "physical-training-120", title: "120 euro fysieke training", summary: "Loop training of functionele kracht training. Fysieke coaching op locatie in persoonlijke gym.", price: "EUR 120", type: "physical" },
    ],
    blog: [
      { slug: "trainingsleer-in-de-praktijk", title: "Trainingsleer in de praktijk", excerpt: "Hoe je schema, herstel en progressie slim combineert.", category: "Training", readTime: "6 min" },
      { slug: "blessurevrij-opbouwen", title: "Blessurevrij opbouwen", excerpt: "De basisprincipes voor duurzame loopontwikkeling.", category: "Herstel", readTime: "5 min" },
      { slug: "waarom-looptechniek-loont", title: "Waarom looptechniek loont", excerpt: "Techniek levert direct winst op in efficientie en plezier.", category: "Techniek", readTime: "7 min" },
    ],
    about: {
      eyebrow: "Over Willem",
      title: "40+ jaar ervaring als coach en docent",
      paragraphs: [
        "Je werkt met Willem Luijckx, die meer dan 40 jaar ervaring heeft als hardlooptrainer en docent trainingsleer.",
        "Je krijgt moderne trainingsmethodes gecombineerd met persoonlijke coaching, techniek, herstel en mentale balans.",
      ],
    },
    cta: {
      title: "Klaar om gericht te starten?",
      lead: "Kies een schema op maat, vraag een techniekanalyse aan of plan een persoonlijk gesprek.",
      button: "Plan je kennismaking",
    },
    pageHighlights: pageHighlights.nl,
    faq: [
      { q: "Is het Runningbook inbegrepen?", a: "Ja, voor abonnees zit het Runningbook PDF standaard inbegrepen." },
      { q: "Kunnen de programma's later uitbreiden?", a: "Ja, de opzet is modulair en kan later met trainingskampen en extra services worden uitgebreid." },
      { q: "Komt er een webshop erbij?", a: "Ja, de shop krijgt eigen producten naast de terugkerende diensten." },
      { q: "Werken we meertalig?", a: "Ja, Nederlands, Engels en Hebreeuws krijgen dezelfde structuur." },
    ],
    footer: { title: "TopFit Running", lead: "Hardlopen met vrijheid, plezier en kwaliteit." },
  },
  en: {
    menu: [
      { label: "About Willem", href: "/en/about-willem" },
      { label: "Offerings", href: "/en/subscriptions", children: offerMenu.en },
      { label: "Blog / Knowledge Base", href: "/en/blog" },
    ],
    nav: [
      { label: "About Willem", href: "/en/about-willem" },
      { label: "Training Plans", href: "/en/training-plans" },
      { label: "Running Technique", href: "/en/running-technique" },
      { label: "Mukti Running", href: "/en/mukti-running" },
      { label: "Clinics & Training Camps", href: "/en/clinics-and-training-camps" },
      { label: "Online Coaching", href: "/en/online-coaching" },
      { label: "Blog / Knowledge Base", href: "/en/blog" },
    ],
    hero: {
      eyebrow: "TopFit Running",
      title: "Run with freedom, pleasure and quality.",
      lead: "Personal training plans, professional coaching and inspiring clinics for every runner.",
      primaryCta: "Start your plan",
      secondaryCta: "Explore the approach",
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
    offers: [
      {
        title: "Premium package",
        price: "EUR 99 / month",
        summary: "For runners who want maximum support and do not want to miss a detail.",
        bullets: ["Minimum 6 months", "Monthly personal plan", "1 online call per month", "Runningbook PDF included"],
        featured: true,
      },
      {
        title: "Base package",
        price: "EUR 69 / month",
        summary: "For runners who train independently but still want direction and feedback.",
        bullets: ["Minimum 3 months", "Monthly training plan", "One online call", "Runningbook PDF included"],
      },
      {
        title: "Clinic ticket",
        price: "EUR 125 / person",
        summary: "Monthly clinic with theory, practice, guidance and lunch.",
        bullets: ["10:00 - 16:00", "Coffee, tea and lunch", "Personal guidance and tips", "Location published in advance"],
      },
    ],
    services: services.en,
    shop: [
      { slug: "runningbook-pdf", title: "TopFit Runningbook PDF", summary: "The knowledge base for every subscriber and runner.", price: "Included", type: "digital" },
      { slug: "intake-call", title: "Personal intake", summary: "Kickoff call and assessment for the right plan.", price: "On request", type: "service" },
      { slug: "clinic-ticket", title: "Clinic ticket", summary: "Access to the monthly clinic day.", price: "EUR 125", type: "ticket" },
      { slug: "physical-training-120", title: "EUR 120 physical training", summary: "Running training or functional strength training. In-person coaching at a private gym.", price: "EUR 120", type: "physical" },
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
        "You work with Willem Luijckx, who brings more than 40 years of running coaching and teaching experience.",
        "You get modern training methods combined with personal coaching, technique, recovery and mental balance.",
      ],
    },
    cta: {
      title: "Ready to start with focus?",
      lead: "Choose a custom plan, request a technique analysis or schedule a personal call.",
      button: "Book your intro call",
    },
    pageHighlights: pageHighlights.en,
    faq: [
      { q: "Is the Runningbook included?", a: "Yes, subscribers receive the Runningbook PDF by default." },
      { q: "Can the offer expand later?", a: "Yes, the structure is modular and can expand with training camps and extra services." },
      { q: "Will there be a shop next to subscriptions?", a: "Yes, the shop gets separate products next to recurring services." },
      { q: "Will the site support multiple languages?", a: "Yes, Dutch, English and Hebrew share the same structure." },
    ],
    footer: { title: "TopFit Running", lead: "Run with freedom, pleasure and quality." },
  },
  he: {
    menu: [
      { label: "About Willem", href: "/he/about-willem" },
      { label: "Offerings", href: "/he/subscriptions", children: offerMenu.he },
      { label: "Blog / Knowledge Base", href: "/he/blog" },
    ],
    nav: [
      { label: "About Willem", href: "/he/about-willem" },
      { label: "Training Plans", href: "/he/training-plans" },
      { label: "Running Technique", href: "/he/running-technique" },
      { label: "Mukti Running", href: "/he/mukti-running" },
      { label: "Clinics & Training Camps", href: "/he/clinics-and-training-camps" },
      { label: "Online Coaching", href: "/he/online-coaching" },
      { label: "Blog / Knowledge Base", href: "/he/blog" },
    ],
    hero: {
      eyebrow: "TopFit Running",
      title: "Run with freedom, pleasure and quality.",
      lead: "Personal training plans, professional coaching and inspiring clinics for every runner.",
      primaryCta: "Start your plan",
      secondaryCta: "Explore the approach",
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
    offers: [
      {
        title: "Premium package",
        price: "EUR 99 / month",
        summary: "For runners who want maximum support and do not want to miss a detail.",
        bullets: ["Minimum 6 months", "Monthly personal plan", "1 online call per month", "Runningbook PDF included"],
        featured: true,
      },
      {
        title: "Base package",
        price: "EUR 69 / month",
        summary: "For runners who train independently but still want direction and feedback.",
        bullets: ["Minimum 3 months", "Monthly training plan", "One online call", "Runningbook PDF included"],
      },
      {
        title: "Clinic ticket",
        price: "EUR 125 / person",
        summary: "Monthly clinic with theory, practice, guidance and lunch.",
        bullets: ["10:00 - 16:00", "Coffee, tea and lunch", "Personal guidance and tips", "Location published in advance"],
      },
    ],
    services: services.he,
    shop: [
      { slug: "runningbook-pdf", title: "TopFit Runningbook PDF", summary: "The knowledge base for every subscriber and runner.", price: "Included", type: "digital" },
      { slug: "intake-call", title: "Personal intake", summary: "Kickoff call and assessment for the right plan.", price: "On request", type: "service" },
      { slug: "clinic-ticket", title: "Clinic ticket", summary: "Access to the monthly clinic day.", price: "EUR 125", type: "ticket" },
      { slug: "physical-training-120", title: "EUR 120 physical training", summary: "Running training or functional strength training. In-person coaching at a private gym.", price: "EUR 120", type: "physical" },
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
        "You work with Willem Luijckx, who brings more than 40 years of running coaching and teaching experience.",
        "You get modern training methods combined with personal coaching, technique, recovery and mental balance.",
      ],
    },
    cta: {
      title: "Ready to start with focus?",
      lead: "Choose a custom plan, request a technique analysis or schedule a personal call.",
      button: "Book your intro call",
    },
    pageHighlights: pageHighlights.he,
    faq: [
      { q: "Is the Runningbook included?", a: "Yes, subscribers receive the Runningbook PDF by default." },
      { q: "Can the offer expand later?", a: "Yes, the structure is modular and can expand with training camps and extra services." },
      { q: "Will there be a shop next to subscriptions?", a: "Yes, the shop gets separate products next to recurring services." },
      { q: "Will the site support multiple languages?", a: "Yes, Dutch, English and Hebrew share the same structure." },
    ],
    footer: { title: "TopFit Running", lead: "Run with freedom, pleasure and quality." },
  },
};

export const getLocaleContent = (locale: Locale) => topFitContent[locale];
