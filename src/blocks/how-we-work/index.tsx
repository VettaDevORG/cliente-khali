import type { BlockDef } from "../types";
import Fila from "./Fila";
import Linea from "./Linea";
import Tarjetas from "./Tarjetas";

/** 05 Cómo trabajamos. Names, descriptions and requirements of each variant: src/lib/variants.ts. */
const howWeWork: BlockDef = { id: "how_we_work", variants: { "01": Tarjetas, "02": Linea, "03": Fila } };
export default howWeWork;
