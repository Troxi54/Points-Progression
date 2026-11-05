import type { DimensionId } from "../ids";

export function isDimension(
  dimLeft: DimensionId,
  dimRight: DimensionId,
): boolean {
  return dimLeft === dimRight;
}
