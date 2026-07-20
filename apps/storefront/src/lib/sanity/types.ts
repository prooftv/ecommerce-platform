export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  alt?: string;
}

export interface SanitySeo {
  title?: string;
  description?: string;
  ogImage?: SanityImage & { alt?: string };
  noIndex?: boolean;
}

export interface SanityHeroCta {
  label?: string;
  href?: string;
}

export interface SanityHero {
  heading: string;
  subheading?: string;
  cta?: SanityHeroCta;
  secondaryCta?: SanityHeroCta;
  image?: SanityImage;
  overlayOpacity?: number;
}

export interface SanityFeaturedCategory {
  label: string;
  spreeSlug: string;
  image?: SanityImage;
}

export interface SanityPromotionalBanner {
  enabled: boolean;
  text?: string;
  href?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface SanityHomepage {
  _id: "homepage";
  hero?: SanityHero;
  featuredCategories?: SanityFeaturedCategory[];
  promotionalBanner?: SanityPromotionalBanner;
  seo?: SanitySeo;
}

export interface SanityAnnouncementBar {
  _id: string;
  text: string;
  href?: string;
  linkLabel?: string;
  backgroundColor?: string;
  textColor?: string;
  dismissible?: boolean;
  active: boolean;
  startsAt?: string;
  endsAt?: string;
}

export interface SanityNavItem {
  label: string;
  href?: string;
  children?: Array<{ label: string; href: string }>;
}

export interface SanityNavigationMenu {
  _id: string;
  identifier: string;
  items: SanityNavItem[];
}

export interface SanityBlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  author?: { name: string; image?: SanityImage };
  categories?: string[];
  excerpt?: string;
  coverImage?: SanityImage;
  body?: unknown[];
  seo?: SanitySeo;
}

export interface SanityFaq {
  _id: string;
  question: string;
  answer: unknown[];
  category?: string;
  order?: number;
}

export interface SanityPage {
  _id: string;
  title: string;
  slug: { current: string };
  body?: unknown[];
  seo?: SanitySeo;
}
