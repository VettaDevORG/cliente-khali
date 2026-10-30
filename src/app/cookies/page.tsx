import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { getSite } from "@/lib/site";

export function generateMetadata(): Metadata {
  const site = getSite();
  return pageMetadata(site, {
    path: "/cookies",
    title: "Política de cookies",
    description: `Qué cookies usa ${site.web.domain} y cómo cambiar la elección.`,
  });
}

/** Cookie policy: with GA4 configured, the consent entry and the analytics cookies; without it, the site sets none. */
export default function CookiesPage() {
  const site = getSite();
  const analytics = Boolean(site.web.ga4_measurement_id);
  return (
    <LegalPage title="Política de cookies" updated={site.generated_at}>
      <p className="mt-4">
        Una cookie es un pequeño fichero que la web guarda en el navegador del usuario.{" "}
        {analytics ? "Esta web usa muy pocas y ninguna de publicidad." : "Esta web no usa cookies de seguimiento ni de publicidad."}
      </p>

      {analytics ? (
        <>
          <h2>Cookies que se usan</h2>
          <ul>
            <li>
              <strong>Técnica, siempre activa:</strong> una entrada en el almacenamiento local del navegador que recuerda si el usuario
              aceptó o rechazó las cookies de analítica. No identifica a nadie.
            </li>
            <li>
              <strong>Analítica, solo si se acepta:</strong> Google Analytics 4, para saber qué páginas se visitan y desde dónde. La IP se
              anonimiza y los datos se conservan 14 meses. Hasta que el usuario acepta, no se carga ningún script de Google.
            </li>
          </ul>

          <h2>Cómo cambiar la elección</h2>
          <p>
            Borrando los datos de este sitio en la configuración del navegador, el aviso vuelve a aparecer en la siguiente visita. También
            se pueden bloquear las cookies de terceros en el navegador.
          </p>
        </>
      ) : (
        <>
          <h2>Qué guarda la web en el navegador</h2>
          <p>
            Nada que identifique al usuario. El mapa de la página de contacto se carga solo cuando el usuario pulsa el botón correspondiente;
            en ese momento Google puede instalar sus propias cookies, según su política.
          </p>
        </>
      )}

      <h2>Más información</h2>
      <p>
        El tratamiento de los datos está explicado en la <Link href="/privacidad">política de privacidad</Link>.
      </p>
    </LegalPage>
  );
}
