import { CogIcon } from "@sanity/icons/Cog";
import { DocumentIcon } from "@sanity/icons/Document";
import { HomeIcon } from "@sanity/icons/Home";
import { LinkIcon } from "@sanity/icons/Link";
import { UsersIcon } from "@sanity/icons/Users";
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Platform")
    .items([
      // ── Singletons ──────────────────────────────────────────────────────
      S.listItem()
        .title("Site Settings")
        .icon(CogIcon)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),

      S.listItem()
        .title("Homepage")
        .icon(HomeIcon)
        .child(S.document().schemaType("homepage").documentId("homepage")),

      S.divider(),

      // ── Content ─────────────────────────────────────────────────────────
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

      // ── People ───────────────────────────────────────────────────────────
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

      // ── Site ─────────────────────────────────────────────────────────────
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
