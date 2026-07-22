import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { PortableText } from "@portabletext/react";
import { getFaqs } from "@/lib/sanity/queries";
import { buildCanonicalUrl } from "@/lib/seo";
import { getStoreUrl } from "@/lib/store";
import type { SanityFaq } from "@/lib/sanity/types";

interface Props {
  params: Promise<{ country: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, locale } = await params;
  const storeUrl = getStoreUrl();
  const canonical = storeUrl
    ? buildCanonicalUrl(storeUrl, `/${country}/${locale}/faq`)
    : undefined;
  return {
    title: "FAQ",
    description: "Frequently asked questions",
    ...(canonical ? { alternates: { canonical } } : {}),
  };
}

export default async function FaqPage() {
  const { isEnabled: isDraftMode } = await draftMode();
  const faqs = await getFaqs(undefined, isDraftMode);

  const grouped = faqs.reduce<Record<string, SanityFaq[]>>((acc, faq) => {
    const key = faq.category ?? "General";
    (acc[key] ??= []).push(faq);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-10">Frequently Asked Questions</h1>
      {Object.keys(grouped).length === 0 ? (
        <p className="text-gray-500">No FAQs yet.</p>
      ) : (
        <div className="flex flex-col gap-12">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category}>
              <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                {category}
              </h2>
              <dl className="flex flex-col gap-6">
                {items.map((faq) => (
                  <div key={faq._id}>
                    <dt className="font-medium text-gray-900 mb-2">{faq.question}</dt>
                    <dd className="text-gray-600 prose prose-gray prose-sm max-w-none">
                      <PortableText value={faq.answer as Parameters<typeof PortableText>[0]["value"]} />
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
