import type { PlayerState, PlayerStateFacade } from "./types";
import { mergePlayer } from "@game/player/merged/utils";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { getDefaultCachedPlayer } from "../cached/default";
import { getDefaultPlayer } from "../schemas";

export const usePlayerStore = create<PlayerState>()(
  immer((set) => {
    const player = getDefaultPlayer();
    const cachedPlayer = getDefaultCachedPlayer();
    const mergedPlayer = mergePlayer(player, cachedPlayer);

    return {
      mergedPlayer,

      setPlayer: (updater) =>
        set((state) => {
          if (typeof updater === "function") {
            updater(state.mergedPlayer.player);
          } else {
            Object.assign(state.mergedPlayer.player, updater);
          }
        }),

      setCachedPlayer: (updater) =>
        set((state) => {
          if (typeof updater === "function") {
            updater(state.mergedPlayer.cachedPlayer);
          } else {
            Object.assign(state.mergedPlayer.cachedPlayer, updater);
          }
        }),

      setMergedPlayer: (updater) =>
        set((state) => {
          if (typeof updater === "function") {
            updater(state.mergedPlayer);
          } else {
            Object.assign(state.mergedPlayer, updater);
          }
        }),
    };
  }),
);

export function getPlayerState(): PlayerStateFacade {
  const { mergedPlayer, setPlayer, setCachedPlayer, setMergedPlayer } =
    usePlayerStore.getState();

  return {
    mergedPlayer,
    player: mergedPlayer.player,
    cachedPlayer: mergedPlayer.cachedPlayer,
    setPlayer,
    setCachedPlayer,
    setMergedPlayer,
  };
}
