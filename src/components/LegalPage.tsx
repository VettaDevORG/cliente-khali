import type { ReactNode } from "react";
import { Container, Section } from "./ui";
import { formatDate } from "@/lib/hours";

export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <Section>
      <Container narrow className="prose-basic">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary-text">Última actualización: {formatDate(updated)}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">{title}</h1>
        {children}
      </Container>
    </Section>
  );
}
