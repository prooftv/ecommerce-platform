import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage")
        .child(
          S.document().schemaType("homepage").documentId("homepage")
        ),
      S.divider(),
      S.documentTypeListItem("blogPost").title("Blog Posts"),
      S.documentTypeListItem("faq").title("FAQs"),
      S.documentTypeListItem("page").title("Pages"),
      S.divider(),
      S.documentTypeListItem("navigationMenu").title("Navigation"),
      S.documentTypeListItem("announcementBar").title("Announcement Bars"),
    ]);
