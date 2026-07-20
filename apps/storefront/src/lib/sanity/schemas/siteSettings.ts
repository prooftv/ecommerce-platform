import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "storeName",
      title: "Store name",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "storeTagline",
      title: "Tagline",
      type: "string",
      description: "Short brand statement shown in footer and meta fallbacks.",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: false },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt text", validation: (R) => R.required() }),
      ],
    }),
    defineField({
      name: "logoDark",
      title: "Logo (dark variant)",
      type: "image",
      description: "Used on light backgrounds. Falls back to logo if not set.",
      options: { hotspot: false },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt text" }),
      ],
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      description: "Square image, minimum 512×512px.",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              title: "Platform",
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "Facebook", value: "facebook" },
                  { title: "X / Twitter", value: "twitter" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "YouTube", value: "youtube" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "Pinterest", value: "pinterest" },
                ],
              },
              validation: (R) => R.required(),
            }),
            defineField({ name: "url", type: "url", title: "URL", validation: (R) => R.required() }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
    }),
    defineField({
      name: "contactPhone",
      title: "Contact phone",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Physical address",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "footerCopyright",
      title: "Footer copyright text",
      type: "string",
      description: "E.g. '© 2025 Store Name. All rights reserved.'",
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      description: "Fallback SEO used when a page has no specific SEO set.",
      type: "seo",
    }),
    defineField({
      name: "schemaOrg",
      title: "Schema.org organisation",
      type: "object",
      description: "Used for JSON-LD structured data.",
      fields: [
        defineField({ name: "legalName", type: "string", title: "Legal name" }),
        defineField({ name: "foundingYear", type: "number", title: "Founding year" }),
        defineField({ name: "url", type: "url", title: "Website URL" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
