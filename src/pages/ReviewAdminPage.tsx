import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ClipboardList, Loader2, LockKeyhole, RefreshCw, Copy, CircleDot, AlertTriangle, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { incrementReviewVersion } from "@/lib/reviewFlow";
type ReviewSnapshot = {
  token: string;
  version: string;
  currentPageIndex: number;
  updatedAt: string;
  status: string;
  payload: string;
};

const ADMIN_KEY_STORAGE = "topfit-review-admin-key";
const ADMIN_CACHE_STORAGE = "topfit-review-admin-cache";
const ADMIN_CACHE_TTL_MS = 60_000;

type ReviewAdminCache = {
  savedAt: string;
  items: ReviewSnapshot[];
};

const badgeClass = (status: string) => {
  if (status === "final_approved") return "bg-emerald-100 text-emerald-700";
  if (status === "needs_review") return "bg-amber-100 text-amber-700";
  if (status === "needs_changes") return "bg-rose-100 text-rose-700";
  return "bg-slate-100 text-slate-600";
};

const ReviewAdminPage = () => {
  const [items, setItems] = useState<ReviewSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [authorized, setAuthorized] = useState(true);
  const [generatedToken, setGeneratedToken] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
    setAdminKey(stored);
    setAuthorized(!stored);
  }, []);

  const loadItems = async (key = adminKey) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/review", {
        headers: key ? { "X-Admin-Key": key } : undefined,
      });
      const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; items?: ReviewSnapshot[]; error?: string };
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Failed to load review items");
      setItems(payload.items ?? []);
      writeCachedItems(payload.items ?? []);
      setAuthorized(true);
    } catch (loadError) {
      if (loadError instanceof Error && loadError.message.toLowerCase().includes("unauthorized")) {
        setAuthorized(false);
      }
      setError(loadError instanceof Error ? loadError.message : "Failed to load review items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authorized) return;
    const cachedItems = readCachedItems();
    if (cachedItems) {
      setItems(cachedItems);
      setLoading(false);
      return;
    }
    void loadItems();
  }, [authorized]);

  const saveAdminKey = (key: string) => {
    const trimmed = key.trim();
    setAdminKey(trimmed);
    window.localStorage.setItem(ADMIN_KEY_STORAGE, trimmed);
    setAuthorized(!trimmed);
  };

  const generateToken = () => {
    const token = `review-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
    setGeneratedToken(token);
    return token;
  };

  const copyText = async (value: string) => {
    await navigator.clipboard.writeText(value);
  };

  const readCachedItems = () => {
    try {
      const raw = window.sessionStorage.getItem(ADMIN_CACHE_STORAGE);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as ReviewAdminCache;
      if (!parsed?.savedAt || !Array.isArray(parsed.items)) return null;
      if (Date.now() - new Date(parsed.savedAt).getTime() > ADMIN_CACHE_TTL_MS) return null;
      return parsed.items;
    } catch {
      return null;
    }
  };

  const writeCachedItems = (cachedItems: ReviewSnapshot[]) => {
    try {
      window.sessionStorage.setItem(
        ADMIN_CACHE_STORAGE,
        JSON.stringify({ savedAt: new Date().toISOString(), items: cachedItems }),
      );
    } catch {
      // ignore cache write failures
    }
  };

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [items],
  );

  const counts = useMemo(() => {
    const open = sortedItems.filter((item) => item.status === "needs_review" || item.status === "needs_changes" || item.status === "pending").length;
    const approved = sortedItems.filter((item) => item.status === "final_approved").length;
    const blocked = sortedItems.filter((item) => item.status === "blocked").length;
    return { open, approved, blocked, total: sortedItems.length };
  }, [sortedItems]);

  return (
    <section className="mx-auto min-h-screen max-w-7xl px-5 py-10 md:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Review admin</div>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-5xl">Review rounds</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="heroOutline" onClick={generateToken}>
            <Sparkles className="h-4 w-4" />
            Generate token
          </Button>
          <Button variant="heroOutline" onClick={() => void loadItems()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {generatedToken ? (
        <Card className="mb-6 border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Review link</div>
            <div className="break-all rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-700">{`${window.location.origin}/review/${generatedToken}`}</div>
            <div className="flex flex-wrap gap-2">
              <Button variant="hero" asChild>
                <Link to={`/review/${generatedToken}`}>Open review</Link>
              </Button>
              <Button
                variant="heroOutline"
                onClick={async () => {
                  await navigator.clipboard.writeText(`${window.location.origin}/review/${generatedToken}`);
                }}
              >
                <Copy className="h-4 w-4" />
                Copy link
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {!authorized ? (
        <Card className="mb-6 border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
              <LockKeyhole className="h-4 w-4" />
              Admin key
            </div>
            <p className="text-sm leading-7 text-slate-600">Enter the review admin key to load the round overview.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="password"
                value={adminKey}
                onChange={(event) => saveAdminKey(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-300"
                placeholder="Admin key"
              />
              <Button variant="hero" onClick={() => void loadItems(adminKey)}>
                Unlock
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {error ? (
        <Card className="mb-6 border-rose-200 bg-rose-50">
          <CardContent className="p-5 text-rose-700">{error}</CardContent>
        </Card>
      ) : null}

      <div className="mb-6 grid gap-3 md:grid-cols-4">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Total</div>
            <div className="mt-2 text-3xl font-black text-slate-950">{counts.total}</div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">
              <AlertTriangle className="h-4 w-4" />
              Open
            </div>
            <div className="mt-2 text-3xl font-black text-amber-900">{counts.open}</div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              Approved
            </div>
            <div className="mt-2 text-3xl font-black text-emerald-900">{counts.approved}</div>
          </CardContent>
        </Card>
        <Card className="border-rose-200 bg-rose-50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-rose-700">
              <CircleDot className="h-4 w-4" />
              Blocked
            </div>
            <div className="mt-2 text-3xl font-black text-rose-900">{counts.blocked}</div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <Card className="border-slate-200 bg-white">
          <CardContent className="flex items-center gap-3 p-6 text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            Loading review items...
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedItems.length ? (
            sortedItems.map((item) => (
              <Card key={`${item.token}-${item.updatedAt}`} className="border-slate-200 bg-white shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{item.token}</div>
                      <div className="mt-2 text-2xl font-black uppercase tracking-[0.04em] text-slate-950">{item.version}</div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${badgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Current page</div>
                      <div className="mt-2 text-lg font-black uppercase tracking-[0.04em] text-slate-950">{item.currentPageIndex + 1}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Updated</div>
                      <div className="mt-2 text-sm font-medium text-slate-700">{item.updatedAt}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Action</div>
                      <div className="mt-2 flex flex-col gap-2">
                        <Link
                          className="text-sm font-semibold text-blue-700 hover:underline"
                          to={`/review/${item.token}/summary?version=${encodeURIComponent(item.version)}`}
                        >
                          Open summary
                        </Link>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline"
                          onClick={() =>
                            void copyText(`${window.location.origin}/review/${item.token}/summary?version=${encodeURIComponent(item.version)}`)
                          }
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copy summary link
                        </button>
                        <Link
                          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline"
                          to={`/review/${item.token}?version=${encodeURIComponent(incrementReviewVersion(item.version))}`}
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Start {incrementReviewVersion(item.version)}
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-slate-200 bg-white">
              <CardContent className="flex items-center gap-3 p-6 text-slate-600">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                No review rounds found yet.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </section>
  );
};

export default ReviewAdminPage;
