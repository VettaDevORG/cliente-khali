import Icon from "@/components/Icon";
import type { SiteConfig } from "@/lib/ficha";
import { groupHours, upcomingHolidays } from "@/lib/hours";
import type { Strings } from "@/lib/strings";

/** The opening hours table and the holidays still to come. */
export function HoursTable({ site, t, withTitle = true }: { site: SiteConfig; t: Strings; withTitle?: boolean }) {
  const rows = groupHours(site.business.opening_hours);
  const holidays = upcomingHolidays(site.business.holidays, site.generated_at);
  return (
    <div>
      {withTitle && (
        <h3 className="flex items-center gap-2 font-semibold">
          <Icon name="clock" className="h-4 w-4 text-primary-text" />
          {t.hours.title}
        </h3>
      )}
      <table className={`w-full text-sm ${withTitle ? "mt-3" : ""}`}>
        <tbody>
          {rows.map((r) => (
            <tr key={r.days} className="border-t border-line">
              <th scope="row" className="py-2.5 pr-4 text-left font-medium">
                {r.days}
              </th>
              <td className="py-2.5 text-right text-ink-2 sm:text-left">{r.ranges.join(" y ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {holidays.length > 0 && (
        <p className="mt-3 text-sm text-ink-3">
          {t.hours.holidays}: {holidays.join(", ")}
        </p>
      )}
    </div>
  );
}
