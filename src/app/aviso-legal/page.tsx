import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { getSite } from "@/lib/site";

export function generateMetadata(): Metadata {
  const site = getSite();
  return pageMetadata(site, {
    path: "/aviso-legal",
    title: "Aviso legal",
    description: `Identificación del titular de ${site.web.domain} y condiciones de uso de la web.`,
  });
}

/** Legal notice (LSSI) built from the legal block of the ficha. Impersonal register, independent of brand.tone. */
export default function AvisoLegalPage() {
  const site = getSite();
  const { legal, business } = site;
  const registry = legal.professional_registry;
  return (
    <LegalPage title="Aviso legal" updated={site.generated_at}>
      <h2>1. Titular de la web</h2>
      <p>
        En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico, se informa de que el
        titular de {site.web.domain} es:
      </p>
      <ul>
        <li>Titular: {legal.owner}</li>
        <li>Nombre comercial: {site.trade_name}</li>
        <li>NIF: {legal.tax_id}</li>
        <li>Domicilio: {legal.address}</li>
        <li>Actividad: {business.description}</li>
        {registry?.body && registry?.number && (
          <li>
            Colegiación o registro: {registry.body}, número {registry.number}
          </li>
        )}
        <li>Correo electrónico: {legal.privacy_email}</li>
        <li>Teléfono: {business.phone}</li>
      </ul>

      <h2>2. Uso de la web</h2>
      <p>
        El usuario puede navegar por esta web, consultar su contenido y ponerse en contacto con el titular por los medios indicados. No está
        permitido copiar los textos, el diseño o el código sin autorización escrita, ni utilizar la web para enviar comunicaciones no
        solicitadas o intentar acceder a sus sistemas.
      </p>

      <h2>3. Propiedad intelectual</h2>
      <p>
        Los textos, las imágenes propias, el diseño y el código de esta web pertenecen a su titular o se usan con licencia. Las marcas y
        logotipos de terceros que puedan aparecer pertenecen a sus propietarios.
      </p>

      <h2>4. Información sobre servicios y precios</h2>
      <p>
        Los servicios y precios publicados son orientativos y pueden variar según el trabajo concreto. El precio definitivo se comunica al
        usuario antes de empezar cualquier trabajo. {business.policies.not_offered ?? ""}
      </p>

      <h2>5. Responsabilidad</h2>
      <p>
        El titular procura que la información de la web sea correcta y esté actualizada, pero no garantiza la ausencia de errores ni la
        disponibilidad permanente del servicio. No se responde del contenido de las webs externas enlazadas.
      </p>

      <h2>6. Legislación aplicable</h2>
      <p>
        Esta web se rige por la legislación española. Para cualquier conflicto serán competentes los juzgados y tribunales del domicilio del
        titular, sin perjuicio de los derechos que correspondan al usuario como consumidor.
      </p>
    </LegalPage>
  );
}
