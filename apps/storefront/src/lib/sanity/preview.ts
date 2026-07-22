import { createClient } from "@sanity/client";
import { projectId, dataset } from "./client";

// Draft client — used only when Next.js draft mode is active.
// Never use this client in production page renders.
export const draftClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: "previewDrafts",
  stega: false,
});

export function getPreviewSecret(): string {
  const secret = process.env.SANITY_PREVIEW_SECRET;
  if (!secret) throw new Error("SANITY_PREVIEW_SECRET is not set");
  return secret;
}
