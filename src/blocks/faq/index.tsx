import type { BlockDef } from "../types";
import Acordeon from "./Acordeon";
import Columnas from "./Columnas";

/** 10 Preguntas frecuentes. Names, descriptions and requirements of each variant: src/lib/variants.ts. */
const faq: BlockDef = { id: "faq", variants: { "01": Acordeon, "02": Columnas } };
export default faq;
