import type { SanityBlogPost } from "@ecommerce/types";
import { sanityClient } from "./client";

export async function getBlogPosts(limit = 10): Promise<SanityBlogPost[]> {
  return sanityClient.fetch<SanityBlogPost[]>(
    `*[_type == "blogPost"] | order(publishedAt desc) [0...$limit] {
      _id, title, slug, publishedAt, excerpt, categories,
      author { name, image { ..., asset->{ _id, url }, alt } },
      coverImage { ..., asset->{ _id, url }, alt },
      seo { title, description, ogImage { ..., asset->{ _id, url }, alt }, noIndex }
    }`,
    { limit },
    { next: { revalidate: 60, tags: ["blog"] } }
  );
}

export async function getBlogPost(slug: string): Promise<SanityBlogPost | null> {
  return sanityClient.fetch<SanityBlogPost>(
    `*[_type == "blogPost" && slug.current == $slug][0]{
      _id, title, slug, publishedAt, excerpt, categories, body,
      author { name, image { ..., asset->{ _id, url }, alt } },
      coverImage { ..., asset->{ _id, url }, alt },
      seo { title, description, ogImage { ..., asset->{ _id, url }, alt }, noIndex }
    }`,
    { slug },
    { next: { revalidate: 60, tags: [`blog:${slug}`] } }
  );
}
