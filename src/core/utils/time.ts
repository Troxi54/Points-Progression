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
  return createDecimal(requirement)
    .minus(currencyValue)
    .dividedBy(currencyGain)
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

  const offlineProgress =
    (cachedPlayer.offlineProgressTicksCompleted ?? 0) /
    offlineConfig.ticksOnTrigger;

  return (
    cachedPlayer.offlineProgressStartedDate +
    (cachedPlayer.offlineProgressFullTime ?? 0) * offlineProgress
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
