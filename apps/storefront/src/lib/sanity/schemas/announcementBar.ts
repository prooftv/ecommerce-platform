import { defineField, defineType } from "sanity";

export const announcementBar = defineType({
  name: "announcementBar",
  title: "Announcement Bar",
  type: "document",
  fields: [
    defineField({ name: "text", title: "Message", type: "string", validation: (R) => R.required() }),
    defineField({ name: "href", title: "Link (optional)", type: "string" }),
    defineField({ name: "linkLabel", title: "Link label", type: "string" }),
    defineField({ name: "backgroundColor", title: "Background colour", type: "color", initialValue: { hex: "#111827" } }),
    defineField({ name: "textColor", title: "Text colour", type: "color", initialValue: { hex: "#ffffff" } }),
    defineField({
      name: "dismissible",
      title: "Dismissible",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "startsAt",
      title: "Show from",
      type: "datetime",
    }),
    defineField({
      name: "endsAt",
      title: "Show until",
      type: "datetime",
    }),
  ],
  preview: {
    select: { title: "text", subtitle: "active" },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle ? "Active" : "Inactive",
    }),
  },
});
