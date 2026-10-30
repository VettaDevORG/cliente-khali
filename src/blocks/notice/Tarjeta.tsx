import Icon from "@/components/Icon";
import { Container } from "@/components/ui";
import type { BlockProps } from "../types";

/** 13 Aviso · 02 Tarjeta: a soft tinted card inside the content width, with an icon. Quieter than the band. */
export default function NoticeTarjeta({ site, t, ctx }: BlockProps) {
  const n = site.web.copy.notice!;
  const external = n.link?.startsWith("http");
  return (
    <section id={ctx.anchor} className="pt-6 sm:pt-8">
      <Container>
        <div className="flex flex-col items-start gap-4 rounded-card bg-secondary-light px-5 py-4 ring-1 ring-secondary/20 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-3 font-medium">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-fg">
              <Icon name="arrow" className="h-3.5 w-3.5 -rotate-90" strokeWidth={3} />
            </span>
            {n.text}
          </p>
          {n.link && (
            <a
              href={n.link}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-secondary-text underline underline-offset-4"
            >
              {n.link_label ?? t.cta.seeMore}
              <Icon name="arrow" className="h-4 w-4" />
            </a>
          )}
        </div>
      </Container>
    </section>
  );
}
