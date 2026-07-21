import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { createClient } from "@sanity/client";

const withNextIntl = createNextIntlPlugin();

const getHostnameFromEnv = (value?: string): string | undefined => {
  if (!value) return undefined;

  try {
    return new URL(value).hostname;
  } catch {
    return undefined;
  }
};

const remotePatterns = [
  {
    protocol: "http" as const,
    hostname: "localhost",
    pathname: "/rails/active_storage/**",
  },
  {
    protocol: "https" as const,
    hostname: "**.vendo.dev",
    pathname: "/rails/active_storage/**",
  },
  {
    protocol: "https" as const,
    hostname: "**.spree.sh",
    pathname: "/rails/active_storage/**",
  },
  {
    protocol: "https" as const,
    hostname: "**.trycloudflare.com",
    pathname: "/rails/active_storage/**",
  },
  {
    protocol: "https" as const,
    hostname: "*.onrender.com",
    pathname: "/rails/active_storage/**",
  },
  {
    protocol: "https" as const,
    hostname: "*.r2.dev",
    pathname: "/rails/active_storage/**",
  },
  {
    protocol: "https" as const,
    hostname: "*.cloudflarestorage.com",
    pathname: "/rails/active_storage/**",
  },
  {
    protocol: "https" as const,
    hostname: "*.vercel.app",
    pathname: "/rails/active_storage/**",
  },
  {
    protocol: "https" as const,
    hostname: "*.vercel.dev",
    pathname: "/rails/active_storage/**",
  },
  {
    protocol: "https" as const,
    hostname: "cdn.sanity.io",
  },
];

const siteHostname = getHostnameFromEnv(process.env.NEXT_PUBLIC_SITE_URL);
const spreeApiHostname = getHostnameFromEnv(process.env.SPREE_API_URL);

if (siteHostname) {
  remotePatterns.push({
    protocol: "https" as const,
    hostname: siteHostname,
    pathname: "/rails/active_storage/**",
  });
}

if (spreeApiHostname) {
  remotePatterns.push({
    protocol: "https" as const,
    hostname: spreeApiHostname,
    pathname: "/rails/active_storage/**",
  });
}

async function getSanityRedirects() {
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "52t49djs";
  try {
    const client = createClient({
      projectId,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
      apiVersion: "2024-01-01",
      useCdn: false,
    });
    const redirects = await client.fetch<Array<{ source: string; destination: string; permanent: boolean }>>(
      `*[_type == "redirect"]{ source, destination, permanent }`
    );
    return redirects.map((r) => ({
      source: r.source,
      destination: r.destination,
      permanent: r.permanent ?? false,
    }));
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  redirects: getSanityRedirects,
  allowedDevOrigins: ["shop.lvh.me", "*.trycloudflare.com", "192.168.33.13"],
  env: {
    NEXT_PUBLIC_SENTRY_DSN: process.env.SENTRY_DSN || "",
  },
  transpilePackages: ["@spree/sdk"],
  reactCompiler: true,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-dialog",
    ],
  },
  cacheLife: {
    tenMinutes: {
      stale: 300, // 5 minutes client stale window
      revalidate: 600, // 10 minutes until background revalidation
      expire: 3600, // 1 hour max before recompute on idle entries
    },
  },
  images: {
    qualities: [25, 50, 75, 85, 100],
    dangerouslyAllowLocalIP: true, // Allow localhost images in development
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns,
  },
};

const configWithIntl = withNextIntl(nextConfig);

export default process.env.SENTRY_DSN
  ? withSentryConfig(configWithIntl, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: !process.env.CI,

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Automatically delete source maps after uploading to Sentry
      // so they are not served publicly
      sourcemaps: {
        deleteSourcemapsAfterUpload: true,
      },

      // Disables the Sentry SDK build-time telemetry
      telemetry: false,
    })
  : configWithIntl;
