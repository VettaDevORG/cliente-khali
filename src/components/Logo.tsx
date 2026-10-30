import { monogramLetter } from "@/lib/format";

export type LogoAsset = { src: string; width: number; height: number };

/**
 * The client logo as shipped in public/client. Plain <img>: SVG logos do not go through the optimizer
 * and the dimensions are known from materialize, so there is no layout shift.
 * Without a logo (brand.logo null) a monogram takes its place: the initial of the trade name on the primary
 * color, in the heading font. Never an empty gap and never a placeholder image.
 */
export default function Logo({
  logo,
  name,
  heightClass = "h-9",
  withName = true,
}: {
  logo: LogoAsset | null;
  name: string;
  heightClass?: string;
  withName?: boolean;
}) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo.src} alt={withName ? "" : name} width={logo.width} height={logo.height} className={`${heightClass} w-auto shrink-0`} />
      ) : (
        <Monogram name={name} heightClass={heightClass} labelled={!withName} />
      )}
      {/* Long trade names: smaller on phones and truncated before they can push the header wider than the screen. */}
      {withName && <span className="truncate font-heading text-base font-bold tracking-tight sm:text-lg">{name}</span>}
    </span>
  );
}

/**
 * The generated mark: a rounded square in the primary color with the initial of the name.
 * The letter is drawn with a CSS pseudo-element so it never counts as text of the link around it
 * (the home link reads "Khali, inicio", not "K Khali").
 */
export function Monogram({ name, heightClass = "h-9", labelled = false }: { name: string; heightClass?: string; labelled?: boolean }) {
  return (
    <span
      role={labelled ? "img" : undefined}
      aria-label={labelled ? name : undefined}
      aria-hidden={labelled ? undefined : true}
      data-letter={monogramLetter(name)}
      className={`${heightClass} inline-flex aspect-square shrink-0 items-center justify-center rounded-btn bg-primary font-heading text-lg font-bold leading-none text-primary-fg shadow-sm shadow-primary/30 before:content-[attr(data-letter)]`}
    />
  );
}
