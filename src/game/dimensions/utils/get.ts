import type { DimensionId } from "../ids";
import type { DimensionData } from "../types";
import dimensionContainer from "../data";
import getDefaultDimensionData from "../default";

export function getDimensionData<T extends DimensionId>(
  dimensionId: T,
): DimensionData<T> {
  return dimensionContainer[dimensionId] ?? getDefaultDimensionData();
}
