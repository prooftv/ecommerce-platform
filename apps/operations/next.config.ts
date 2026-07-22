import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: [
    "@ecommerce/ui",
    "@ecommerce/auth",
    "@ecommerce/api-client",
    "@ecommerce/types",
    "@ecommerce/config",
  ],
};

export default config;
