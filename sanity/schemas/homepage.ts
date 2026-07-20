import { defineArrayMember, defineField, defineType } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          validation: (R) => R.required(),
        }),
        defineField({
          name: "subheading",
          title: "Subheading",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "cta",
          title: "Call to action",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", title: "Label" }),
            defineField({ name: "href", type: "string", title: "Link" }),
          ],
        }),
        defineField({
          name: "secondaryCta",
          title: "Secondary call to action",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", title: "Label" }),
            defineField({ name: "href", type: "string", title: "Link" }),
          ],
        }),
        defineField({
          name: "image",
          title: "Background / hero image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alt text",
              validation: (R) => R.required().error("Alt text is required for accessibility"),
            }),
          ],
        }),
        defineField({
          name: "overlayOpacity",
          title: "Image overlay opacity (0–100)",
          type: "number",
          initialValue: 40,
          validation: (R) => R.min(0).max(100),
        }),
      ],
    }),
    defineField({
      name: "featuredCategories",
      title: "Featured categories",
      type: "array",
      description: "Spree taxon slugs to feature on the homepage.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", title: "Display label" }),
            defineField({ name: "spreeSlug", type: "string", title: "Spree taxon permalink" }),
            defineField({
              name: "image",
              type: "image",
              title: "Category image",
              options: { hotspot: true },
              fields: [
                defineField({ name: "alt", type: "string", title: "Alt text", validation: (R) => R.required() }),
              ],
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "spreeSlug" },
          },
        }),
      ],
    }),
    defineField({
      name: "promotionalBanner",
      title: "Promotional banner",
      type: "object",
      fields: [
        defineField({ name: "enabled", type: "boolean", title: "Show banner", initialValue: false }),
        defineField({ name: "text", type: "string", title: "Banner text" }),
        defineField({ name: "href", type: "string", title: "Link (optional)" }),
        defineField({ name: "backgroundColor", type: "string", title: "Background colour (hex)", initialValue: "#000000" }),
        defineField({ name: "textColor", type: "string", title: "Text colour (hex)", initialValue: "#ffffff" }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});
