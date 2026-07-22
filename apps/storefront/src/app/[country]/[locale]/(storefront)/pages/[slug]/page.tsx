import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getPage } from "@/lib/sanity/queries";
import { buildCanonicalUrl } from "@/lib/seo";
import { getStoreUrl } from "@/lib/store";

interface Props {
  params: Promise<{ country: string; locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, locale, slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};

  const storeUrl = getStoreUrl();
  const canonical = storeUrl
    ? buildCanonicalUrl(storeUrl, `/${country}/${locale}/pages/${slug}`)
    : undefined;

  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.description,
    robots: page.seo?.noIndex ? { index: false, follow: false } : undefined,
    ...(canonical ? { alternates: { canonical } } : {}),
  };
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  const page = await getPage(slug, isDraftMode);
  if (!page) notFound();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">{page.title}</h1>
      {page.body && (
        <div className="prose prose-gray max-w-none">
          <PortableText value={page.body as Parameters<typeof PortableText>[0]["value"]} />
        </div>
      )}
    </div>
  );
}
