import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle2, Copy, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { REVIEW_PAGES, type ReviewDraft, type ReviewStatus } from "@/lib/reviewFlow";
import { topFitSiteConfig } from "@/lib/siteConfig";

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
    {status}
  </span>
);

const parseDraft = (payload: string): ReviewDraft | null => {
  try {
    return JSON.parse(payload) as ReviewDraft;
  } catch {
    return null;
  }
};

const ReviewSummaryPage = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const token = params.token;
  const version = searchParams.get("version")?.trim() || "V1";
  const [draft, setDraft] = useState<ReviewDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let active = true;
    void fetch(`/api/review?token=${encodeURIComponent(token)}&version=${encodeURIComponent(version)}`)
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; latest?: { payload?: string }; error?: string };
        if (!response.ok || !payload.ok) throw new Error(payload.error || "Failed to load summary");
        const serverDraft = payload.latest?.payload ? parseDraft(payload.latest.payload) : null;
        if (active) {
          setDraft(serverDraft);
          setError(serverDraft ? "" : "No saved round found for this version.");
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load summary");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, version]);

  const summaryItems = useMemo(() => {
    if (!draft) return [];

    return REVIEW_PAGES.flatMap((page) => {
      const pageStatus = draft.pageStatuses[page.key] ?? "pending";
      const pageItems =
        pageStatus === "approved"
          ? []
          : [{ key: `page:${page.key}`, label: page.label, status: pageStatus, note: draft.notes[`page:${page.key}`] ?? "" }];

      const sectionItems = page.sections
        .map((section) => {
          const itemKey = `${page.key}:${section.key}`;
          const status = draft.sectionStatuses[itemKey] ?? "pending";
          return {
            key: `section:${itemKey}`,
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
    return [
      `Project: ${topFitSiteConfig.brandName}`,
      `Review token: ${draft.token}`,
      `Version: ${draft.version}`,
      `Open items:`,
      ...summaryItems.map((item) => `- ${item.label} [${item.status}]${item.note ? ` - ${item.note}` : ""}`),
    ].join("\n");
  }, [draft, summaryItems]);

  const copySummary = async () => {
    if (!codexPrompt) return;
    await navigator.clipboard.writeText(codexPrompt);
  };

  if (!token) return <Navigate to="/nl" replace />;

  return (
    <section className="mx-auto min-h-screen max-w-5xl px-5 py-10 md:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Review summary</div>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-5xl">
            {topFitSiteConfig.brandName} round {version}
          </h1>
        </div>
        <div className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white">
          {token}
        </div>
      </div>

      {loading ? (
        <Card className="border-slate-200 bg-white">
          <CardContent className="flex items-center gap-3 p-6 text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            Loading summary...
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-rose-200 bg-rose-50">
          <CardContent className="p-6 text-rose-700">{error}</CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-6 p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Open items</div>
                  <h2 className="mt-2 text-3xl font-black uppercase tracking-[0.04em] text-slate-950">Round feedback</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="heroOutline" onClick={copySummary}>
                    <Copy className="h-4 w-4" />
                    Copy Codex prompt
                  </Button>
                  <Button variant="hero" asChild>
                    <Link to={`/review/${token}?version=${encodeURIComponent(version)}`}>
                      <ShieldCheck className="h-4 w-4" />
                      Open editor
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-3">
                {summaryItems.length ? (
                  summaryItems.map((item) => (
                    <div key={item.key} className="rounded-3xl border border-slate-200 p-5">
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
                    <CheckCircle2 className="mr-2 inline h-5 w-5" />
                    All items are approved for this round.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-slate-950 text-white">
            <CardContent className="p-6 md:p-8">
              <div className="text-xs uppercase tracking-[0.35em] text-blue-200">Codex prompt preview</div>
              <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap text-sm leading-7 text-slate-200">{codexPrompt}</pre>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
};

export default ReviewSummaryPage;
