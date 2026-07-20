import { announcementBar } from "./announcementBar";
import { blogPost } from "./blogPost";
import { faq } from "./faq";
import { homepage } from "./homepage";
import { landingPage } from "./landingPage";
import { navigationMenu } from "./navigationMenu";
import { page } from "./page";
import { portableText } from "./portableText";
import { redirect } from "./redirect";
import { seo } from "./seo";
import { siteSettings } from "./siteSettings";
import { teamMember } from "./teamMember";
import { testimonial } from "./testimonial";

export const schemaTypes = [
  // Singletons
  siteSettings,
  homepage,
  // Collections — content
  blogPost,
  faq,
  page,
  landingPage,
  teamMember,
  testimonial,
  // Collections — site
  navigationMenu,
  announcementBar,
  redirect,
  // Objects (reusable)
  seo,
  portableText,
];
