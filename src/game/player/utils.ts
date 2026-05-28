import type { NotFunction } from "@core/types/function";
import type { BooleanKeys } from "@core/types/keys";
import type { CachedPlayer, CachedPlayerLike, PartialCachedPlayer  } from "./cached/types";
import type { MergedPlayer, PartialMergedPlayer  } from "./merged/types";
import type { PlayerState } from "./store/types";
import type { PartialPlayer, Player, PlayerLike, ValueGetter } from "./types";
import resetGame from "@main/resetGame";
import { getDefaultCachedPlayer } from "./cached/default";
import { getDefaultPlayer } from "./default";
import { getPlayerState } from "./store";

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
