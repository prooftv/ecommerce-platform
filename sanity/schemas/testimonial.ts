import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", title: "Quote", type: "text", rows: 4, validation: (R) => R.required() }),
    defineField({ name: "authorName", title: "Author name", type: "string", validation: (R) => R.required() }),
    defineField({ name: "authorTitle", title: "Author title / company", type: "string" }),
    defineField({
      name: "authorPhoto",
      title: "Author photo",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "rating",
      title: "Rating (1–5)",
      type: "number",
      validation: (R) => R.min(1).max(5),
      initialValue: 5,
    }),
    defineField({ name: "featured", title: "Featured on homepage", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 0 }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "authorName", subtitle: "quote" },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle?.slice(0, 60) + (subtitle?.length > 60 ? "…" : ""),
    }),
  },
});
