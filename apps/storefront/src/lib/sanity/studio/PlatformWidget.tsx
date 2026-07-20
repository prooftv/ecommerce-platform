import { DashboardWidget, DashboardWidgetContainer } from "@sanity/dashboard";

const STOREFRONT_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://ecommerce-platform-2026-two.vercel.app";

const links = [
  { label: "Storefront", href: `${STOREFRONT_URL}/us/en` },
  { label: "Products", href: `${STOREFRONT_URL}/us/en/products` },
  { label: "Vercel Dashboard", href: "https://vercel.com/dashboard" },
  { label: "Spree Admin", href: "https://spree-rpvb.onrender.com/admin" },
  { label: "Cloudflare R2", href: "https://dash.cloudflare.com" },
  { label: "Sanity Manage", href: "https://sanity.io/manage" },
];

function PlatformWidget() {
  return (
    <DashboardWidgetContainer header="Platform Quick Links">
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.5rem 0.75rem",
              borderRadius: "4px",
              background: "var(--card-bg-color, #f5f5f5)",
              color: "var(--card-fg-color, #333)",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            ↗ {link.label}
          </a>
        ))}
      </div>
    </DashboardWidgetContainer>
  );
}

export const platformWidget: DashboardWidget = {
  name: "platform-links",
  component: PlatformWidget,
  layout: { width: "small" },
};
