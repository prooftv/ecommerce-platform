import { CogIcon } from "@sanity/icons/Cog";
import { DocumentIcon } from "@sanity/icons/Document";
import { HomeIcon } from "@sanity/icons/Home";
import { LinkIcon } from "@sanity/icons/Link";
import { UsersIcon } from "@sanity/icons/Users";
import {
  dashboardTool,
  projectInfoWidget,
  projectUsersWidget,
} from "@sanity/dashboard";
import { colorInput } from "@sanity/color-input";
import { table } from "@sanity/table";
import { defineConfig } from "sanity";
import { structureTool, type StructureResolver } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { media, mediaAssetSource } from "sanity-plugin-media";
import { documentListWidget } from "sanity-plugin-dashboard-widget-document-list";
import { platformWidget } from "@/lib/sanity/studio/PlatformWidget";
import { analyticsWidget } from "@/lib/sanity/studio/AnalyticsWidget";
import { schemaTypes } from "@/lib/sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "52t49djs";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const previewSecret = process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET ?? "";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3001");

function previewUrl(slug: string): string {
  return `${siteUrl}/api/draft/enable?secret=${previewSecret}&slug=${slug}`;
}

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
  basePath: "/studio",
  name: "ecommerce-platform",
  title: "Ecommerce Platform",
  projectId,
  dataset,
  plugins: [
    dashboardTool({
      widgets: [
        platformWidget,
        analyticsWidget,
        documentListWidget({
          title: "Recent Blog Posts",
          order: "_createdAt desc",
          types: ["blogPost"],
          layout: { width: "medium" },
        }),
        documentListWidget({
          title: "Recent Pages",
          order: "_createdAt desc",
          types: ["page", "landingPage"],
          layout: { width: "medium" },
        }),
        projectInfoWidget(),
        projectUsersWidget(),
      ],
    }),
    structureTool({ structure }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
    colorInput(),
    media(),
    table(),
  ],
  scheduledPublishing: {
    enabled: true,
    inputDateTimeFormat: "MM/dd/yyyy h:mm a",
  },
  form: {
    image: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      assetSources: (prev: any[]) => [...prev, mediaAssetSource],
    },
  },
  schema: { types: schemaTypes },
  document: {
    productionUrl: async (prev, { document: doc }) => {
      const d = doc as Record<string, unknown>;
      const slug =
        d.slug && typeof d.slug === "object"
          ? (d.slug as { current?: string }).current
          : undefined;

      switch (doc._type) {
        case "homepage":
          return previewUrl("/us/en");
        case "blogPost":
          return slug ? previewUrl(`/us/en/blog/${slug}`) : prev;
        case "page":
          return slug ? previewUrl(`/us/en/pages/${slug}`) : prev;
        case "landingPage":
          return slug ? previewUrl(`/us/en/lp/${slug}`) : prev;
        case "faq":
          return previewUrl("/us/en/faq");
        case "siteSettings":
          return previewUrl("/us/en");
        default:
          return prev;
      }
    },
  },
});
