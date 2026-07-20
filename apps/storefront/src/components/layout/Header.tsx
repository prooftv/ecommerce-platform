import type { Category } from "@spree/sdk";
import { User } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CartButton } from "@/components/layout/CartButton";
import { SearchToggle } from "@/components/layout/SearchToggle";
import { Button } from "@/components/ui/button";
import { getStoreName } from "@/lib/store";
import type { SanitySiteSettings } from "@/lib/sanity/types";
import { urlFor } from "@/lib/sanity/client";

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

const storeName = getStoreName();

interface HeaderProps {
  rootCategories: Category[];
  basePath: string;
  locale: Locale;
  siteSettings?: SanitySiteSettings | null;
}

export async function Header({
  rootCategories,
  basePath,
  locale,
  siteSettings,
}: HeaderProps) {
  const t = await getTranslations({ locale, namespace: "header" });
  const logoAsset = siteSettings?.logo ?? siteSettings?.logoDark;
  const logoUrl = logoAsset ? urlFor(logoAsset).height(64).url() : null;
  const logoAlt = (logoAsset as { alt?: string } | undefined)?.alt ?? (siteSettings?.storeName ?? getStoreName());

  return (
    <SearchToggle
      basePath={basePath}
      left={
        <LazyMobileMenu rootCategories={rootCategories} basePath={basePath} />
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
    />
  );
}
