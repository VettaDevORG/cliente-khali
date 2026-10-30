import type { BlockDef } from "../types";
import Destacada from "./Destacada";
import Franja from "./Franja";
import Tarjetas from "./Tarjetas";

/** 06 Opiniones. Names, descriptions and requirements of each variant: src/lib/variants.ts. */
const testimonials: BlockDef = { id: "testimonials", variants: { "01": Tarjetas, "02": Destacada, "03": Franja } };
export default testimonials;
