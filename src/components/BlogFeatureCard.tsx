import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getBlogMedia } from "@/lib/blogMedia";
import { type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type BlogFeatureCardProps = {
  locale: Locale;
  post: {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
  };
  className?: string;
  imageHeightClassName?: string;
};

export const BlogFeatureCard = ({
  locale,
  post,
  className,
  imageHeightClassName = "min-h-[19rem]",
}: BlogFeatureCardProps) => {
  const media = getBlogMedia(post.slug);

  return (
    <Link
      to={`/${locale}/blog/${post.slug}`}
      className={cn(
        "group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg",
        className,
      )}
    >
      <div className={cn("relative overflow-hidden", imageHeightClassName)}>
        <img
          src={media.imageSrc}
          alt={media.imageAlt}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,26,58,0.06)_0%,rgba(8,26,58,0.16)_35%,rgba(8,26,58,0.86)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,26,58,0.58)_0%,rgba(8,26,58,0.18)_55%,rgba(8,26,58,0.06)_100%)]" />

        <div className={cn("relative flex flex-col justify-between p-5", imageHeightClassName)}>
          <div className="flex items-center justify-between gap-3">
            <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white backdrop-blur-sm">
              {post.category}
            </div>
            <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/90 backdrop-blur-sm">
              {post.readTime}
            </div>
          </div>

          <div className="max-w-[18rem] space-y-3">
            <h2 className="text-2xl font-black uppercase tracking-[0.04em] text-white [text-shadow:0_10px_30px_rgba(8,26,58,0.45)]">
              {post.title}
            </h2>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <p className="text-sm leading-7 text-slate-600">{post.excerpt}</p>
        <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
          {locale === "en" ? "Read article" : "Lees artikel"}
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};
