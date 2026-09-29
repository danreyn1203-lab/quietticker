import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fbfaf8",
          padding: "72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#22415c",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
            }}
          >
            {site.name.charAt(0)}
          </div>
          <div style={{ fontSize: 30, color: "#22415c", fontWeight: 600 }}>
            {site.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, color: "#1b1a17", lineHeight: 1.05, maxWidth: 900 }}>
            Find companies before they become obvious.
          </div>
          <div style={{ fontSize: 30, color: "#57534b", marginTop: 24, maxWidth: 820 }}>
            Independent, transparent stock research — every claim sourced, no hype.
          </div>
        </div>

        <div style={{ fontSize: 24, color: "#8b867b" }}>
          {site.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    size,
  );
}
