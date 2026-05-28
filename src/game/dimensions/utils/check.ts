import type { MergedPlayer } from "@game/player/merged/types";
import type { DimensionId } from "../types";
import { parseValueGetter } from "@game/player/utils";
import { isDimension } from "./compare";
import { getDimensionData } from "./get";

export function shouldDimensionWork(
  mergedPlayer: MergedPlayer,
  dimensionId: DimensionId,
): boolean {
  const currentId = mergedPlayer.player.dimensionId;
  if (isDimension(currentId, dimensionId)) return true;

  const currentDimensionData = getDimensionData(currentId);

  const pause = currentDimensionData.pauseOtherDimensions;
  if (typeof pause === "boolean" || typeof pause === "function") {
    return !parseValueGetter(pause, mergedPlayer);
  }

  const value = pause[dimensionId];

  if (value === undefined) return false;

  const should = !parseValueGetter(value, mergedPlayer);
  return should;
}
