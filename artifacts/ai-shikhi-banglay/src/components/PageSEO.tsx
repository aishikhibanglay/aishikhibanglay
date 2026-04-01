import { Helmet } from "react-helmet-async";

const SITE_NAME = "AI শিখি বাংলায়";
const BASE_URL = "https://aishikhibanglay.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/opengraph.jpg`;
const DEFAULT_DESCRIPTION =
  "বাংলায় AI শিখুন — ChatGPT, Gemini, Midjourney সহ সব AI টুলসের সহজ গাইড। ভিডিও, আর্টিকেল ও ফ্রি রিসোর্স।";

interface PageSEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
}

export function PageSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noIndex = false,
}: PageSEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | বাংলায় AI শিখুন`;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={fullTitle} />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
