import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { monogramLetter } from "@/lib/format";
import { getSite } from "@/lib/site";
import { derivePalette } from "@/lib/theme";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

const MIME: Record<string, string> = { ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

/**
 * Favicon generated from the client logo: the logo fitted inside a white rounded square.
 * Without a logo, the monogram: the initial of the trade name on the primary color.
 */
export default async function Icon() {
  const site = getSite();
  const logo = site.assets.logo;

  if (!logo) {
    const palette = derivePalette(site.brand.colors.primary, site.brand.colors.secondary);
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: palette.primary,
            color: palette.primaryFg,
            borderRadius: 14,
            fontSize: 40,
            fontWeight: 700,
            fontFamily: "sans-serif",
          }}
        >
          {monogramLetter(site.trade_name)}
        </div>
      ),
      { ...size },
    );
  }

  const file = join(process.cwd(), "public", logo.src);
  const data = await readFile(file);
  const mime = MIME[extname(file).toLowerCase()] ?? "image/png";
  const src = `data:${mime};base64,${data.toString("base64")}`;
  const box = 48;
  const ratio = logo.width / logo.height;
  const w = ratio >= 1 ? box : Math.round(box * ratio);
  const h = ratio >= 1 ? Math.round(box / ratio) : box;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          borderRadius: 14,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={w} height={h} />
      </div>
    ),
    { ...size },
  );
}
