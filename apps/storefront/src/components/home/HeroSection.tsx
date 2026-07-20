import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { getHomepage } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/client";
import { getStoreName } from "@/lib/store";

interface HeroSectionProps {
  basePath: string;
  locale: string;
}

export async function HeroSection({ basePath, locale }: HeroSectionProps) {
  const t = await getTranslations({ locale: locale as Locale, namespace: "home" });
  const homepage = await getHomepage();
  const hero = homepage?.hero;
  const storeName = getStoreName();

  const heading = hero?.heading ?? t("welcome", { storeName });
  const subheading = hero?.subheading ?? t("heroDescription");
  const primaryCta = hero?.cta ?? { label: t("shopNow"), href: `${basePath}/products` };
  const secondaryCta = hero?.secondaryCta;
  const overlayOpacity = (hero?.overlayOpacity ?? 40) / 100;

  return (
    <section
      className="relative border-b border-gray-200 min-h-[560px] md:min-h-[640px] flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {hero?.image?.asset ? (
        <>
          <Image
            src={urlFor(hero.image).width(1920).height(640).auto("format").quality(85).url()}
            alt={hero.image.alt ?? ""}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
            aria-hidden="true"
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700" aria-hidden="true" />
      )}

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            {heading}
          </h1>
          {subheading && (
            <p className="mt-4 text-lg text-gray-200 max-w-xl">
              {subheading}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            {primaryCta.label && (
              <Button size="lg" asChild>
                <Link href={primaryCta.href ?? `${basePath}/products`}>
                  {primaryCta.label}
                </Link>
              </Button>
            )}
            {secondaryCta?.label && (
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900" asChild>
                <Link href={secondaryCta.href ?? `${basePath}/products`}>
                  {secondaryCta.label}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
