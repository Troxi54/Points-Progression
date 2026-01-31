import { getDefaultPlayer } from "./default";
import { getDefaultCachedPlayer } from "./cached/default";
import { PartialPlayer, Player, PlayerLike, ValueGetter } from "./types";
import { CachedPlayerLike, PartialCachedPlayer } from "./cached/types";
import { PartialMergedPlayer } from "./merged/types";
import { MergedPlayer } from "./merged/types";
import { CachedPlayer } from "./cached/types";
import resetGame from "@app/resetGame";
import { getPlayerState } from "./store/store";
import { PlayerState } from "./store/types";
import { NotFunction } from "@/core/types/function";
import { BooleanKeys } from "@/core/types/keys";

export function resetPlayerData() {
  const { setPlayer, setCachedPlayer } = getPlayerState();
  setPlayer(getDefaultPlayer());
  setCachedPlayer(getDefaultCachedPlayer());
}

export function resetPlayerDataAndGame() {
  resetPlayerData();
  resetGame();
}

export function parsePlayerLike<T extends PlayerLike>(
  playerLike: T,
): T extends Player | PlayerState ? Player : PartialPlayer {
  return (
    (playerLike as PlayerState)?.mergedPlayer?.player ??
    (playerLike as PartialMergedPlayer)?.player ??
    playerLike ??
    {}
  );
}

export function parseCachedPlayerLike<T extends PlayerLike>(
  cachedPlayerLike: CachedPlayerLike,
): T extends CachedPlayer | PlayerState ? CachedPlayer : PartialCachedPlayer {
  return (
    (cachedPlayerLike as PlayerState)?.mergedPlayer?.cachedPlayer ??
    (cachedPlayerLike as PartialMergedPlayer)?.cachedPlayer ??
    cachedPlayerLike ??
    {}
  );
}

export function parseValueGetter<T, P extends unknown[]>(
  valueGetter: ValueGetter<NotFunction<T>, P>,
  mergedPlayer: MergedPlayer,
  ...args: P
): T {
  if (typeof valueGetter === "function") {
    return (valueGetter as (mergedPlayer: MergedPlayer, ...args: P) => T)(
      mergedPlayer,
      ...args,
    );
  }
  return valueGetter;
}

export function togglePlayerField(field: BooleanKeys<Player>) {
  const { player, setPlayer } = getPlayerState();

  setPlayer({
    [field]: !player[field],
  });
}
