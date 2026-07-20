import type { Category } from "@spree/sdk";
import { ChevronDown, User } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CartButton } from "@/components/layout/CartButton";
import { SearchToggle } from "@/components/layout/SearchToggle";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity/client";
import { getNavigationMenu } from "@/lib/sanity/queries";
import type { SanityNavItem, SanitySiteSettings } from "@/lib/sanity/types";
import { getStoreName } from "@/lib/store";

const LazyMobileMenu = dynamic(
  () =>
    import("@/components/layout/MobileMenu").then((mod) => ({
      default: mod.MobileMenu,
    })),
  {
    loading: () => (
      <div className="inline-flex items-center justify-center h-10 w-10" />
    ),
  },
);

const LazyCountrySwitcher = dynamic(
  () =>
    import("@/components/layout/CountrySwitcher").then((mod) => ({
      default: mod.CountrySwitcher,
    })),
  {
    loading: () => (
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  },
);

interface HeaderProps {
  rootCategories: Category[];
  basePath: string;
  locale: Locale;
  siteSettings?: SanitySiteSettings | null;
}

function DesktopNav({ items, basePath }: { items: SanityNavItem[]; basePath: string }) {
  return (
    <nav className="hidden lg:flex border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center gap-1">
          {items.map((item) =>
            item.children && item.children.length > 0 ? (
              <li key={item.label} className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                  <ChevronDown className="size-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>
                <ul className="absolute left-0 top-full mt-0 min-w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <Link
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.label}>
                <Link
                  href={item.href ?? basePath}
                  className="block px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
    </nav>
  );
}

export async function Header({
  rootCategories,
  basePath,
  locale,
  siteSettings,
}: HeaderProps) {
  const [t, navMenu] = await Promise.all([
    getTranslations({ locale, namespace: "header" }),
    getNavigationMenu("header").catch(() => null),
  ]);

  const logoAsset = siteSettings?.logo ?? siteSettings?.logoDark;
  const logoUrl = logoAsset ? urlFor(logoAsset).height(64).url() : null;
  const logoAlt =
    (logoAsset as { alt?: string } | undefined)?.alt ??
    siteSettings?.storeName ??
    getStoreName();

  const navItems = navMenu?.items ?? [];

  return (
    <SearchToggle
      basePath={basePath}
      left={
        <LazyMobileMenu
          rootCategories={rootCategories}
          basePath={basePath}
          navItems={navItems}
        />
      }
      center={
        <Link href={basePath || "/"} className="flex items-center min-w-0">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={logoAlt}
              width={90}
              height={32}
              className="max-w-full object-contain"
              style={{ width: "auto", height: "auto" }}
              fetchPriority="high"
              loading="eager"
            />
          ) : (
            <Image
              src="/spree.png"
              alt={logoAlt}
              width={90}
              height={32}
              className="max-w-full object-contain"
              style={{ width: "auto", height: "auto" }}
              fetchPriority="high"
              loading="eager"
            />
          )}
        </Link>
      }
      rightStart={
        <div className="hidden lg:block">
          <LazyCountrySwitcher />
        </div>
      }
      rightEnd={
        <>
          {/* Account - desktop only */}
          <div className="hidden md:block">
            <Button variant="ghost" size="icon-lg" asChild>
              <Link href={`${basePath}/account`} aria-label={t("account")}>
                <User className="size-5" />
              </Link>
            </Button>
          </div>

          {/* Cart */}
          <CartButton />
        </>
      }
      below={navItems.length > 0 ? <DesktopNav items={navItems} basePath={basePath} /> : undefined}
    />
  );
}
