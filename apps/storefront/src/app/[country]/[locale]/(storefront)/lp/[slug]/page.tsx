import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getLandingPage } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/client";
import { buildCanonicalUrl } from "@/lib/seo";
import { getStoreUrl } from "@/lib/store";

interface Props {
  params: Promise<{ country: string; locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, locale, slug } = await params;
  const page = await getLandingPage(slug);
  if (!page) return {};

  const storeUrl = getStoreUrl();
  const canonical = storeUrl
    ? buildCanonicalUrl(storeUrl, `/${country}/${locale}/lp/${slug}`)
    : undefined;

  const title = page.seo?.title ?? page.title;
  const description = page.seo?.description;
  const ogImage = page.seo?.ogImage?.asset
    ? urlFor(page.seo.ogImage).width(1200).height(630).auto("format").quality(85).url()
    : undefined;

  return {
    title,
    description,
    robots: page.seo?.noIndex ? { index: false, follow: false } : undefined,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title,
      description,
      ...(canonical ? { url: canonical } : {}),
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
  };
}

export default async function LandingPage({ params }: Props) {
  const { slug } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  const page = await getLandingPage(slug, isDraftMode);
  if (!page) notFound();

  return (
    <div>
      {(page.sections as Array<{ _type: string; _key: string; [k: string]: unknown }> ?? []).map(
        (section) => (
          <section key={section._key} data-section-type={section._type}>
            {/* Section renderers will be added per type as content is built */}
            <pre className="hidden">{JSON.stringify(section, null, 2)}</pre>
          </section>
        )
      )}
      {(!page.sections || (page.sections as unknown[]).length === 0) && (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h1 className="text-3xl font-bold">{page.title}</h1>
        </div>
      )}
    </div>
  );
}
