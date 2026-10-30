import type { BlockDef } from "../types";
import Cifras from "./Cifras";
import TextoFoto from "./TextoFoto";
import Valores from "./Valores";

/** 02 Nosotros. Names, descriptions and requirements of each variant: src/lib/variants.ts. */
const about: BlockDef = { id: "about", variants: { "01": TextoFoto, "02": Valores, "03": Cifras } };
export default about;
