import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { SYSTEM_PAGE_CONTENT } from "@/lib/systemPages";

interface DBBackedPageProps {
  slug: string;
}

export function DBBackedPage({ slug }: DBBackedPageProps) {
  const defaults = SYSTEM_PAGE_CONTENT[slug];
  const [title, setTitle] = useState(defaults?.title ?? slug);
  const [content, setContent] = useState(defaults?.html ?? "");
  const [meta, setMeta] = useState(defaults?.meta ?? "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const d = SYSTEM_PAGE_CONTENT[slug];
    setTitle(d?.title ?? slug);
    setContent(d?.html ?? "");
    setMeta(d?.meta ?? "");

    fetch(`/api/pages/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((page) => {
        if (page.status === "published") {
          setTitle(page.title);
          setContent(page.content);
          setMeta(page.metaDescription || "");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">লোড হচ্ছে...</div>
      </div>
    );
  }

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
