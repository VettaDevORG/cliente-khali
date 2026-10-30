import type { BlockDef } from "../types";
import Lista from "./Lista";
import Tarjetas from "./Tarjetas";

/** 08 Equipo. Names, descriptions and requirements of each variant: src/lib/variants.ts. */
const team: BlockDef = { id: "team", variants: { "01": Tarjetas, "02": Lista } };
export default team;
