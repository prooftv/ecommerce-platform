import type { Metadata } from "next";
import { buildCanonicalUrl, SOCIAL_IMAGE_PATH } from "@/lib/seo";
import { getHomepage } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/client";
import {
  getStoreMetaDescription,
  getStoreSeoTitle,
  getStoreUrl,
} from "@/lib/store";

interface HomeMetadataParams {
  country: string;
  locale: string;
}

export async function generateHomeMetadata({
  country,
  locale,
}: HomeMetadataParams): Promise<Metadata> {
  const [homepage, storeTitle, storeDescription, storeUrl] = await Promise.all([
    getHomepage(),
    Promise.resolve(getStoreSeoTitle()),
    Promise.resolve(getStoreMetaDescription()),
    Promise.resolve(getStoreUrl()),
  ]);

  const seo = homepage?.seo;
  const title = seo?.title ?? storeTitle;
  const description = seo?.description ?? storeDescription;
  const canonicalUrl = storeUrl
    ? buildCanonicalUrl(storeUrl, `/${country}/${locale}`)
    : undefined;

  const ogImage =
    seo?.ogImage?.asset
      ? urlFor(seo.ogImage).width(1200).height(630).auto("format").quality(85).url()
      : SOCIAL_IMAGE_PATH;

  return {
    title: { absolute: title },
    description,
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    openGraph: {
      title,
      description,
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
