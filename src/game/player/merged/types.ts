import { CachedPlayer, PartialCachedPlayer } from "@/game/player/cached/types";
import { PartialPlayer, Player } from "@/game/player/types";

export interface MergedPlayer {
  player: Player;
  cachedPlayer: CachedPlayer;
}

export interface PartialMergedPlayer {
  player?: PartialPlayer;
  cachedPlayer?: PartialCachedPlayer;
}

export interface MergedPlayerState {
  mergedPlayer: MergedPlayer;
  assignMergedPlayer: (newMergedPlayer?: PartialMergedPlayer) => void;
  assignPlayerForMergedPlayer: (newPlayer?: PartialPlayer) => void;
  assignCachedPlayerForMergedPlayer: (
    newCachedPlayer?: PartialCachedPlayer
  ) => void;
}
