import { create } from "zustand";
import { getDefaultPlayer } from "../default";
import { getDefaultCachedPlayer } from "../cached/default";
import { mergePlayer } from "@/game/player/merged/utils";
import { updateObject } from "@/core/utils/object";
import { PlayerState, PlayerStateFacade } from "./types";

export const usePlayerStore = create<PlayerState>((set) => {
  const player = getDefaultPlayer();
  const cachedPlayer = getDefaultCachedPlayer();
  const mergedPlayer = mergePlayer(player, cachedPlayer);

  return {
    mergedPlayer,
    setPlayer: (newPlayer) =>
      set((state) => {
        const oldPlayer = state.mergedPlayer.player;
        const updatedPlayer = updateObject(oldPlayer, newPlayer);

        if (updatedPlayer === oldPlayer) {
          return state;
        }

        return {
          mergedPlayer: {
            ...state.mergedPlayer,
            player: updatedPlayer
          }
        };
      }),

    setCachedPlayer: (newCached) =>
      set((state) => {
        const oldCached = state.mergedPlayer.cachedPlayer;
        const updatedCachedPlayer = updateObject(oldCached, newCached);

        if (updatedCachedPlayer === oldCached) {
          return state;
        }

        return {
          mergedPlayer: {
            ...state.mergedPlayer,
            cachedPlayer: updatedCachedPlayer
          }
        };
      }),

    setMergedPlayer: (newMergedPlayer) =>
      set((state) => {
        const oldPlayer = state.mergedPlayer.player;
        const oldCached = state.mergedPlayer.cachedPlayer;

        const updatedPlayer = updateObject(oldPlayer, newMergedPlayer?.player);
        const updatedCached = updateObject(
          oldCached,
          newMergedPlayer?.cachedPlayer
        );

        const hasPlayerChanged = updatedPlayer !== oldPlayer;
        const hasCachedChanged = updatedCached !== oldCached;

        if (!hasPlayerChanged && !hasCachedChanged) {
          return state;
        }

        const merged = {
          player: updatedPlayer,
          cachedPlayer: updatedCached
        };

        return { mergedPlayer: merged };
      })
  };
});

export function getPlayerState(): PlayerStateFacade {
  const { mergedPlayer, setPlayer, setCachedPlayer, setMergedPlayer } =
    usePlayerStore.getState();

  return {
    mergedPlayer,
    player: mergedPlayer.player,
    cachedPlayer: mergedPlayer.cachedPlayer,
    setPlayer,
    setCachedPlayer,
    setMergedPlayer
  };
}
