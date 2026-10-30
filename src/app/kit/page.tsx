import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { renderBlock, renderSections } from "@/blocks";
import { chosenVariant, sectionInputFromSite, sectionIssues, type SectionId } from "@/lib/ficha";
import { PRESETS, getPreset, presetCssVars } from "@/lib/presets";
import { getSite, getT, homePage } from "@/lib/site";
import { BLOCKS_META, blockLabel, resolveVariant, variantLabel } from "@/lib/variants";

export const metadata: Metadata = { title: "Catálogo de bloques", robots: { index: false, follow: false } };

/**
 * /kit, development only (404 in production). Two views, with the data of the client in client/site.json:
 *   - "web" (default): the home page as it would ship with the chosen preset, so switching presets changes the
 *     whole page. Previewing a preset other than the ficha's ignores products.web.variants to show it pure.
 *   - "catalogo": every block in every variant, each with its code, to pick "01 Hero · 02 Centrado" with the client.
 * ?preset=oficio|sereno|moderno|editorial, ?view=catalogo, ?block=hero (catalog only).
 */
export default async function KitPage({ searchParams }: { searchParams: Promise<{ preset?: string; block?: string; view?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { preset: presetParam, block: blockParam, view: viewParam } = await searchParams;
  const site = getSite();
  const t = getT(site);
  const preset = getPreset(presetParam ?? site.web.preset);
  const previewingOther = Boolean(presetParam) && presetParam !== site.web.preset;
  const previewWeb = { ...site.web, preset: preset.id, variants: previewingOther ? {} : site.web.variants };
  const previewSite = { ...site, web: previewWeb };
  const input = sectionInputFromSite(site);
  const view = viewParam === "catalogo" ? "catalogo" : "web";
  const homeSections: SectionId[] = site.web.package === "landing" ? site.web.sections : (homePage(site)?.sections ?? []);
  const ctxBase = { pagePath: "/kit", isHome: false };
  // ?block=hero (or ?block=01) shows one block only, to share a direct link or to screenshot it.
  const shown = BLOCKS_META.filter((b) => !blockParam || b.id === blockParam || b.number === blockParam.padStart(2, "0"));
  const query = (extra: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const all = { preset: presetParam, view: viewParam, block: blockParam, ...extra };
    for (const [k, v] of Object.entries(all)) if (v) params.set(k, v);
    const s = params.toString();
    return s ? `/kit?${s}` : "/kit";
  };
  const chip = (active: boolean) => `rounded-full px-4 py-1.5 text-sm font-semibold ${active ? "bg-white text-ink" : "bg-white/10 text-white hover:bg-white/20"}`;

  return (
    <div style={presetCssVars(preset) as CSSProperties}>
      <div className="border-b border-white/10 bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-white/60">vettadev-web-kit · solo en desarrollo</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <a href={query({ view: undefined, block: undefined })} className={chip(view === "web")}>
              Portada completa
            </a>
            <a href={query({ view: "catalogo" })} className={chip(view === "catalogo")}>
              Catálogo de variantes
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="mr-2 text-sm text-white/60">Preset:</span>
            {Object.values(PRESETS).map((p) => (
              <a key={p.id} href={query({ preset: p.id === site.web.preset ? undefined : p.id })} className={chip(p.id === preset.id)} aria-current={p.id === preset.id ? "true" : undefined}>
                {p.name}
                {p.id === site.web.preset && <span className="ml-1 text-xs opacity-60">· ficha</span>}
              </a>
            ))}
          </div>
          <p className="mt-3 max-w-2xl text-sm text-white/70">
            <strong className="text-white/90">{preset.name}:</strong> {preset.description} <span className="text-white/50">Para: {preset.forWhom}</span>
          </p>

          {view === "web" ? (
            <>
              <p className="mt-6 max-w-2xl text-white/80">
                La portada de <strong className="text-white">{site.trade_name}</strong> tal como saldría con este preset.
                {previewingOther ? " Se ignoran las variantes de la ficha para verlo puro." : " Con las variantes de la ficha aplicadas."} Para fijarlo:
              </p>
              <pre className="mt-3 inline-block max-w-full whitespace-pre-wrap break-all rounded-lg bg-white/10 px-4 py-2 font-mono text-sm text-white/90">{`"products": { "web": { "preset": "${preset.id}" } }`}</pre>
              <ol className="mt-5 flex flex-wrap gap-2">
                {homeSections.map((id) => {
                  const resolved = resolveVariant(id, chosenVariant(previewWeb, id), input);
                  return (
                    <li key={id}>
                      <a href={query({ view: "catalogo", block: id })} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20">
                        <span className="font-mono text-xs opacity-60">{blockLabel(id)}</span>
                        {variantLabel(id, resolved.code)}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </>
          ) : (
            <>
              <p className="mt-6 max-w-2xl text-white/80">
                Todos los bloques en todas sus variantes con los datos de <strong className="text-white">{site.trade_name}</strong>. Elige con el cliente
                por número, por ejemplo <span className="font-mono">01 Hero · 02 Centrado</span>, y escríbelo en la ficha:
              </p>
              <pre className="mt-3 inline-block max-w-full whitespace-pre-wrap break-all rounded-lg bg-white/10 px-4 py-2 font-mono text-sm text-white/90">{`"products": { "web": { "preset": "${preset.id}", "variants": { "hero": "02" } } }`}</pre>
              <nav aria-label="Bloques" className="mt-6">
                <ol className="flex flex-wrap gap-2">
                  {blockParam && (
                    <li>
                      <a href={query({ block: undefined })} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-ink">
                        Todos
                      </a>
                    </li>
                  )}
                  {BLOCKS_META.map((b) => (
                    <li key={b.id}>
                      <a
                        href={blockParam ? query({ block: b.id }) : `#kit-${b.id}`}
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${shown.length === 1 && shown[0].id === b.id ? "bg-white text-ink" : "bg-white/10 hover:bg-white/20"}`}
                      >
                        <span className="font-mono text-xs opacity-60">{b.number}</span>
                        {b.name}
                        <span className="font-mono text-xs opacity-40">×{b.variants.length}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </>
          )}
        </div>
      </div>

      {view === "web" && renderSections(homeSections, previewSite, t, { pagePath: "/", isHome: true })}

      {view === "catalogo" &&
        shown.map((block) => {
          const blockIssues = sectionIssues(block.id, input);
          const chosen = chosenVariant(previewWeb, block.id);
          return (
            <section key={block.id} id={`kit-${block.id}`} aria-labelledby={`kit-${block.id}-title`} className="scroll-mt-16">
              <div className="border-y border-white/10 bg-ink text-white">
                <div className="mx-auto flex max-w-6xl flex-wrap items-baseline gap-x-4 gap-y-1 px-4 py-5 sm:px-6">
                  <h2 id={`kit-${block.id}-title`} className="text-xl font-bold">
                    <span className="mr-2 font-mono text-white/50">{block.number}</span>
                    {block.name}
                  </h2>
                  <p className="text-sm text-white/70">{block.description}</p>
                  <p className="ml-auto flex items-center gap-3 font-mono text-xs text-white/50">
                    {block.id}
                    {!blockParam && (
                      <a href={query({ block: block.id })} className="rounded-full bg-white/10 px-2.5 py-1 font-sans text-white/80 hover:bg-white/20">
                        solo este bloque
                      </a>
                    )}
                  </p>
                </div>
              </div>
              {blockIssues.length > 0 && (
                <p className="mx-auto max-w-6xl px-4 py-8 text-sm text-ink-2 sm:px-6">Este bloque no se puede mostrar con la ficha actual: {blockIssues.join("; ")}.</p>
              )}
              {blockIssues.length === 0 &&
                block.variants.map((v, i) => {
                  const needs = v.needs?.(input) ?? null;
                  const active = v.code === chosen;
                  return (
                    <article key={v.code} aria-label={`${block.number} ${block.name} · ${v.code} ${v.name}`}>
                      <div className="sticky top-16 z-40 border-y border-line bg-bg/95 backdrop-blur">
                        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 text-sm sm:px-6">
                          <span className="font-mono font-bold">
                            {block.number}.{v.code}
                          </span>
                          <span className="font-semibold">{v.name}</span>
                          <span className="text-ink-2">{v.description}</span>
                          {active && <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-fg">en uso</span>}
                          <code className="ml-auto rounded bg-surface-2 px-2 py-0.5 font-mono text-xs text-ink-2">{`"${block.id}": "${v.code}"`}</code>
                        </div>
                      </div>
                      {needs ? (
                        <p className="mx-auto max-w-6xl px-4 py-8 text-sm text-ink-2 sm:px-6">
                          No disponible con esta ficha: {needs}. Si se elige, la web usa otra variante y lo avisa en <code className="font-mono">npm run check</code>.
                        </p>
                      ) : (
                        renderBlock(block.id, v.code, site, t, { ...ctxBase, tone: i % 2 === 1 ? "soft" : "default", anchor: `kit-${block.id}-${v.code}` })
                      )}
                    </article>
                  );
                })}
            </section>
          );
        })}
    </div>
  );
}
