import type { Category } from "@spree/sdk";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { POLICY_LINKS } from "@/lib/constants/policies";
import { getStoreDescription, getStoreName } from "@/lib/store";
import { CurrentYear } from "./CurrentYear";
import type { SanitySiteSettings } from "@/lib/sanity/types";

const storeName = getStoreName();
const storeDescription = getStoreDescription();

// Demo-only: Remove for production.
const githubUrl = "https://github.com/spree/storefront";
const quickstartUrl =
  "https://spreecommerce.org/docs/developer/getting-started/quickstart";
const learnMoreUrl = "https://spreecommerce.org";

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  twitter: "X / Twitter",
  tiktok: "TikTok",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  pinterest: "Pinterest",
};

interface FooterProps {
  rootCategories: Category[];
  basePath: string;
  locale: Locale;
  siteSettings?: SanitySiteSettings | null;
}

export async function Footer({
  rootCategories,
  basePath,
  locale,
  siteSettings,
}: FooterProps) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const tp = await getTranslations({ locale, namespace: "policies" });

  const displayName = siteSettings?.storeName ?? storeName;
  const displayDescription = siteSettings?.storeTagline ?? t("description") ?? storeDescription;
  const socialLinks = siteSettings?.socialLinks ?? [];
  const copyright = siteSettings?.footerCopyright;

  return (
    <footer className="bg-primary text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          {/* Demo-only: Remove for production. */}
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <span className="text-xl font-bold text-white">{displayName}</span>
            <p className="mt-4 text-sm text-neutral-400">
              {displayDescription}
            </p>
            {socialLinks.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {socialLinks.map(({ platform, url }) => (
                  <Link
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    {SOCIAL_LABELS[platform] ?? platform}
                  </Link>
                ))}
              </div>
            ) : (
              // Demo-only: Remove for production.
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white hover:text-neutral-200 transition-colors font-medium"
                >
                  {t("forkOnGithub")} &rarr;
                </Link>
                <Link
                  href={quickstartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  {t("quickstartGuide")}
                </Link>
                <Link
                  href={learnMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  {t("learnMore")}
                </Link>
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-medium text-neutral-300">
              {t("shop")}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href={`${basePath}/products`}
                  className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  {t("allProducts")}
                </Link>
              </li>
              {rootCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`${basePath}/c/${category.permalink}`}
                    className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-medium text-neutral-300">
              {t("account")}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href={`${basePath}/account`}
                  className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  {t("myAccount")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${basePath}/account/orders`}
                  className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  {t("orderHistory")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${basePath}/cart`}
                  className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  {t("cart")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-sm font-medium text-neutral-300">
              {t("policies")}
            </h3>
            <ul className="mt-4 space-y-3">
              {POLICY_LINKS.map((policy) => (
                <li key={policy.slug}>
                  <Link
                    href={`${basePath}/policies/${policy.slug}`}
                    className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    {tp(policy.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-800 text-xs text-neutral-400 text-center">
          <p>
            {copyright ?? (
              <>
                &copy; <CurrentYear /> {displayName}. {t("poweredBy")}{" "}
                <Link
                  href="https://spreecommerce.org"
                  target="_blank"
                  className="text-neutral-400 hover:text-neutral-200 underline transition-colors"
                >
                  Spree Commerce
                </Link>{" "}
                & Next.js.
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
