import { createSpreeMiddleware } from "@/lib/spree/middleware";
import { getDefaultCountry, getDefaultLocale } from "@/lib/store";

export const proxy = createSpreeMiddleware({
  defaultCountry: getDefaultCountry(),
  defaultLocale: getDefaultLocale(),
});

export const config = {
  matcher: ["/((?!api/|studio|_next/static|_next/image|favicon.ico|.*\\..*$).*)"],
};
