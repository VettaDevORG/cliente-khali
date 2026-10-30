import type { BlockDef } from "../types";
import Mosaico from "./Mosaico";
import Rejilla from "./Rejilla";
import Tira from "./Tira";

/** 07 Galería. Names, descriptions and requirements of each variant: src/lib/variants.ts. */
const gallery: BlockDef = { id: "gallery", variants: { "01": Rejilla, "02": Mosaico, "03": Tira } };
export default gallery;
