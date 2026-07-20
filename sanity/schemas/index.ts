import { announcementBar } from "./announcementBar";
import { blogPost } from "./blogPost";
import { faq } from "./faq";
import { homepage } from "./homepage";
import { navigationMenu } from "./navigationMenu";
import { page } from "./page";
import { portableText } from "./portableText";
import { seo } from "./seo";

export const schemaTypes = [
  // Singletons
  homepage,
  // Collections
  blogPost,
  faq,
  page,
  navigationMenu,
  announcementBar,
  // Objects
  seo,
  portableText,
];
