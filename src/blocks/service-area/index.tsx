import type { BlockDef } from "../types";
import Franja from "./Franja";
import Mapa from "./Mapa";

/** 09 Zona de trabajo. Names, descriptions and requirements of each variant: src/lib/variants.ts. */
const serviceArea: BlockDef = { id: "service_area", variants: { "01": Mapa, "02": Franja } };
export default serviceArea;
