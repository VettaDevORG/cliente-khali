import type { BlockDef } from "../types";
import Columnas from "./Columnas";
import Compacto from "./Compacto";

/** 12 Horario y dirección. Names, descriptions and requirements of each variant: src/lib/variants.ts. */
const hoursAddress: BlockDef = { id: "hours_address", variants: { "01": Columnas, "02": Compacto } };
export default hoursAddress;
