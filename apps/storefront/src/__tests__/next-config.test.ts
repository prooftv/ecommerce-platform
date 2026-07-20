import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";

describe("Next.js image remote patterns", () => {
  it("allows Cloudflare R2 and Vercel-hosted media URLs", () => {
    const remotePatterns = nextConfig.images?.remotePatterns ?? [];
    const hostnames = remotePatterns.map((pattern) => pattern.hostname);

    expect(hostnames).toContain("*.r2.dev");
    expect(hostnames).toContain("*.cloudflarestorage.com");
    expect(hostnames).toContain("*.vercel.app");
    expect(hostnames).toContain("*.vercel.dev");
  });
});
