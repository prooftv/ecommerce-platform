import { defineField, defineType } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "portableText",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Orders", value: "orders" },
          { title: "Shipping", value: "shipping" },
          { title: "Returns", value: "returns" },
          { title: "Payments", value: "payments" },
          { title: "Account", value: "account" },
          { title: "Products", value: "products" },
          { title: "General", value: "general" },
        ],
      },
      initialValue: "general",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: "Category + Order", name: "categoryOrder", by: [{ field: "category", direction: "asc" }, { field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "question", subtitle: "category" },
  },
});
