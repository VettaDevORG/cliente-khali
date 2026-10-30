import type { Metadata } from "next";
import Link from "next/link";
import { Container, buttonVariants } from "@/components/ui";
import { getSite, getT } from "@/lib/site";

export const metadata: Metadata = { title: "Página no encontrada", robots: { index: false, follow: true } };

export default function NotFound() {
  const t = getT(getSite());
  return (
    <section className="py-24">
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary-text">{t.notFound.kicker}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">{t.notFound.title}</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-2">{t.notFound.text}</p>
        <Link href="/" className={`${buttonVariants.primary} mt-8`}>
          {t.notFound.home}
        </Link>
      </Container>
    </section>
  );
}
