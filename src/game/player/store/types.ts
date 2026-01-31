import { PartialPlayer } from "../types";
import { PartialMergedPlayer } from "@/game/player/merged/types";
import { MergedPlayer } from "@/game/player/merged/types";
import { CachedPlayer } from "../cached/types";

export interface PlayerState {
  mergedPlayer: MergedPlayer;
  setPlayer: (newPlayer?: PartialPlayer) => void;
  setCachedPlayer: (newCachedPlayer?: Partial<CachedPlayer>) => void;
  setMergedPlayer: (newMergedPlayer?: PartialMergedPlayer) => void;
}

export type PlayerStateFacade = PlayerState & MergedPlayer;

export type PlayerSetterName =
  | "setPlayer"
  | "setCachedPlayer"
  | "setMergedPlayer";

export type PlayerStoreSelector = <T>(state: PlayerState) => T;
export type PlayerStoreSelectorGeneric<T> = (state: PlayerState) => T;
