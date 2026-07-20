import { isSanityConfigured, sanityClient } from "./client";
import type {
  SanityAnnouncementBar,
  SanityBlogPost,
  SanityFaq,
  SanityHomepage,
  SanityNavigationMenu,
  SanityPage,
} from "./types";

// ─── Homepage ────────────────────────────────────────────────────────────────

export async function getHomepage(): Promise<SanityHomepage | null> {
  if (!isSanityConfigured()) return null;
  return sanityClient.fetch<SanityHomepage>(
    `*[_type == "homepage" && _id == "homepage"][0]{
      _id,
      hero {
        heading, subheading,
        cta { label, href },
        secondaryCta { label, href },
        image { ..., asset->{ _id, url }, alt },
        overlayOpacity
      },
      featuredCategories[] {
        label, spreeSlug,
        image { ..., asset->{ _id, url }, alt }
      },
      promotionalBanner { enabled, text, href, backgroundColor, textColor },
      seo { title, description, ogImage { ..., asset->{ _id, url }, alt }, noIndex }
    }`,
    {},
    { next: { revalidate: 60, tags: ["homepage"] } }
  );
}

// ─── Announcement bar ────────────────────────────────────────────────────────

export async function getActiveAnnouncementBar(): Promise<SanityAnnouncementBar | null> {
  if (!isSanityConfigured()) return null;
  const now = new Date().toISOString();
  return sanityClient.fetch<SanityAnnouncementBar>(
    `*[_type == "announcementBar" && active == true
      && (startsAt == null || startsAt <= $now)
      && (endsAt == null || endsAt >= $now)
    ] | order(_updatedAt desc) [0]`,
    { now },
    { next: { revalidate: 60, tags: ["announcementBar"] } }
  );
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export async function getNavigationMenu(
  identifier: string
): Promise<SanityNavigationMenu | null> {
  if (!isSanityConfigured()) return null;
  return sanityClient.fetch<SanityNavigationMenu>(
    `*[_type == "navigationMenu" && identifier == $identifier][0]{
      _id, identifier,
      items[] { label, href, children[] { label, href } }
    }`,
    { identifier },
    { next: { revalidate: 300, tags: ["navigation"] } }
  );
}

// ─── Blog ────────────────────────────────────────────────────────────────────

export async function getBlogPosts(limit = 10): Promise<SanityBlogPost[]> {
  if (!isSanityConfigured()) return [];
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
  if (!isSanityConfigured()) return null;
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

// ─── FAQs ────────────────────────────────────────────────────────────────────

export async function getFaqs(category?: string): Promise<SanityFaq[]> {
  if (!isSanityConfigured()) return [];
  const filter = category
    ? `*[_type == "faq" && category == $category]`
    : `*[_type == "faq"]`;
  return sanityClient.fetch<SanityFaq[]>(
    `${filter} | order(category asc, order asc) { _id, question, answer, category, order }`,
    { category },
    { next: { revalidate: 300, tags: ["faqs"] } }
  );
}

// ─── Pages ───────────────────────────────────────────────────────────────────

export async function getPage(slug: string): Promise<SanityPage | null> {
  if (!isSanityConfigured()) return null;
  return sanityClient.fetch<SanityPage>(
    `*[_type == "page" && slug.current == $slug][0]{
      _id, title, slug, body,
      seo { title, description, ogImage { ..., asset->{ _id, url }, alt }, noIndex }
    }`,
    { slug },
    { next: { revalidate: 300, tags: [`page:${slug}`] } }
  );
}
