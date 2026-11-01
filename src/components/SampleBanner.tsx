/**
 * Shown only on samples (status "sample"): the business is fictitious and the page is a showcase of the kit.
 * Not sticky, so it scrolls away with the top of the page and the header keeps its place.
 */
export default function SampleBanner() {
  return (
    <div role="note" className="bg-primary text-primary-fg">
      <p className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-4 py-2 text-center text-xs sm:text-sm">
        <span>Web de muestra: el negocio es ficticio.</span>
        <a
          href="https://vettadev.com/?utm_source=sample&utm_medium=banner"
          className="font-semibold underline underline-offset-4 transition-opacity hover:opacity-85"
        >
          Hecha por Vettadev, pide la tuya →
        </a>
      </p>
    </div>
  );
}
