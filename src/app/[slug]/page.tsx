import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { renderSections } from "@/blocks";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/PageHeader";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { getSite, getT, innerPages } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return innerPages(getSite()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const site = getSite();
  const page = innerPages(site).find((p) => p.slug === slug);
  if (!page) return {};
  return pageMetadata(site, { path: `/${slug}`, title: page.title, description: page.description ?? site.business.description });
}

/** Inner pages of the full website: products.web.pages with a slug. */
export default async function InnerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = getSite();
  const t = getT(site);
  const page = innerPages(site).find((p) => p.slug === slug);
  if (!page) notFound();
  const path = `/${slug}`;
  return (
    <>
      <JsonLd
        data={breadcrumbSchema(site, [
          { name: t.home, path: "/" },
          { name: page.title, path },
        ])}
      />
      {!page.sections.includes("hero") && <PageHeader title={page.title} description={page.description} />}
      {renderSections(page.sections, site, t, { pagePath: path, isHome: false, pageTitle: page.sections.includes("hero") ? undefined : page.title })}
    </>
  );
}
