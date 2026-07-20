"use client";

import { DashboardWidget, DashboardWidgetContainer } from "@sanity/dashboard";

const GA4_PROPERTY_ID = process.env.NEXT_PUBLIC_GA4_PROPERTY_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

function AnalyticsWidget() {
  if (!GA4_PROPERTY_ID && !GTM_ID) {
    return (
      <DashboardWidgetContainer header="Analytics">
        <div
          style={{
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            fontSize: "0.875rem",
          }}
        >
          <p style={{ margin: 0, color: "var(--card-muted-fg-color, #666)" }}>
            Connect Google Analytics to see traffic data here.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "4px",
                background: "var(--card-bg-color, #f5f5f5)",
                color: "var(--card-fg-color, #333)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              ↗ Open Google Analytics
            </a>
            <a
              href="https://tagmanager.google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "4px",
                background: "var(--card-bg-color, #f5f5f5)",
                color: "var(--card-fg-color, #333)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              ↗ Open Google Tag Manager
            </a>
          </div>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--card-muted-fg-color, #999)" }}>
            Set <code>NEXT_PUBLIC_GTM_ID</code> and <code>NEXT_PUBLIC_GA4_PROPERTY_ID</code> in Vercel to enable inline reporting.
          </p>
        </div>
      </DashboardWidgetContainer>
    );
  }

  return (
    <DashboardWidgetContainer header="Analytics">
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {GTM_ID && (
          <a
            href={`https://tagmanager.google.com/#/container/${GTM_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "4px",
              background: "var(--card-bg-color, #f5f5f5)",
              color: "var(--card-fg-color, #333)",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            ↗ GTM Container: {GTM_ID}
          </a>
        )}
        {GA4_PROPERTY_ID && (
          <a
            href={`https://analytics.google.com/analytics/web/#/p${GA4_PROPERTY_ID}/reports/reportinghub`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "4px",
              background: "var(--card-bg-color, #f5f5f5)",
              color: "var(--card-fg-color, #333)",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            ↗ GA4 Property: {GA4_PROPERTY_ID}
          </a>
        )}
      </div>
    </DashboardWidgetContainer>
  );
}

export const analyticsWidget: DashboardWidget = {
  name: "analytics",
  component: AnalyticsWidget,
  layout: { width: "small" },
};
