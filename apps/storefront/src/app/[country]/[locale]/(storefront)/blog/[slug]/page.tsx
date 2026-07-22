import type { Metadata } from "next";
import Image from "next/image";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getBlogPost, getBlogPosts } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/client";
import { buildCanonicalUrl } from "@/lib/seo";
import { getStoreUrl } from "@/lib/store";

interface Props {
  params: Promise<{ country: string; locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts(100);
  return posts.map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, locale, slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};

  const storeUrl = getStoreUrl();
  const canonical = storeUrl
    ? buildCanonicalUrl(storeUrl, `/${country}/${locale}/blog/${slug}`)
    : undefined;

  const title = post.seo?.title ?? post.title;
  const description = post.seo?.description ?? post.excerpt;
  const ogImage = post.seo?.ogImage?.asset
    ? urlFor(post.seo.ogImage).width(1200).height(630).auto("format").quality(85).url()
    : post.coverImage?.asset
    ? urlFor(post.coverImage).width(1200).height(630).auto("format").quality(85).url()
    : undefined;

  return {
    title,
    description,
    robots: post.seo?.noIndex ? { index: false, follow: false } : undefined,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      ...(canonical ? { url: canonical } : {}),
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { country, locale, slug } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  const post = await getBlogPost(slug, isDraftMode);
  if (!post) notFound();

  const storeUrl = getStoreUrl();
  const canonical = storeUrl
    ? buildCanonicalUrl(storeUrl, `/${country}/${locale}/blog/${slug}`)
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt,
    ...(post.author ? { author: { "@type": "Person", name: post.author.name } } : {}),
    ...(canonical ? { url: canonical } : {}),
  };

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {post.coverImage?.asset && (
        <div className="relative aspect-video overflow-hidden rounded-xl mb-8 bg-gray-100">
          <Image
            src={urlFor(post.coverImage).width(1200).height(675).auto("format").quality(85).url()}
            alt={post.coverImage.alt ?? post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString(locale, {
                year: "numeric", month: "long", day: "numeric",
              })}
            </time>
          )}
          {post.author && <span>· {post.author.name}</span>}
        </div>
      </header>
      {post.body && (
        <div className="prose prose-gray max-w-none">
          <PortableText value={post.body as Parameters<typeof PortableText>[0]["value"]} />
        </div>
      )}
    </article>
  );
}
