import { DimensionId } from "../types";

export function isDimension(
  dimLeft: DimensionId,
  dimRight: DimensionId
): boolean {
  return dimLeft === dimRight;
}
