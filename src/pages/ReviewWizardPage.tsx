import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, CircleDot, Copy, ExternalLink, Loader2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Locale } from "@/lib/i18n";
import {
  createInitialDraft,
  createNextRoundDraft,
  getStorageKey,
  REVIEW_PAGES,
  statusOptions,
  type ReviewDraft,
  type ReviewStatus,
} from "@/lib/reviewFlow";
import { topFitSiteConfig } from "@/lib/siteConfig";

const safeParseDraft = (raw: string | null, token: string): ReviewDraft | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ReviewDraft>;
    if (!parsed || parsed.token !== token) return null;
    return {
      ...createInitialDraft(token),
      ...parsed,
      pageStatuses: { ...createInitialDraft(token).pageStatuses, ...(parsed.pageStatuses ?? {}) },
      sectionStatuses: { ...createInitialDraft(token).sectionStatuses, ...(parsed.sectionStatuses ?? {}) },
      notes: { ...(parsed.notes ?? {}) },
    };
  } catch {
    return null;
  }
};

const REVIEW_CACHE_STORAGE = "topfit-review-server-cache";
const REVIEW_CACHE_TTL_MS = 60_000;

type ReviewServerCache = {
  savedAt: string;
  token: string;
  payload: string;
};

const readCachedServerDraft = (token: string) => {
  try {
    const raw = window.sessionStorage.getItem(REVIEW_CACHE_STORAGE);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ReviewServerCache;
    if (!parsed?.savedAt || parsed.token !== token || !parsed.payload) return null;
    if (Date.now() - new Date(parsed.savedAt).getTime() > REVIEW_CACHE_TTL_MS) return null;
    return safeParseDraft(parsed.payload, token);
  } catch {
    return null;
  }
};

const writeCachedServerDraft = (token: string, payload: string) => {
  try {
    window.sessionStorage.setItem(
      REVIEW_CACHE_STORAGE,
      JSON.stringify({ savedAt: new Date().toISOString(), token, payload }),
    );
  } catch {
    // ignore cache write failures
  }
};

const statusLabelByValue = Object.fromEntries(statusOptions.map((option) => [option.value, option.label])) as Record<ReviewStatus, string>;

const badgeClassByStatus: Record<ReviewStatus, string> = {
  pending: "bg-slate-100 text-slate-600",
  needs_review: "bg-amber-100 text-amber-700",
  needs_changes: "bg-rose-100 text-rose-700",
  approved: "bg-emerald-100 text-emerald-700",
  not_applicable: "bg-slate-100 text-slate-500",
  blocked: "bg-slate-100 text-slate-700",
};

const ReviewStatusPill = ({ status }: { status: ReviewStatus }) => (
  <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${badgeClassByStatus[status]}`}>
    {statusLabelByValue[status]}
  </span>
);

const scrollIframeToHash = (iframe: HTMLIFrameElement | null, fallbackHash?: string) => {
  const targetHash = iframe?.src ? new URL(iframe.src, window.location.origin).hash : fallbackHash ?? "";
  if (!iframe?.contentWindow || !iframe.contentDocument) return;

  const scrollToHash = () => {
    const hash = targetHash.startsWith("#") ? targetHash.slice(1) : targetHash;
    if (!hash) {
      iframe.contentWindow?.scrollTo(0, 0);
      return;
    }

    const target = iframe.contentDocument.getElementById(hash);
    if (target) {
      target.scrollIntoView({ block: "start", inline: "nearest" });
      return;
    }

    iframe.contentWindow?.scrollTo(0, 0);
  };

  window.setTimeout(scrollToHash, 50);
};

const ReviewWizardPage = () => {
  const params = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const token = params.token;
  const requestedVersion = searchParams.get("version")?.trim() || "V1";
  const [draft, setDraft] = useState<ReviewDraft | null>(null);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [storedDraftLoaded, setStoredDraftLoaded] = useState(false);

  useEffect(() => {
    if (!token) return;
    const stored = safeParseDraft(window.localStorage.getItem(getStorageKey(token, requestedVersion)), token);
    setStoredDraftLoaded(Boolean(stored));
    const initial = stored ?? createInitialDraft(token);
    setDraft({ ...initial, version: requestedVersion });
    setReady(true);
  }, [requestedVersion, token]);

  useEffect(() => {
    if (!token || !draft) return;
    window.localStorage.setItem(getStorageKey(token, draft.version), JSON.stringify(draft));
  }, [draft, token]);

  useEffect(() => {
    if (!token) return;

    const cachedDraft = readCachedServerDraft(token);
    if (cachedDraft) {
      setDraft((current) => {
        if (!current) return cachedDraft;
        if (!storedDraftLoaded) return cachedDraft;
        return current.updatedAt > cachedDraft.updatedAt ? current : cachedDraft;
      });
      setHydrated(true);
      return;
    }

    let active = true;
    void fetch(`/api/review?token=${encodeURIComponent(token)}&version=${encodeURIComponent(requestedVersion)}`)
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; latest?: { payload?: string } };
        if (response.ok && payload.ok && payload.latest?.payload && active) {
          const serverDraft = safeParseDraft(payload.latest.payload, token);
          if (serverDraft) {
            writeCachedServerDraft(token, payload.latest.payload);
            setDraft((current) => {
              if (!current) return serverDraft;
              if (!storedDraftLoaded) return serverDraft;
              return current.updatedAt > serverDraft.updatedAt ? current : serverDraft;
            });
          }
        }
        if (active) setHydrated(true);
      })
      .catch(() => {
        if (active) setSyncError("Could not load saved review state.");
        setHydrated(true);
      });

    return () => {
      active = false;
    };
  }, [storedDraftLoaded, requestedVersion, token]);

  useEffect(() => {
    if (!token || !draft || !hydrated) return;

    const timer = window.setTimeout(() => {
      setSaving(true);
      setSyncError("");
      void fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...draft,
          token,
          version: requestedVersion,
          mode: "needs_review",
        }),
      })
        .then(async (response) => {
          const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
          if (!response.ok || !payload.ok) {
            throw new Error(payload.error || "Save failed");
          }
        })
        .catch(() => {
          setSyncError("Autosave failed. Your changes are still in the browser draft.");
        })
        .finally(() => setSaving(false));
    }, 500);

    return () => window.clearTimeout(timer);
  }, [draft, requestedVersion, token]);

  const currentPage = useMemo(() => {
    if (!draft) return REVIEW_PAGES[0];
    return REVIEW_PAGES[draft.currentPageIndex] ?? REVIEW_PAGES[0];
  }, [draft]);

  const currentPagePreviewRef = useRef<HTMLIFrameElement | null>(null);
  const [activeSectionPreviewKey, setActiveSectionPreviewKey] = useState<string>(() => {
    const firstSection = REVIEW_PAGES[0]?.sections[0];
    return firstSection ? `${REVIEW_PAGES[0].key}:${firstSection.key}` : "";
  });

  const pageProgress = draft ? Math.round(((draft.currentPageIndex + 1) / REVIEW_PAGES.length) * 100) : 0;
  const completedCount = draft ? Object.values(draft.completedPages).filter(Boolean).length : 0;
  const isLastPage = draft ? draft.currentPageIndex === REVIEW_PAGES.length - 1 : false;
  const isSummary = location.pathname.endsWith("/summary");
  const activeSection = useMemo(() => {
    if (!draft) return null;
    return currentPage.sections.find((section) => `${currentPage.key}:${section.key}` === activeSectionPreviewKey) ?? currentPage.sections[0] ?? null;
  }, [activeSectionPreviewKey, currentPage, draft]);
  const openItems = useMemo(() => {
    if (!draft) return [];

    return REVIEW_PAGES.flatMap((page) => {
      const pageStatus = draft.pageStatuses[page.key] ?? "pending";
      const pageItems =
        pageStatus === "approved"
          ? []
          : [{ type: "page", pageKey: page.key, label: page.label, status: pageStatus, note: draft.notes[`page:${page.key}`] ?? "" }];

      const sectionItems = page.sections
        .map((section) => {
          const itemKey = `${page.key}:${section.key}`;
          const status = draft.sectionStatuses[itemKey] ?? "pending";
          return {
            type: "section",
            pageKey: page.key,
            sectionKey: section.key,
            label: `${page.label} / ${section.label}`,
            status,
            note: draft.notes[`section:${itemKey}`] ?? "",
          };
        })
        .filter((item) => item.status !== "approved");

      return [...pageItems, ...sectionItems];
    });
  }, [draft]);

  const codexPrompt = useMemo(() => {
    if (!draft) return "";
    const lines = [
      `Project: ${topFitSiteConfig.brandName}`,
      `Review token: ${draft.token}`,
      `Version: ${draft.version}`,
      `Open items:`,
      ...openItems.map((item) => `- ${item.label} [${item.status}]${item.note ? ` - ${item.note}` : ""}`),
    ];
    return lines.join("\n");
  }, [draft, openItems]);

  const updateDraft = (updater: (current: ReviewDraft) => ReviewDraft) => {
    setDraft((current) => (current ? updater(current) : current));
  };

  const setPageStatus = (pageKey: string, status: ReviewStatus) => {
    updateDraft((current) => ({
      ...current,
      pageStatuses: { ...current.pageStatuses, [pageKey]: status },
      updatedAt: new Date().toISOString(),
    }));
  };

  const setSectionStatus = (pageKey: string, sectionKey: string, status: ReviewStatus) => {
    const itemKey = `${pageKey}:${sectionKey}`;
    updateDraft((current) => ({
      ...current,
      sectionStatuses: { ...current.sectionStatuses, [itemKey]: status },
      updatedAt: new Date().toISOString(),
    }));
  };

  const setNote = (key: string, value: string) => {
    updateDraft((current) => ({
      ...current,
      notes: { ...current.notes, [key]: value },
      updatedAt: new Date().toISOString(),
    }));
  };

  const completePage = () => {
    updateDraft((current) => ({
      ...current,
      completedPages: { ...current.completedPages, [currentPage.key]: true },
      currentPageIndex: Math.min(current.currentPageIndex + 1, REVIEW_PAGES.length - 1),
      updatedAt: new Date().toISOString(),
    }));
  };

  useEffect(() => {
    const firstSection = currentPage.sections[0];
    if (!firstSection) return;
    setActiveSectionPreviewKey(`${currentPage.key}:${firstSection.key}`);
  }, [currentPage.key]);

  const goPrevious = () => {
    updateDraft((current) => ({
      ...current,
      currentPageIndex: Math.max(current.currentPageIndex - 1, 0),
      updatedAt: new Date().toISOString(),
    }));
  };

  const goNext = () => {
    if (isLastPage) {
      window.location.href = `/review/${token}/summary`;
      return;
    }
    completePage();
  };

  const approveRound = async () => {
    if (!draft || !token) return;
    const approvedDraft = {
      ...draft,
      pageStatuses: Object.fromEntries(Object.keys(draft.pageStatuses).map((key) => [key, "approved"])),
      sectionStatuses: Object.fromEntries(Object.keys(draft.sectionStatuses).map((key) => [key, "approved"])),
      completedPages: Object.fromEntries(REVIEW_PAGES.map((page) => [page.key, true])),
      updatedAt: new Date().toISOString(),
    } as ReviewDraft;
    setDraft(approvedDraft);
    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
          ...approvedDraft,
          token,
          version: requestedVersion,
          mode: "final_approved",
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Approval save failed");
      }
    } catch {
      setSyncError("Approval save failed. Your browser draft is still intact.");
    }
  };

  const copyCodexPrompt = async () => {
    if (!codexPrompt) return;
    await navigator.clipboard.writeText(codexPrompt);
  };

  if (!token) {
    return <Navigate to="/nl" replace />;
  }

  if (!ready || !draft) {
    return (
      <section className="mx-auto flex min-h-screen max-w-4xl items-center px-5 py-16 md:px-8">
        <Card className="w-full border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
          <CardContent className="flex items-center gap-3 p-6 text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            Loading review...
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto min-h-screen max-w-7xl px-5 py-10 md:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Review portal</div>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-5xl">
            {topFitSiteConfig.brandName} feedback wizard
          </h1>
        </div>
        <div className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white">
          {draft.version} / {completedCount}/{REVIEW_PAGES.length} pages complete
        </div>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="space-y-4 p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Progress</div>
              <div className="text-lg font-black uppercase tracking-[0.04em] text-slate-950">
                Page {draft.currentPageIndex + 1} of {REVIEW_PAGES.length}
              </div>
            </div>
            <div className="text-sm text-slate-600">
              {saving ? "Saving..." : "Autosave is on. You can close and return with the same link."}
            </div>
          </div>
          <div className="h-3 rounded-full bg-slate-100">
            <div className="h-3 rounded-full bg-blue-600 transition-all" style={{ width: `${pageProgress}%` }} />
          </div>
          {syncError ? <div className="text-sm font-medium text-rose-700">{syncError}</div> : null}
        </CardContent>
      </Card>

      {isSummary ? (
        <Card className="mt-8 border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Summary</div>
                <h2 className="mt-2 text-3xl font-black uppercase tracking-[0.04em] text-slate-950">Open items and final check</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                  This is the list the client should approve after each change round. Anything not approved stays open for the next version.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="heroOutline" onClick={copyCodexPrompt}>
                  <Copy className="h-4 w-4" />
                  Copy Codex prompt
                </Button>
                <Button variant="hero" onClick={approveRound}>
                  <ShieldCheck className="h-4 w-4" />
                  Approve version
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              {openItems.length ? (
                openItems.map((item) => (
                  <div key={`${item.pageKey}-${item.sectionKey ?? "page"}`} className="rounded-3xl border border-slate-200 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-black uppercase tracking-[0.04em] text-slate-950">{item.label}</div>
                        {item.note ? <p className="mt-2 text-sm leading-7 text-slate-600">{item.note}</p> : null}
                      </div>
                      <ReviewStatusPill status={item.status} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
                  All items are approved for this round.
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-slate-950 p-5 text-white">
              <div className="text-xs uppercase tracking-[0.35em] text-blue-200">Codex prompt preview</div>
              <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap text-sm leading-7 text-slate-200">{codexPrompt}</pre>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {!isSummary ? (
        <div className="mt-8 grid gap-6 xl:grid-cols-[0.28fr_1.72fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
              <ClipboardList className="h-4 w-4" />
              Pages
            </div>
            <div className="grid gap-3">
              {REVIEW_PAGES.map((page, index) => (
                <button
                  key={page.key}
                  type="button"
                  onClick={() => updateDraft((current) => ({ ...current, currentPageIndex: index, updatedAt: new Date().toISOString() }))}
                  className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                    index === draft.currentPageIndex ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold uppercase tracking-[0.04em] text-slate-950">{page.label}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">{page.url}</div>
                    </div>
                    {draft.completedPages[page.key] ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <CircleDot className="h-5 w-5 text-slate-400" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="rounded-3xl bg-slate-950 p-5 text-white">
              <div className="text-xs uppercase tracking-[0.35em] text-blue-200">Current token</div>
              <div className="mt-2 break-all text-sm font-medium text-slate-200">{token}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-2xl shadow-blue-950/10 xl:sticky xl:top-6">
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Current page</div>
                <h2 className="mt-2 text-3xl font-black uppercase tracking-[0.04em] text-slate-950">{currentPage.label}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{currentPage.url}</p>
              </div>
              <ReviewStatusPill status={draft.pageStatuses[currentPage.key] ?? "pending"} />
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">Current page preview</div>
                <Button variant="heroOutline" size="sm" asChild>
                  <a href={currentPage.url} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Open page
                  </a>
                </Button>
              </div>
                <iframe
                  key={currentPage.url}
                  ref={currentPagePreviewRef}
                  onLoad={() => scrollIframeToHash(currentPagePreviewRef.current, "#hero")}
                  title={`${currentPage.label} main preview`}
                  src={currentPage.url}
                  className="h-[48rem] w-full bg-white md:h-[58rem] xl:h-[calc(100vh-10rem)]"
                  loading="lazy"
                />
            </div>

            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={draft.pageStatuses[currentPage.key] === option.value ? "hero" : "heroOutline"}
                    className="justify-center"
                    onClick={() => setPageStatus(currentPage.key, option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              <textarea
                className="min-h-28 w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 outline-none ring-0 focus:border-blue-300"
                placeholder="Write page-level feedback here..."
                value={draft.notes[`page:${currentPage.key}`] ?? ""}
                onChange={(event) => setNote(`page:${currentPage.key}`, event.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Sections</div>
                <div className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Click a section to preview it</div>
              </div>
              {activeSection ? (
                <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">Section preview</div>
                      <div className="mt-1 text-sm font-black uppercase tracking-[0.04em] text-slate-950">
                        {activeSection.previewTitle ?? activeSection.label}
                      </div>
                      <p className="mt-1 text-xs leading-6 text-slate-500">{activeSection.description}</p>
                    </div>
                    <Button variant="heroOutline" size="sm" asChild>
                      <a href={activeSection.previewUrl ?? currentPage.url} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        Open page
                      </a>
                    </Button>
                  </div>
                  <div className="bg-white">
                    <iframe
                      key={`active-section:${currentPage.key}:${activeSection.key}:${activeSection.previewUrl ?? currentPage.url}`}
                      onLoad={(event) => {
                        const targetUrl = activeSection.previewUrl ?? currentPage.url;
                        scrollIframeToHash(event.currentTarget, targetUrl ? new URL(targetUrl, window.location.origin).hash : "#hero");
                      }}
                      title={`${currentPage.label} / ${activeSection.label} preview`}
                      src={activeSection.previewUrl ?? currentPage.url}
                      className="h-[60rem] w-full bg-white md:h-[68rem] xl:h-[calc(100vh-8rem)]"
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : null}
              <div className="grid gap-4">
                {currentPage.sections.map((section) => {
                  const itemKey = `${currentPage.key}:${section.key}`;
                  const status = draft.sectionStatuses[itemKey] ?? "pending";
                  return (
                    <div
                      key={itemKey}
                      className={`rounded-3xl border p-5 text-left transition-colors ${
                        activeSectionPreviewKey === itemKey
                          ? "border-blue-300 bg-blue-50 shadow-sm"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveSectionPreviewKey(itemKey)}
                        className="flex w-full flex-wrap items-start justify-between gap-3 text-left"
                      >
                        <div>
                          <div className="text-base font-black uppercase tracking-[0.04em] text-slate-950">{section.label}</div>
                          <p className="mt-1 text-sm leading-7 text-slate-600">{section.description}</p>
                        </div>
                        <ReviewStatusPill status={status} />
                      </button>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="heroOutline" size="sm" asChild>
                          <a href={section.previewUrl ?? currentPage.url} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            Open page
                          </a>
                        </Button>
                      </div>
                      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                        <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
                          <div>
                            <div className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">Section preview</div>
                            <div className="mt-1 text-sm font-black uppercase tracking-[0.04em] text-slate-950">
                              {section.previewTitle ?? section.label}
                            </div>
                          </div>
                          {activeSectionPreviewKey === itemKey ? (
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-700">
                              Active
                            </span>
                          ) : null}
                        </div>
                        <iframe
                          key={`section-preview:${itemKey}:${section.previewUrl ?? currentPage.url}`}
                          onLoad={
                            activeSectionPreviewKey === itemKey
                              ? (event) => {
                                  const targetUrl = section.previewUrl ?? currentPage.url;
                                  scrollIframeToHash(event.currentTarget, targetUrl ? new URL(targetUrl, window.location.origin).hash : "#hero");
                                }
                              : undefined
                          }
                          title={`${currentPage.label} / ${section.label} preview`}
                          src={section.previewUrl ?? currentPage.url}
                          className="h-[20rem] w-full bg-white md:h-[24rem] xl:h-[28rem]"
                          loading="lazy"
                        />
                      </div>
                      {section.previewBody ? (
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{section.previewBody}</p>
                      ) : null}
                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        {statusOptions.map((option) => (
                          <Button
                            key={option.value}
                            variant={status === option.value ? "hero" : "heroOutline"}
                            size="sm"
                            className="justify-center"
                            onClick={() => setSectionStatus(currentPage.key, section.key, option.value)}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                      <textarea
                        className="mt-4 min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 outline-none ring-0 focus:border-blue-300"
                        placeholder={`Feedback for ${section.label}...`}
                        value={draft.notes[`section:${itemKey}`] ?? ""}
                        onChange={(event) => setNote(`section:${itemKey}`, event.target.value)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-4">
              <Button variant="heroOutline" onClick={goPrevious} disabled={draft.currentPageIndex === 0}>
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button variant="hero" onClick={goNext}>
                {isLastPage ? "Go to summary" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      ) : null}
    </section>
  );
};

export default ReviewWizardPage;
