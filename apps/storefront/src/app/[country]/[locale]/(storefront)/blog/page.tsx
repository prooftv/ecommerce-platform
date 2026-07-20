import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/client";
import { buildCanonicalUrl } from "@/lib/seo";
import { getStoreUrl } from "@/lib/store";

interface Props {
  params: Promise<{ country: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, locale } = await params;
  const storeUrl = getStoreUrl();
  const canonical = storeUrl
    ? buildCanonicalUrl(storeUrl, `/${country}/${locale}/blog`)
    : undefined;
  return {
    title: "Blog",
    ...(canonical ? { alternates: { canonical } } : {}),
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { country, locale } = await params;
  const basePath = `/${country}/${locale}`;
  const posts = await getBlogPosts(20);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`${basePath}/blog/${post.slug.current}`}
              className="group flex flex-col gap-3"
            >
              {post.coverImage?.asset && (
                <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={urlFor(post.coverImage).width(600).height(338).auto("format").quality(80).url()}
                    alt={post.coverImage.alt ?? post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="flex flex-col gap-1">
                {post.publishedAt && (
                  <time className="text-xs text-gray-400" dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString(locale, {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </time>
                )}
                <h2 className="font-semibold text-gray-900 group-hover:underline">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
