import Icon from "@/components/Icon";
import { Container } from "@/components/ui";
import type { BlockProps } from "../types";

/** 13 Aviso · 01 Franja: a full-width band on the accent color with the message and an optional link. */
export default function NoticeFranja({ site, t, ctx }: BlockProps) {
  const n = site.web.copy.notice!;
  const external = n.link?.startsWith("http");
  return (
    <section id={ctx.anchor} className="bg-secondary text-secondary-fg">
      <Container className="flex flex-col items-center justify-between gap-3 py-4 text-center sm:flex-row sm:text-left">
        <p className="font-semibold">{n.text}</p>
        {n.link && (
          <a
            href={n.link}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-btn bg-white/90 px-4 text-sm font-semibold text-ink hover:bg-white"
          >
            {n.link_label ?? t.cta.seeMore}
            <Icon name="arrow" className="h-4 w-4" />
          </a>
        )}
      </Container>
    </section>
  );
}
