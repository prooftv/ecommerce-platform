import type { SanitySiteSettings, SanityNavigationMenu, SanityAnnouncementBar } from "@ecommerce/types";
import { sanityClient } from "./client";

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
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

export async function getNavigationMenu(identifier: string): Promise<SanityNavigationMenu | null> {
  return sanityClient.fetch<SanityNavigationMenu>(
    `*[_type == "navigationMenu" && identifier == $identifier][0]{
      _id, identifier,
      items[] { label, href, children[] { label, href } }
    }`,
    { identifier },
    { next: { revalidate: 300, tags: ["navigation"] } }
  );
}

export async function getActiveAnnouncementBar(): Promise<SanityAnnouncementBar | null> {
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
