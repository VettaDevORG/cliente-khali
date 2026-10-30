import type { OpeningHours } from "./ficha";

/** Day tokens accepted in business.opening_hours[].days: lun, mar, mie, jue, vie, sab, dom; ranges with "-" and lists with ",". */
const DAY_KEYS = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"] as const;
type DayKey = (typeof DAY_KEYS)[number];

const DAY_NAMES: Record<DayKey, string> = {
  lun: "Lunes",
  mar: "Martes",
  mie: "Miércoles",
  jue: "Jueves",
  vie: "Viernes",
  sab: "Sábado",
  dom: "Domingo",
};

const SHORT_NAMES: Record<DayKey, string> = { lun: "Lun", mar: "Mar", mie: "Mié", jue: "Jue", vie: "Vie", sab: "Sáb", dom: "Dom" };

const SCHEMA_DAYS: Record<DayKey, string> = {
  lun: "Monday",
  mar: "Tuesday",
  mie: "Wednesday",
  jue: "Thursday",
  vie: "Friday",
  sab: "Saturday",
  dom: "Sunday",
};

function normalizeToken(t: string): DayKey | null {
  const k = t
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .slice(0, 3);
  return (DAY_KEYS as readonly string[]).includes(k) ? (k as DayKey) : null;
}

/** "lun-vie" → [lun, mar, mie, jue, vie]; "lun,mie" → [lun, mie]; "sab" → [sab]. */
export function parseDays(spec: string): DayKey[] {
  const out: DayKey[] = [];
  for (const part of spec.split(",")) {
    const range = part.split("-").map(normalizeToken);
    if (range.length === 2 && range[0] && range[1]) {
      const a = DAY_KEYS.indexOf(range[0]),
        b = DAY_KEYS.indexOf(range[1]);
      for (let i = a; i <= b; i++) out.push(DAY_KEYS[i]);
    } else if (range.length === 1 && range[0]) {
      out.push(range[0]);
    }
  }
  return out;
}

export function formatTime(t: string): string {
  const [h, m] = t.split(":");
  return `${parseInt(h, 10)}:${m}`;
}

function formatDayList(days: DayKey[]): string {
  if (days.length === 0) return "";
  if (days.length === 1) return DAY_NAMES[days[0]];
  const idx = days.map((d) => DAY_KEYS.indexOf(d));
  const consecutive = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  if (consecutive && days.length > 2) return `${DAY_NAMES[days[0]]} a ${DAY_NAMES[days[days.length - 1]].toLowerCase()}`;
  const names = days.map((d, i) => (i === 0 ? DAY_NAMES[d] : DAY_NAMES[d].toLowerCase()));
  return `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}`;
}

type Group = { days: DayKey[]; ranges: string[] };

function group(entries: OpeningHours[]): Group[] {
  const map = new Map<string, Group>();
  for (const e of entries) {
    const days = parseDays(e.days);
    const key = days.join(",");
    const range = `${formatTime(e.open)}–${formatTime(e.close)}`;
    const row = map.get(key);
    if (row) row.ranges.push(range);
    else map.set(key, { days, ranges: [range] });
  }
  return [...map.values()];
}

export type HoursRow = { days: string; ranges: string[] };

/** Groups entries that share the same days: [{ days: "Lunes a viernes", ranges: ["9:00–13:00", "16:00–21:00"] }]. */
export function groupHours(entries: OpeningHours[]): HoursRow[] {
  return group(entries).map((r) => ({ days: formatDayList(r.days), ranges: r.ranges }));
}

/** One-line summary for the hero: "Lun–vie 8:00–20:00 · Sáb 9:00–14:00". */
export function summarizeHours(entries: OpeningHours[]): string {
  return group(entries)
    .map((r) => {
      const first = SHORT_NAMES[r.days[0]];
      const last = SHORT_NAMES[r.days[r.days.length - 1]];
      const d = r.days.length > 1 ? `${first}–${last.toLowerCase()}` : first;
      return `${d} ${r.ranges.join(" y ")}`;
    })
    .join(" · ");
}

export function openingHoursSchema(entries: OpeningHours[]) {
  return entries.map((e) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: parseDays(e.days).map((d) => SCHEMA_DAYS[d]),
    opens: e.open.padStart(5, "0"),
    closes: e.close.padStart(5, "0"),
  }));
}

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  return `${d} de ${MONTHS[m - 1]} de ${y}`;
}

/** Holidays from the given date on, formatted; empty if none. */
export function upcomingHolidays(holidays: string[], fromIso: string): string[] {
  return holidays
    .filter((h) => h >= fromIso)
    .sort()
    .map(formatDate);
}
