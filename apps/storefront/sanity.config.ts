import { CogIcon, DocumentIcon, HomeIcon, LinkIcon, UsersIcon } from "@sanity/icons";
import { colorInput } from "@sanity/color-input";
import { defineConfig } from "sanity";
import { structureTool, type StructureResolver } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "../../sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const structure: StructureResolver = (S) =>
  S.list()
    .title("Platform")
    .items([
      S.listItem()
        .title("Site Settings")
        .icon(CogIcon)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Homepage")
        .icon(HomeIcon)
        .child(S.document().schemaType("homepage").documentId("homepage")),
      S.divider(),
      S.listItem()
        .title("Content")
        .icon(DocumentIcon)
        .child(
          S.list()
            .title("Content")
            .items([
              S.documentTypeListItem("blogPost").title("Blog Posts"),
              S.documentTypeListItem("landingPage").title("Landing Pages"),
              S.documentTypeListItem("page").title("Pages"),
              S.documentTypeListItem("faq").title("FAQs"),
            ])
        ),
      S.listItem()
        .title("People")
        .icon(UsersIcon)
        .child(
          S.list()
            .title("People")
            .items([
              S.documentTypeListItem("teamMember").title("Team Members"),
              S.documentTypeListItem("testimonial").title("Testimonials"),
            ])
        ),
      S.divider(),
      S.listItem()
        .title("Site")
        .icon(LinkIcon)
        .child(
          S.list()
            .title("Site")
            .items([
              S.documentTypeListItem("navigationMenu").title("Navigation Menus"),
              S.documentTypeListItem("announcementBar").title("Announcement Bars"),
              S.documentTypeListItem("redirect").title("Redirects"),
            ])
        ),
    ]);

export default defineConfig({
  name: "ecommerce-platform",
  title: "Ecommerce Platform",
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
    colorInput(),
  ],
  schema: { types: schemaTypes },
});
