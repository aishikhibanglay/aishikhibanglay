import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

interface DbPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  status: string;
}

interface EditablePageProps {
  slug: string;
  fallback: React.ReactNode;
}

/**
 * Tries to load page content from the DB.
 * If found (and published), renders it with the TipTap prose styles.
 * If not found or still loading, renders the fallback (hardcoded) content.
 */
export function EditablePage({ slug, fallback }: EditablePageProps) {
  const [page, setPage] = useState<DbPage | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch(`/api/pages/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: DbPage | null) => {
        if (data && data.status === "published") setPage(data);
      })
      .catch(() => {})
      .finally(() => setChecked(true));
  }, [slug]);

  if (!checked) return null;

  if (page) {
    return (
      <>
        <Helmet>
          <title>{page.title} — AI শিখি বাংলায়</title>
          {page.metaDescription && <meta name="description" content={page.metaDescription} />}
        </Helmet>
        <div className="min-h-screen py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">{page.title}</h1>
            <div
              className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:text-primary
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-p:text-foreground/90 prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </div>
      </>
    );
  }

  return <>{fallback}</>;
}
