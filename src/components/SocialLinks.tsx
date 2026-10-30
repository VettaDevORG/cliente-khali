import Icon, { type IconName } from "./Icon";
import type { SiteConfig } from "@/lib/ficha";

const LABELS: Record<keyof SiteConfig["business"]["social"], { label: string; icon: IconName }> = {
  instagram: { label: "Instagram", icon: "instagram" },
  facebook: { label: "Facebook", icon: "facebook" },
  linkedin: { label: "LinkedIn", icon: "linkedin" },
  tiktok: { label: "TikTok", icon: "tiktok" },
  google_business: { label: "Google", icon: "google" },
};

export default function SocialLinks({ social, className = "" }: { social: SiteConfig["business"]["social"]; className?: string }) {
  const entries = (Object.keys(LABELS) as (keyof typeof LABELS)[]).filter((k) => social[k]);
  if (entries.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {entries.map((k) => (
        <li key={k}>
          <a
            href={social[k] as string}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-ink-2 ring-1 ring-line hover:text-ink"
          >
            <Icon name={LABELS[k].icon} className="h-4 w-4" />
            {LABELS[k].label}
          </a>
        </li>
      ))}
    </ul>
  );
}
