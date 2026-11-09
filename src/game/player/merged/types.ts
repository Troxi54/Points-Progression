import type {
  CachedPlayer,
  PartialCachedPlayer,
} from "@game/player/cached/types";
import type { PartialPlayer } from "@game/player/types";
import type { Player } from "../schemas";

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
  player: MergedPlayer["player"];
  cachedPlayer: MergedPlayer["cachedPlayer"];
}
