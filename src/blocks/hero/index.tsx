import type { BlockDef } from "../types";
import Centrado from "./Centrado";
import Partido from "./Partido";
import Portada from "./Portada";

/** 01 Hero. Names, descriptions and requirements of each variant: src/lib/variants.ts. */
const hero: BlockDef = { id: "hero", variants: { "01": Partido, "02": Centrado, "03": Portada } };
export default hero;
