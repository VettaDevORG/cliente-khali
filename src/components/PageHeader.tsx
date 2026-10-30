import { Container, Kicker } from "./ui";

/** Heading band for inner pages that do not start with a hero block. */
export default function PageHeader({ kicker, title, description }: { kicker?: string; title: string; description?: string }) {
  return (
    <section className="bg-primary-light/70">
      <Container className="py-12 sm:py-16">
        {kicker && <Kicker>{kicker}</Kicker>}
        <h1 className="display mt-2 text-balance text-3xl sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg text-ink-2">{description}</p>}
      </Container>
    </section>
  );
}
