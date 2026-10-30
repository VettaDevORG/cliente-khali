import type { BlockDef } from "../types";
import Lista from "./Lista";
import Tarjetas from "./Tarjetas";

/** 04 Precios. Names, descriptions and requirements of each variant: src/lib/variants.ts. */
const pricing: BlockDef = { id: "pricing", variants: { "01": Lista, "02": Tarjetas } };
export default pricing;
