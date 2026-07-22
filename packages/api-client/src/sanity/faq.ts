import type { SanityFaq } from "@ecommerce/types";
import { sanityClient } from "./client";

export async function getFaqs(category?: string): Promise<SanityFaq[]> {
  const filter = category
    ? `*[_type == "faq" && category == $category]`
    : `*[_type == "faq"]`;
  return sanityClient.fetch<SanityFaq[]>(
    `${filter} | order(category asc, order asc) { _id, question, answer, category, order }`,
    { category },
    { next: { revalidate: 300, tags: ["faqs"] } }
  );
}
