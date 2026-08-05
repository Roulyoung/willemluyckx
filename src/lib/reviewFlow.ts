export type ReviewStatus = "pending" | "needs_review" | "needs_changes" | "approved" | "not_applicable" | "blocked";

export type ReviewSection = {
  key: string;
  label: string;
  description: string;
  previewUrl?: string;
  previewTitle?: string;
  previewBody?: string;
};

export type ReviewPage = {
  key: string;
  label: string;
  url: string;
  sections: ReviewSection[];
};

export type ReviewDraft = {
  token: string;
  version: string;
  currentPageIndex: number;
  completedPages: Record<string, boolean>;
  pageStatuses: Record<string, ReviewStatus>;
  sectionStatuses: Record<string, ReviewStatus>;
  notes: Record<string, string>;
  updatedAt: string;
};

export const REVIEW_PAGES: ReviewPage[] = [
  {
    key: "home",
    label: "Home",
    url: "/nl",
    sections: [
      { key: "hero", label: "Bovenste blok", description: "Headline, intro and primary CTA.", previewUrl: "/nl#hero" },
      {
        key: "offer-grid",
        label: "Aanbodblokken",
        description: "Packages, cards and hierarchy.",
        previewUrl: "/nl#offers",
        previewTitle: "Packages and options",
        previewBody: "This is the block where visitors compare offerings or choose a next step.",
      },
      {
        key: "services",
        label: "Dienstenblok",
        description: "The next-step overview blocks.",
        previewUrl: "/nl#services",
        previewTitle: "What you can do next",
        previewBody: "A quick overview of services, support or actions the visitor can take.",
      },
      {
        key: "blog-teaser",
        label: "Blogblok",
        description: "Blog/knowledge sections and links.",
        previewUrl: "/nl#blog-teaser",
        previewTitle: "Recent articles",
        previewBody: "A small teaser section that sends visitors into the blog or knowledge area.",
      },
      { key: "faq", label: "Afsluitblok", description: "Questions, answers and clarity.", previewUrl: "/nl#footer-cta", previewTitle: "Common questions" },
    ],
  },
  {
    key: "trainingsschemas",
    label: "Trainingsschema's",
    url: "/nl/trainingsschemas",
    sections: [
      {
        key: "title",
        label: "Kop en intro",
        description: "SEO title, intro and framing.",
        previewUrl: "/nl/trainingsschemas#trainingplans-hero",
        previewTitle: "Training schedule overview",
      },
      {
        key: "table",
        label: "Trainingsschema tabel",
        description: "Layout, readability and responsiveness.",
        previewUrl: "/nl/trainingsschemas#trainingplans-table",
        previewTitle: "Weekly training plan",
        previewBody: "The big table with weeks, days and total kilometres.",
      },
      { key: "cta", label: "Volgende stap", description: "Buttons and next action.", previewUrl: "/nl/trainingsschemas#trainingplans-next", previewTitle: "Next step" },
    ],
  },
  {
    key: "blog",
    label: "Blog",
    url: "/nl/blog",
    sections: [
      {
        key: "index",
        label: "Blogoverzicht",
        description: "Card layout, sorting and clarity.",
        previewUrl: "/nl/blog#blog-index",
        previewTitle: "Blog overview",
        previewBody: "The page where all blog posts are listed as cards or teasers.",
      },
      {
        key: "article",
        label: "Artikelpagina",
        description: "Copy, hierarchy and SEO framing.",
        previewUrl: "/nl/blog/mukti-running-hardlopen-met-vrijheid-rust-en-minder-druk#article",
        previewTitle: "Single blog post",
        previewBody: "The layout used for one article, including title, intro and body copy.",
      },
    ],
  },
  {
    key: "contact",
    label: "Contact",
    url: "/nl/contact",
    sections: [
      {
        key: "header",
        label: "Bovenblok",
        description: "Intro, trust and context.",
        previewUrl: "/nl/contact#contact-hero",
        previewTitle: "Contact intro",
        previewBody: "The top section with the short explanation and trust message.",
      },
      {
        key: "form",
        label: "Formulier",
        description: "Fields, labels and usability.",
        previewUrl: "/nl/contact#contact-form",
        previewTitle: "Contact form",
        previewBody: "The area where someone enters their name, email and message.",
      },
      {
        key: "buttons",
        label: "Contactknoppen",
        description: "Contact actions and links.",
        previewUrl: "/nl/contact#contact-form",
        previewTitle: "Contact actions",
        previewBody: "Call, email or WhatsApp buttons that help the visitor get in touch.",
      },
    ],
  },
  {
    key: "shop",
    label: "Shop",
    url: "/nl/shop",
    sections: [
      {
        key: "overview",
        label: "Overzicht",
        description: "Product cards and labels.",
        previewUrl: "/nl/shop#shop-hero",
        previewTitle: "Shop overview",
        previewBody: "The grid of products, cards or items visitors can click through.",
      },
      {
        key: "detail",
        label: "Detailpagina",
        description: "Details, CTA and trust.",
        previewUrl: "/nl/shop#shop-digital",
        previewTitle: "Product page",
        previewBody: "The detail view for one product, including price, description and purchase button.",
      },
    ],
  },
];

export const getStorageKey = (token: string, version = "V1") => `topfit-review-draft:${token}:${version}`;

export const createInitialDraft = (token: string): ReviewDraft => {
  const pageStatuses = Object.fromEntries(REVIEW_PAGES.map((page) => [page.key, "pending"])) as Record<string, ReviewStatus>;
  const sectionStatuses = Object.fromEntries(
    REVIEW_PAGES.flatMap((page) => page.sections.map((section) => [`${page.key}:${section.key}`, "pending"])),
  ) as Record<string, ReviewStatus>;

  return {
    token,
    version: "V1",
    currentPageIndex: 0,
    completedPages: {},
    pageStatuses,
    sectionStatuses,
    notes: {},
    updatedAt: new Date().toISOString(),
  };
};

export const incrementReviewVersion = (version: string) => {
  const match = version.match(/^V(\d+)$/i);
  if (!match) return "V2";
  return `V${Number(match[1]) + 1}`;
};

export const createNextRoundDraft = (draft: ReviewDraft, token: string) => {
  const nextPageStatuses = Object.fromEntries(Object.keys(draft.pageStatuses).map((key) => [key, "pending"])) as Record<string, ReviewStatus>;
  const nextSectionStatuses = Object.fromEntries(Object.keys(draft.sectionStatuses).map((key) => [key, "pending"])) as Record<string, ReviewStatus>;

  return {
    ...draft,
    token,
    version: incrementReviewVersion(draft.version),
    currentPageIndex: 0,
    completedPages: {},
    pageStatuses: nextPageStatuses,
    sectionStatuses: nextSectionStatuses,
    notes: {},
    updatedAt: new Date().toISOString(),
  };
};

export const statusOptions: Array<{ value: ReviewStatus; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "needs_review", label: "Needs review" },
  { value: "needs_changes", label: "Needs changes" },
  { value: "approved", label: "Approved" },
  { value: "not_applicable", label: "Not applicable" },
  { value: "blocked", label: "Blocked" },
];
