import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { renderSections } from "@/blocks";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import CtaPair from "@/components/CtaPair";
import { CheckDot, Container, Section } from "@/components/ui";
import { durationLabel, priceLabel } from "@/lib/format";
import { ANCHORS } from "@/lib/nav";
import { breadcrumbSchema, pageMetadata, serviceSchema } from "@/lib/seo";
import { getSite, getT, hasServicePages, sectionHref, servicePath } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  const site = getSite();
  return hasServicePages(site) ? site.business.services.map((s) => ({ id: s.id })) : [];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const site = getSite();
  const service = site.business.services.find((s) => s.id === id);
  if (!service) return {};
  const copy = site.web.copy.services?.[id];
  return pageMetadata(site, { path: servicePath(service), title: service.name, description: copy?.intro ?? service.description });
}

/** One page per service in the full website: intro and bullet list from products.web.copy.services, price, FAQ and contact. */
export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const site = getSite();
  const t = getT(site);
  const service = site.business.services.find((s) => s.id === id);
  if (!service || !hasServicePages(site)) notFound();
  const copy = site.web.copy.services?.[id];
  const path = servicePath(service);
  const price = priceLabel(service, copy?.price_label, t);
  const duration = durationLabel(service.duration_minutes);
  const servicesHref = sectionHref(site, "services", ANCHORS.services, path);

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(site, service),
          breadcrumbSchema(site, [
            { name: t.home, path: "/" },
            { name: t.sections.services, path: servicesHref.startsWith("#") ? "/" : servicesHref.split("#")[0] },
            { name: service.name, path },
          ]),
        ]}
      />
      <section className="bg-primary-light/70">
        <Container className="py-12 sm:py-16">
          <Link href={servicesHref} className="inline-flex items-center gap-1 text-sm font-semibold text-primary-text">
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
            {t.services.allServices}
          </Link>
          <h1 className="display mt-4 text-balance text-3xl sm:text-5xl">{service.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-2">{copy?.intro ?? service.description}</p>
          {(price || duration) && (
            <dl className="mt-6 flex flex-wrap gap-6 text-sm">
              {price && (
                <div>
                  <dt className="text-ink-3">{t.service.price}</dt>
                  <dd className="text-xl font-bold text-primary-text">{price}</dd>
                </div>
              )}
              {duration && (
                <div>
                  <dt className="text-ink-3">{t.service.duration}</dt>
                  <dd className="text-xl font-bold">{duration}</dd>
                </div>
              )}
            </dl>
          )}
          <CtaPair site={site} t={t} pagePath={path} place="service" className="mt-8" />
        </Container>
      </section>

      {copy?.includes && copy.includes.length > 0 && (
        <Section>
          <Container narrow>
            <h2 className="display text-2xl sm:text-3xl">{t.service.includes}</h2>
            <ul className="mt-6 space-y-3">
              {copy.includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckDot />
                  <span className="text-ink-2">{item}</span>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {renderSections(["services", "faq", "contact"], site, t, { pagePath: path, isHome: false, service })}
    </>
  );
}
