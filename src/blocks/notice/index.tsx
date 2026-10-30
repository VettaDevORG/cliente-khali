import type { BlockDef } from "../types";
import Franja from "./Franja";
import Tarjeta from "./Tarjeta";

/** 13 Aviso. Names, descriptions and requirements of each variant: src/lib/variants.ts. */
const notice: BlockDef = { id: "notice", variants: { "01": Franja, "02": Tarjeta } };
export default notice;
