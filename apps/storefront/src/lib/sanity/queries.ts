import { isSanityConfigured, sanityClient } from "./client";
import type {
  SanityAnnouncementBar,
  SanityBlogPost,
  SanityFaq,
  SanityHomepage,
  SanityLandingPage,
  SanityNavigationMenu,
  SanityPage,
  SanitySiteSettings,
  SanityTeamMember,
  SanityTestimonial,
  SanityRedirect,
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

// ─── Site Settings ───────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  if (!isSanityConfigured()) return null;
  return sanityClient.fetch<SanitySiteSettings>(
    `*[_type == "siteSettings" && _id == "siteSettings"][0]{
      _id, storeName, storeTagline, footerCopyright,
      contactEmail, contactPhone, address,
      logo { ..., asset->{ _id, url }, alt },
      logoDark { ..., asset->{ _id, url }, alt },
      favicon { ..., asset->{ _id, url } },
      socialLinks[] { platform, url },
      defaultSeo { title, description, ogImage { ..., asset->{ _id, url }, alt }, noIndex },
      schemaOrg { legalName, foundingYear, url }
    }`,
    {},
    { next: { revalidate: 300, tags: ["siteSettings"] } }
  );
}

// ─── Team ────────────────────────────────────────────────────────────────────

export async function getTeamMembers(): Promise<SanityTeamMember[]> {
  if (!isSanityConfigured()) return [];
  return sanityClient.fetch<SanityTeamMember[]>(
    `*[_type == "teamMember"] | order(order asc) {
      _id, name, role, bio, order,
      photo { ..., asset->{ _id, url }, alt },
      socialLinks[] { platform, url }
    }`,
    {},
    { next: { revalidate: 300, tags: ["team"] } }
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────

export async function getTestimonials(featuredOnly = false): Promise<SanityTestimonial[]> {
  if (!isSanityConfigured()) return [];
  const filter = featuredOnly
    ? `*[_type == "testimonial" && featured == true]`
    : `*[_type == "testimonial"]`;
  return sanityClient.fetch<SanityTestimonial[]>(
    `${filter} | order(order asc) {
      _id, quote, authorName, authorTitle, rating, featured, order,
      authorPhoto { ..., asset->{ _id, url }, alt }
    }`,
    {},
    { next: { revalidate: 300, tags: ["testimonials"] } }
  );
}

// ─── Redirects ───────────────────────────────────────────────────────────────

export async function getRedirects(): Promise<SanityRedirect[]> {
  if (!isSanityConfigured()) return [];
  return sanityClient.fetch<SanityRedirect[]>(
    `*[_type == "redirect"] { _id, source, destination, permanent }`,
    {},
    { next: { revalidate: 60, tags: ["redirects"] } }
  );
}

// ─── Landing Pages ───────────────────────────────────────────────────────────

export async function getLandingPage(slug: string): Promise<SanityLandingPage | null> {
  if (!isSanityConfigured()) return null;
  return sanityClient.fetch<SanityLandingPage>(
    `*[_type == "landingPage" && slug.current == $slug][0]{
      _id, title, slug, sections,
      seo { title, description, ogImage { ..., asset->{ _id, url }, alt }, noIndex }
    }`,
    { slug },
    { next: { revalidate: 60, tags: [`landingPage:${slug}`] } }
  );
}
