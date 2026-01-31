import { CachedPlayer, PartialCachedPlayer } from "@/game/player/cached/types";
import { PartialPlayer, Player } from "@/game/player/types";
import { MergedPlayer, MergedPlayerState, PartialMergedPlayer } from "./types";
import { objectAssign } from "@/core/utils/object";

export function mergePlayer(
  player: Player,
  cachedPlayer: CachedPlayer
): MergedPlayer {
  return { player, cachedPlayer };
}

export function mergePartialPlayer(
  player?: PartialPlayer,
  cachedPlayer?: PartialCachedPlayer
): PartialMergedPlayer {
  return { player, cachedPlayer };
}

export function assignPlayerForMergedPlayer(
  mergedPlayer: MergedPlayer | PartialMergedPlayer,
  player: PartialPlayer | undefined
) {
  if (!player) return;

  if (!mergedPlayer.player) {
    mergedPlayer.player = player;
  } else {
    objectAssign(mergedPlayer.player, player);
  }
}

export function assignCachedPlayerForMergedPlayer(
  mergedPlayer: MergedPlayer | PartialMergedPlayer,
  cachedPlayer: PartialCachedPlayer | undefined
) {
  if (!cachedPlayer) return;

  if (!mergedPlayer.cachedPlayer) {
    mergedPlayer.cachedPlayer = cachedPlayer;
  } else {
    objectAssign(mergedPlayer.cachedPlayer, cachedPlayer);
  }
}

export function assignMergedPlayer(
  mergedPlayer: MergedPlayer | PartialMergedPlayer,
  newMergedPlayer?: PartialMergedPlayer
) {
  if (!newMergedPlayer) return;

  assignPlayerForMergedPlayer(mergedPlayer, newMergedPlayer.player);
  assignCachedPlayerForMergedPlayer(mergedPlayer, newMergedPlayer.cachedPlayer);
}

export function createMergedPlayerState(
  mergedPlayer: MergedPlayer
): MergedPlayerState {
  return {
    mergedPlayer,
    assignMergedPlayer: (newMergedPlayer) =>
      assignMergedPlayer(mergedPlayer, newMergedPlayer),
    assignPlayerForMergedPlayer: (newPlayer) =>
      assignPlayerForMergedPlayer(mergedPlayer, newPlayer),
    assignCachedPlayerForMergedPlayer: (newCachedPlayer) =>
      assignCachedPlayerForMergedPlayer(mergedPlayer, newCachedPlayer)
  };
}
