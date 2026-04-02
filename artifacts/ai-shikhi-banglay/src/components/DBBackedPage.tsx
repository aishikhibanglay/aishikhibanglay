import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { SYSTEM_PAGE_CONTENT } from "@/lib/systemPages";

interface DBBackedPageProps {
  slug: string;
}

const CACHE_TTL = 5 * 60 * 1000;

function getCached(slug: string) {
  try {
    const raw = sessionStorage.getItem(`page:${slug}`);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) { sessionStorage.removeItem(`page:${slug}`); return null; }
    return data as { title: string; content: string; meta: string };
  } catch { return null; }
}

function setCache(slug: string, data: { title: string; content: string; meta: string }) {
  try { sessionStorage.setItem(`page:${slug}`, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

export function DBBackedPage({ slug }: DBBackedPageProps) {
  const defaults = SYSTEM_PAGE_CONTENT[slug];

  const cached = getCached(slug);
  const [title, setTitle] = useState(cached?.title ?? defaults?.title ?? slug);
  const [content, setContent] = useState(cached?.content ?? defaults?.html ?? "");
  const [meta, setMeta] = useState(cached?.meta ?? defaults?.meta ?? "");

  useEffect(() => {
    if (cached) return;

    fetch(`/api/pages/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((page) => {
        if (page.status === "published") {
          const d = { title: page.title, content: page.content, meta: page.metaDescription || "" };
          setTitle(d.title);
          setContent(d.content);
          setMeta(d.meta);
          setCache(slug, d);
        }
      })
      .catch(() => {});
  }, [slug]);

  return (
    <>
      <Helmet>
        <title>{title} — AI শিখি বাংলায়</title>
        {meta && <meta name="description" content={meta} />}
      </Helmet>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{title}</h1>
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </>
  );
}
