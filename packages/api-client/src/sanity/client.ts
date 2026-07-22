// Sanity client for use in server-side code only.
// Never import this in client components.

import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImage } from "@ecommerce/types/sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "52t49djs";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2024-01-01";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImage) {
  return builder.image(source);
}
