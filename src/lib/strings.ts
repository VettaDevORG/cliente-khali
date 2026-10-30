/**
 * Interface texts in Spanish, in the two forms of address the ficha allows (brand.tone).
 * Legal pages use an impersonal register and live in their own files.
 */
const tu = {
  skipToContent: "Saltar al contenido",
  menu: "Menú",
  closeMenu: "Cerrar menú",
  home: "Inicio",
  cta: {
    whatsapp: "Escríbenos por WhatsApp",
    whatsappShort: "WhatsApp",
    call: "Llámanos",
    callShort: "Llamar",
    form: "Pide información",
    formShort: "Escríbenos",
    seeServices: "Ver servicios",
    seeMore: "Ver más",
    seeMap: "Ver mapa",
    directions: "Cómo llegar",
    back: "Volver",
  },
  /** Section titles, by block id. */
  sections: {
    hero: "Inicio",
    about: "Quiénes somos",
    services: "Servicios",
    pricing: "Precios",
    how_we_work: "Cómo trabajamos",
    testimonials: "Opiniones",
    gallery: "Galería",
    team: "Equipo",
    service_area: "Zona de trabajo",
    faq: "Preguntas frecuentes",
    contact: "Contacto",
    hours_address: "Horario y dirección",
    notice: "Aviso",
  },
  /** Shorter labels for the navigation, where a title is too long. */
  navLabels: {
    about: "Nosotros",
    faq: "Preguntas",
    hours_address: "Horario",
  } as Partial<Record<string, string>>,
  hero: { hoursLabel: "Horario" },
  about: { kicker: "Nosotros", values: "Lo que nos define" },
  services: { fromPrice: "desde", quote: "A presupuesto", duration: "aprox.", allServices: "Todos los servicios" },
  pricing: {
    lead: "Precios claros. Lo que no está aquí, te lo decimos antes de empezar.",
    paymentLabel: "Formas de pago",
  },
  testimonials: { seeOnGoogle: "Ver reseña", allOnGoogle: "Ver todas las opiniones en Google" },
  gallery: { prev: "Fotos anteriores", next: "Fotos siguientes" },
  team: { lead: "Las personas que te van a atender." },
  area: { lead: "Trabajamos en", and: "y", notOffered: "Qué no hacemos" },
  hours: {
    title: "Horario",
    holidays: "Días que cerramos",
    address: "Dirección",
    phone: "Teléfono",
    email: "Correo",
    social: "Redes",
  },
  contact: {
    title: "¿Hablamos?",
    lead: "Cuéntanos qué necesitas y te respondemos lo antes posible.",
    leadDirect: "Llámanos o escríbenos por WhatsApp. Respondemos en horario de apertura.",
    orForm: "o cuéntanos por escrito",
    name: "Tu nombre",
    contactField: "Teléfono o correo",
    contactPlaceholder: "600 000 000 o tu@correo.com",
    service: "Qué necesitas",
    serviceOther: "Otra cosa",
    message: "Cuéntanos más",
    messagePlaceholder: "Qué te pasa, cuándo te viene bien, lo que creas que ayuda.",
    submit: "Enviar",
    sending: "Enviando…",
    successTitle: "Recibido. Te contestamos lo antes posible.",
    successText: "Si tienes prisa, escríbenos por WhatsApp o llámanos.",
    errorText: "No se ha podido enviar. Escríbenos por WhatsApp o al correo",
    privacy: "Solo usamos tus datos para responderte.",
    privacyLink: "Política de privacidad",
    healthWarning: "No escribas datos de salud en este formulario: cuéntanoslos por teléfono.",
    orDirect: "O directamente",
  },
  cookies: {
    message: "Usamos cookies de analítica para saber qué páginas funcionan. Tú decides.",
    accept: "Aceptar",
    reject: "Rechazar",
    more: "Más información",
  },
  footer: { legal: "Aviso legal", privacy: "Privacidad", cookies: "Cookies", madeBy: "Web hecha por" },
  notFound: {
    kicker: "Error 404",
    title: "Esta página no existe.",
    text: "Puede que el enlace sea antiguo. Lo que buscas seguramente está en la portada.",
    home: "Ir a la portada",
  },
  service: { includes: "Qué incluye", price: "Precio", duration: "Duración", otherServices: "Otros servicios" },
};

const usted: typeof tu = {
  ...tu,
  cta: {
    ...tu.cta,
    whatsapp: "Escríbanos por WhatsApp",
    call: "Llámenos",
    form: "Solicite información",
    formShort: "Escríbanos",
  },
  pricing: {
    ...tu.pricing,
    lead: "Precios claros. Lo que no está aquí se lo indicamos antes de empezar.",
  },
  team: { lead: "Las personas que le van a atender." },
  contact: {
    ...tu.contact,
    lead: "Cuéntenos qué necesita y le respondemos lo antes posible.",
    leadDirect: "Llámenos o escríbanos por WhatsApp. Respondemos en horario de apertura.",
    orForm: "o cuéntenos por escrito",
    name: "Su nombre",
    contactPlaceholder: "600 000 000 o su@correo.com",
    service: "Qué necesita",
    message: "Cuéntenos más",
    messagePlaceholder: "Qué necesita, cuándo le viene bien, lo que crea que ayuda.",
    successTitle: "Recibido. Le contestamos lo antes posible.",
    successText: "Si tiene prisa, escríbanos por WhatsApp o llámenos.",
    errorText: "No se ha podido enviar. Escríbanos por WhatsApp o al correo",
    privacy: "Solo usamos sus datos para responderle.",
    healthWarning: "No escriba datos de salud en este formulario: cuéntenoslos por teléfono.",
  },
  cookies: {
    ...tu.cookies,
    message: "Usamos cookies de analítica para saber qué páginas funcionan. Usted decide.",
  },
  notFound: {
    ...tu.notFound,
    text: "Puede que el enlace sea antiguo. Lo que busca seguramente está en la portada.",
  },
};

export type Strings = typeof tu;
export const strings: Record<"tu" | "usted", Strings> = { tu, usted };
export function getStrings(tone: "tu" | "usted"): Strings {
  return strings[tone];
}
