import { defineField, defineType } from "sanity";

export const redirect = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  fields: [
    defineField({
      name: "source",
      title: "From (source path)",
      type: "string",
      description: "Relative path, e.g. /old-page or /old-category/item",
      validation: (R) =>
        R.required().custom((val: string | undefined) => {
          if (!val) return true;
          return val.startsWith("/") ? true : "Path must start with /";
        }),
    }),
    defineField({
      name: "destination",
      title: "To (destination)",
      type: "string",
      description: "Relative path or full URL.",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "permanent",
      title: "Permanent (301)",
      type: "boolean",
      description: "Use 301 for permanent redirects, 302 for temporary.",
      initialValue: true,
    }),
    defineField({ name: "notes", title: "Notes", type: "string", description: "Internal reference only." }),
  ],
  preview: {
    select: { title: "source", subtitle: "destination" },
    prepare: ({ title, subtitle }) => ({ title, subtitle: `→ ${subtitle}` }),
  },
});
