import type { MergedPlayer } from "@game/player/merged/types";
import type { Draft } from "immer";

export type DraftUpdater<T> = Partial<T> | ((draft: Draft<T>) => void);

export interface PlayerState {
  mergedPlayer: MergedPlayer;
  setPlayer: (updater: DraftUpdater<MergedPlayer["player"]>) => void;
  setCachedPlayer: (
    updater: DraftUpdater<MergedPlayer["cachedPlayer"]>,
  ) => void;
  setMergedPlayer: (updater: DraftUpdater<MergedPlayer>) => void;
}

export type PlayerStateFacade = PlayerState & MergedPlayer;

export type PlayerSetterName =
  "setPlayer" | "setCachedPlayer" | "setMergedPlayer";

export type PlayerStoreSelector = <T>(state: PlayerState) => T;
export type PlayerStoreSelectorGeneric<T> = (state: PlayerState) => T;
