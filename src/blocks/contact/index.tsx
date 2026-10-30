import type { BlockDef } from "../types";
import Centrado from "./Centrado";
import FormularioDatos from "./FormularioDatos";
import Franja from "./Franja";

/** 11 Contacto. Names, descriptions and requirements of each variant: src/lib/variants.ts. */
const contact: BlockDef = { id: "contact", variants: { "01": FormularioDatos, "02": Centrado, "03": Franja } };
export default contact;
