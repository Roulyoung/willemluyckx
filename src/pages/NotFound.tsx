import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { topFitSiteConfig } from "@/lib/siteConfig";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(23,120,242,0.16),_transparent_36%),linear-gradient(180deg,#f8fbff_0%,#ffffff_22%,#f8fbff_100%)] px-6">
      <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{topFitSiteConfig.brandName}</p>
        <h1 className="mt-4 text-5xl font-black uppercase tracking-[0.04em]">404</h1>
        <p className="mt-3 text-lg text-slate-600">Deze pagina bestaat niet op {topFitSiteConfig.domain}.</p>
        <div className="mt-8 flex justify-center">
          <Button asChild>
            <Link to="/nl">Terug naar home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
