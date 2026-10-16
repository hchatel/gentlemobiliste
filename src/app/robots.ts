import type { MetadataRoute } from "next";

import { absoluteUrl, isFallbackSiteUrl } from "@/lib/seo/site";

const robots = (): MetadataRoute.Robots => {
  // Sans NEXT_PUBLIC_SITE_URL, le build utilise un domaine factice : on
  // empêche l'indexation plutôt que de publier des URL canoniques invalides.
  if (isFallbackSiteUrl) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
};

export default robots;
