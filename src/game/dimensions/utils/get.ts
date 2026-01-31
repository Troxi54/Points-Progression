import dimensionContainer from "../data";
import getDefaultDimensionData from "../default";
import { DimensionData, DimensionId } from "../types";

export function getDimensionData<T extends DimensionId>(
  dimensionId: T
): DimensionData<T> {
  return dimensionContainer[dimensionId] ?? getDefaultDimensionData();
}
