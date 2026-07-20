import { defineArrayMember, defineField, defineType } from "sanity";

const heroSection = defineArrayMember({
  name: "heroSection",
  type: "object",
  title: "Hero",
  fields: [
    defineField({ name: "heading", type: "string", title: "Heading", validation: (R) => R.required() }),
    defineField({ name: "subheading", type: "text", title: "Subheading", rows: 2 }),
    defineField({
      name: "cta",
      type: "object",
      title: "CTA",
      fields: [
        defineField({ name: "label", type: "string", title: "Label" }),
        defineField({ name: "href", type: "string", title: "Link" }),
      ],
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text", validation: (R) => R.required() })],
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: `Hero: ${title}` }) },
});

const featuresSection = defineArrayMember({
  name: "featuresSection",
  type: "object",
  title: "Features",
  fields: [
    defineField({ name: "heading", type: "string", title: "Section heading" }),
    defineField({
      name: "features",
      type: "array",
      title: "Features",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", title: "Title", validation: (R) => R.required() }),
            defineField({ name: "description", type: "text", title: "Description", rows: 2 }),
            defineField({ name: "icon", type: "string", title: "Icon name (lucide-react)" }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: `Features: ${title ?? ""}` }) },
});

const testimonialsSection = defineArrayMember({
  name: "testimonialsSection",
  type: "object",
  title: "Testimonials",
  fields: [
    defineField({ name: "heading", type: "string", title: "Section heading" }),
    defineField({
      name: "testimonials",
      type: "array",
      title: "Testimonials",
      of: [defineArrayMember({ type: "reference", to: [{ type: "testimonial" }] })],
    }),
  ],
  preview: { prepare: () => ({ title: "Testimonials" }) },
});

const ctaBandSection = defineArrayMember({
  name: "ctaBandSection",
  type: "object",
  title: "CTA Band",
  fields: [
    defineField({ name: "heading", type: "string", title: "Heading", validation: (R) => R.required() }),
    defineField({ name: "subheading", type: "string", title: "Subheading" }),
    defineField({
      name: "cta",
      type: "object",
      title: "CTA",
      fields: [
        defineField({ name: "label", type: "string", title: "Label" }),
        defineField({ name: "href", type: "string", title: "Link" }),
      ],
    }),
    defineField({ name: "backgroundColor", type: "string", title: "Background colour (hex)", initialValue: "#111827" }),
    defineField({ name: "textColor", type: "string", title: "Text colour (hex)", initialValue: "#ffffff" }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: `CTA: ${title}` }) },
});

const richTextSection = defineArrayMember({
  name: "richTextSection",
  type: "object",
  title: "Rich Text",
  fields: [
    defineField({ name: "body", type: "portableText", title: "Content" }),
  ],
  preview: { prepare: () => ({ title: "Rich Text" }) },
});

export const landingPage = defineType({
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [heroSection, featuresSection, testimonialsSection, ctaBandSection, richTextSection],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
    prepare: ({ title, subtitle }) => ({ title, subtitle: `/lp/${subtitle}` }),
  },
});
