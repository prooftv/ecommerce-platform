import { defineArrayMember, defineField, defineType } from "sanity";

const navItem = defineArrayMember({
  name: "navItem",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", title: "Label", validation: (R) => R.required() }),
    defineField({ name: "href", type: "string", title: "Link" }),
    defineField({
      name: "children",
      title: "Dropdown items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", title: "Label", validation: (R) => R.required() }),
            defineField({ name: "href", type: "string", title: "Link", validation: (R) => R.required() }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const navigationMenu = defineType({
  name: "navigationMenu",
  title: "Navigation Menu",
  type: "document",
  fields: [
    defineField({
      name: "identifier",
      title: "Identifier",
      type: "string",
      description: "Used in code to fetch this menu. E.g. 'header', 'footer-main', 'footer-legal'",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [navItem],
    }),
  ],
  preview: {
    select: { title: "identifier" },
  },
});
