import type { DimensionData } from "../types";
import type { DimensionId } from "../ids";
import dimensionContainer from "../data";
import getDefaultDimensionData from "../default";

export function getDimensionData<T extends DimensionId>(
  dimensionId: T,
): DimensionData<T> {
  return dimensionContainer[dimensionId] ?? getDefaultDimensionData();
}
