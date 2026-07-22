import type { SanityPage, SanityLandingPage } from "@ecommerce/types";
import { sanityClient } from "./client";

export async function getPage(slug: string): Promise<SanityPage | null> {
  return sanityClient.fetch<SanityPage>(
    `*[_type == "page" && slug.current == $slug][0]{
      _id, title, slug, body,
      seo { title, description, ogImage { ..., asset->{ _id, url }, alt }, noIndex }
    }`,
    { slug },
    { next: { revalidate: 300, tags: [`page:${slug}`] } }
  );
}

export async function getLandingPage(slug: string): Promise<SanityLandingPage | null> {
  return sanityClient.fetch<SanityLandingPage>(
    `*[_type == "landingPage" && slug.current == $slug][0]{
      _id, title, slug, sections,
      seo { title, description, ogImage { ..., asset->{ _id, url }, alt }, noIndex }
    }`,
    { slug },
    { next: { revalidate: 60, tags: [`landingPage:${slug}`] } }
  );
}
