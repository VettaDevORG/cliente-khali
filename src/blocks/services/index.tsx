import type { BlockDef } from "../types";
import Destacado from "./Destacado";
import Lista from "./Lista";
import Tarjetas from "./Tarjetas";

/** 03 Servicios. Names, descriptions and requirements of each variant: src/lib/variants.ts. */
const services: BlockDef = { id: "services", variants: { "01": Tarjetas, "02": Lista, "03": Destacado } };
export default services;
