import type { MergedPlayer } from "@game/player/merged/types";
import type { DecimalSource } from "break_eternity.js";
import type Decimal from "break_eternity.js";
import { calculateTicksForOfflineTime } from "@game/offline/utils/calculate";
import { getPlayerState } from "@game/player/store";
import createDecimal from "./decimal";
import { fixTime, getCurrentTime } from "./time";

export function calculateTimeForRequirement(
  value: DecimalSource,
  gain: DecimalSource,
  requirement: DecimalSource,
): Decimal {
  gain = createDecimal(gain);
  if (gain.isNan() || !gain.isFinite() || gain.lessThanOrEqualTo(0)) {
    return createDecimal(Infinity);
  }

  return createDecimal(requirement)
    .minus(value)
    .dividedBy(gain)
    .multiply(1000)
    .max(0);
}

export function getCurrentGameTime(
  mergedPlayer: MergedPlayer = getPlayerState().mergedPlayer,
  currentTime: number = getCurrentTime(),
): number {
  const { player, cachedPlayer } = mergedPlayer;
  const {
    offlineProgressStartedDate,
    offlineProgressTicksCompleted,
    offlineProgressFullTime,
  } = cachedPlayer;
  const { offlineOffset } = player;

  if (!cachedPlayer.offlineProgress || offlineProgressStartedDate == null)
    return currentTime - offlineOffset;

  if (!Number.isFinite(offlineProgressStartedDate)) {
    return currentTime - offlineOffset;
  }

  const ticksOnTrigger = calculateTicksForOfflineTime(offlineProgressFullTime);
  if (!Number.isFinite(ticksOnTrigger) || ticksOnTrigger <= 0) {
    return currentTime - offlineOffset;
  }

  const offlineProgress = (offlineProgressTicksCompleted ?? 0) / ticksOnTrigger;

  const fullTime = Number.isFinite(offlineProgressFullTime)
    ? offlineProgressFullTime
    : 0;

  return offlineProgressStartedDate + fullTime * offlineProgress;
}

export function fixGameTime(
  mergedPlayer: MergedPlayer,
  time: number | null | undefined,
  currentTime: number = getCurrentGameTime(mergedPlayer),
) {
  return fixTime(time, currentTime);
}
