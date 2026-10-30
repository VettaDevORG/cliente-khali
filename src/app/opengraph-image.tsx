import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { monogramLetter } from "@/lib/format";
import { getSite } from "@/lib/site";
import { derivePalette } from "@/lib/theme";

export const alt = getSite().trade_name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MIME: Record<string, string> = { ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

/** Open Graph image: logo (or monogram), business name, headline and area on the brand colors. */
export default async function OpenGraphImage() {
  const site = getSite();
  const palette = derivePalette(site.brand.colors.primary, site.brand.colors.secondary);
  const logo = site.assets.logo;
  const markH = 72;

  let mark: React.ReactNode;
  if (logo) {
    const data = await readFile(join(process.cwd(), "public", logo.src));
    const mime = MIME[extname(logo.src).toLowerCase()] ?? "image/png";
    const src = `data:${mime};base64,${data.toString("base64")}`;
    const logoW = Math.round((logo.width / logo.height) * markH);
    // eslint-disable-next-line @next/next/no-img-element
    mark = <img src={src} alt="" width={logoW} height={markH} />;
  } else {
    mark = (
      <div
        style={{
          width: markH,
          height: markH,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: palette.primary,
          color: palette.primaryFg,
          borderRadius: 18,
          fontSize: 44,
          fontWeight: 700,
        }}
      >
        {monogramLetter(site.trade_name)}
      </div>
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: palette.primaryLight,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", padding: "64px 72px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {mark}
            <div style={{ fontSize: 40, fontWeight: 700, color: "#111827" }}>{site.trade_name}</div>
          </div>
          <div
            style={{
              marginTop: 48,
              fontSize: 64,
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: 1050,
            }}
          >
            {site.web.copy.hero_title}
          </div>
          <div style={{ marginTop: 24, fontSize: 32, color: "#4b5563", maxWidth: 1050 }}>{site.business.service_area}</div>
        </div>
        <div style={{ display: "flex", height: 28, backgroundColor: palette.primary }} />
      </div>
    ),
    { ...size },
  );
}
