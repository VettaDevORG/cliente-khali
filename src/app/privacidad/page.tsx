import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { getSite } from "@/lib/site";

export function generateMetadata(): Metadata {
  const site = getSite();
  return pageMetadata(site, {
    path: "/privacidad",
    title: "Política de privacidad",
    description: `Qué datos recoge ${site.web.domain}, para qué se usan y qué derechos tiene el usuario.`,
  });
}

/** Privacy policy (RGPD) built from the ficha: controller, form data, analytics only with consent, processors, rights. */
export default function PrivacidadPage() {
  const site = getSite();
  const { legal, business } = site;
  const analytics = Boolean(site.web.ga4_measurement_id);
  return (
    <LegalPage title="Política de privacidad" updated={site.generated_at}>
      <p className="mt-4">
        Esta página explica qué datos personales se recogen en {site.web.domain}, para qué se usan y qué derechos tiene el usuario. Se recoge
        solo lo necesario para responder a las consultas{analytics ? " y para saber qué páginas de la web funcionan" : ""}.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li>Responsable: {legal.owner}</li>
        <li>NIF: {legal.tax_id}</li>
        <li>Domicilio: {legal.address}</li>
        <li>Correo para privacidad: {legal.privacy_email}</li>
      </ul>

      <h2>2. Qué datos se recogen</h2>
      <ul>
        <li>
          Los que el usuario envía por el formulario de contacto: nombre, teléfono o correo electrónico, el servicio que le interesa y el
          mensaje. El formulario lo gestiona Netlify Forms, que lo reenvía por correo electrónico al responsable.
        </li>
        <li>
          Los que el usuario envía al escribir por WhatsApp o llamar por teléfono: los que decida compartir en esa conversación, que se tratan
          en el móvil del responsable.
        </li>
        {analytics && (
          <li>
            Datos de uso anónimos de Google Analytics 4, solo si el usuario acepta las cookies: páginas vistas, dispositivo, ubicación
            aproximada y origen de la visita, con la dirección IP anonimizada.
          </li>
        )}
        <li>
          Datos técnicos que el navegador envía al servidor de Netlify, donde está alojada la web: dirección IP, agente de usuario y fecha,
          con fines de seguridad.
        </li>
      </ul>
      {legal.health_data && (
        <p>
          El formulario y el WhatsApp de esta web no están pensados para datos de salud. Esa información se trata únicamente en la consulta o
          por teléfono, con las garantías que exige su categoría especial.
        </p>
      )}

      <h2>3. Para qué se usan</h2>
      <ul>
        <li>Responder a la consulta y, si el usuario lo pide, preparar un presupuesto o una cita.</li>
        {analytics && <li>Mejorar la web a partir de estadísticas agregadas.</li>}
        <li>Cumplir las obligaciones legales del responsable.</li>
      </ul>
      <p>Los datos no se venden ni se ceden a terceros con fines comerciales.</p>

      <h2>4. Base legal</h2>
      <p>
        El consentimiento del usuario al enviar el formulario{analytics ? " o aceptar las cookies" : ""}, y el interés legítimo del responsable
        en mantener la web segura. Si se contrata un servicio, la base es la ejecución del contrato.
      </p>

      <h2>5. Cuánto tiempo se conservan</h2>
      <p>
        Los mensajes del formulario, hasta 12 meses desde el último contacto, salvo que den lugar a una relación contractual.
        {analytics ? " Los datos de analítica, 14 meses." : ""} El usuario puede pedir que se borren antes.
      </p>

      <h2>6. Encargados del tratamiento</h2>
      <p>
        Netlify, Inc. (alojamiento y formularios){analytics ? " y Google Ireland Ltd. (analítica, solo con consentimiento)" : ""} tratan datos
        por cuenta del responsable. Ambos ofrecen garantías para las transferencias fuera del Espacio Económico Europeo conforme al RGPD.
      </p>

      <h2>7. Derechos del usuario</h2>
      <p>
        El usuario puede acceder a sus datos, rectificarlos, pedir que se borren, oponerse al tratamiento, limitarlo o pedir su portabilidad
        escribiendo a {legal.privacy_email}. Se responde en un máximo de 30 días. También puede reclamar ante la Agencia Española de
        Protección de Datos en aepd.es.
      </p>

      <h2>8. Cookies</h2>
      <p>
        {analytics
          ? "Esta web solo usa cookies de analítica y solo si el usuario las acepta en el aviso. "
          : "Esta web no instala cookies de seguimiento. "}
        El detalle está en la <Link href="/cookies">política de cookies</Link>.
      </p>

      <h2>9. Cambios</h2>
      <p>Si esta política cambia, se actualiza la fecha de arriba. La versión vigente es siempre la publicada en esta página.</p>
      <p className="text-sm">Teléfono de contacto: {business.phone}. Correo público: {business.public_email}.</p>
    </LegalPage>
  );
}
