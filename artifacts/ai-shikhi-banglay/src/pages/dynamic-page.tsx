import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { PageSEO } from "@/components/PageSEO";
import { Helmet } from "react-helmet-async";

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  status: string;
}

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    fetch(`/api/pages/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data) => {
        setPage(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-muted-foreground">লোড হচ্ছে...</div>
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">পেজ পাওয়া যায়নি</h1>
        <p className="text-muted-foreground">এই পেজটি বিদ্যমান নেই অথবা প্রকাশিত হয়নি।</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{page.title} — AI শিখি বাংলায়</title>
        {page.metaDescription && <meta name="description" content={page.metaDescription} />}
      </Helmet>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{page.title}</h1>
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </>
  );
}
