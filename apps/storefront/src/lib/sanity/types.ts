// Single source of truth for Sanity types lives in @ecommerce/types.
// This file re-exports for backwards compatibility with existing imports.
// When @ecommerce/types is installed as a workspace dependency, update
// all imports to use @ecommerce/types/sanity directly.
export type {
  SanityImage,
  SanitySeo,
  SanityHeroCta,
  SanityHero,
  SanityFeaturedCategory,
  SanityPromotionalBanner,
  SanityHomepage,
  SanityAnnouncementBar,
  SanityNavItem,
  SanityNavigationMenu,
  SanityBlogPost,
  SanityFaq,
  SanityPage,
  SanitySiteSettings,
  SanityTeamMember,
  SanityTestimonial,
  SanityRedirect,
  SanityLandingPage,
} from "@ecommerce/types/sanity";
