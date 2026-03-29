import Decimal, { DecimalSource } from "break_eternity.js";
import createDecimal from "./decimal";
import { getPlayerState } from "@game/player/store";
import { MergedPlayer } from "@game/player/merged/types";
import { isNil } from "./nil";
import { calculateTicksForOfflineTime } from "@game/offline/utils/calculate";
import { Nil } from "@core/types/primitives";

export function calculateTimeForRequirement(
  currencyValue: DecimalSource,
  currencyGain: DecimalSource,
  requirement: DecimalSource,
): Decimal {
  const gain = createDecimal(currencyGain);
  if (gain.isNan() || !gain.isFinite() || gain.lessThanOrEqualTo(0)) {
    return createDecimal(Infinity);
  }

  return createDecimal(requirement)
    .minus(currencyValue)
    .dividedBy(gain)
    .multiply(1000)
    .max(0);
}

export function getCurrentTime(): number {
  return performance.timeOrigin + performance.now();
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

  if (!cachedPlayer.offlineProgress || isNil(offlineProgressStartedDate))
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

export function getTimeSince(date: number): number {
  return getCurrentTime() - date;
}

export function checkElapsedTime(time: number | null): time is number {
  return time !== null && isFinite(time) && time > 0;
}

export function fixTime(
  time: number | Nil,
  currentTime: number = getCurrentTime(),
): number | null {
  if (isNil(time)) return null;

  return Math.min(currentTime, time);
}

export function fixGameTime(
  mergedPlayer: MergedPlayer,
  time: number | Nil,
  currentTime: number = getCurrentGameTime(mergedPlayer),
) {
  return fixTime(time, currentTime);
}
