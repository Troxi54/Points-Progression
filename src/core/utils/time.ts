import Decimal, { DecimalSource } from "break_eternity.js";
import createDecimal from "./decimal";
import { getPlayerState } from "@/game/player/store/store";
import offlineConfig from "@/game/offline/config";
import { MergedPlayer } from "@/game/player/merged/types";
import { isNil } from "./nil";

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
  if (
    !cachedPlayer.offlineProgress ||
    isNil(cachedPlayer.offlineProgressStartedDate)
  )
    return currentTime - player.offlineOffset;

  if (!Number.isFinite(cachedPlayer.offlineProgressStartedDate)) {
    return currentTime - player.offlineOffset;
  }

  const ticksOnTrigger = offlineConfig.ticksOnTrigger;
  if (!Number.isFinite(ticksOnTrigger) || ticksOnTrigger <= 0) {
    return currentTime - player.offlineOffset;
  }

  const offlineProgress =
    (cachedPlayer.offlineProgressTicksCompleted ?? 0) / ticksOnTrigger;

  const fullTime = Number.isFinite(cachedPlayer.offlineProgressFullTime)
    ? cachedPlayer.offlineProgressFullTime
    : 0;

  return (
    cachedPlayer.offlineProgressStartedDate +
    fullTime * offlineProgress
  );
}

export function getTimeSince(date: number): number {
  return getCurrentTime() - date;
}

export function checkElapsedTime(time: number | null): time is number {
  return time !== null && isFinite(time) && time > 0;
}

export function fixTime(
  time: number | null,
  currentTime: number = getCurrentTime(),
): number | null {
  if (time === null) return null;

  return Math.min(currentTime, time);
}

export function fixGameTime(
  mergedPlayer: MergedPlayer,
  time: number | null,
  currentTime: number = getCurrentGameTime(mergedPlayer),
) {
  return fixTime(time, currentTime);
}
