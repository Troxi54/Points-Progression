import { create } from "zustand";
import { CachedPlayer, Player } from "./playerTypes";
import { getDefaultCachedPlayer, getDefaultPlayer } from "./defaultPlayer";
import { useShallow } from "zustand/shallow";
import Decimal from "break_eternity.js";

interface PlayerState {
  player: Player;
  cachedPlayer: CachedPlayer;
  setPlayer: (newPlayer?: Partial<Player>) => void;
  setCachedPlayer: (newCachedPlayer?: Partial<CachedPlayer>) => void;
}

export const usePlayerStore = create<PlayerState>((set) => {
  return {
    player: getDefaultPlayer(),
    cachedPlayer: getDefaultCachedPlayer(),
    setPlayer: (newPlayer) =>
      set((state) => ({
        player: smartMergeDecimalObject(state.player, newPlayer ?? {})
      })),
    setCachedPlayer: (newCachedPlayer) =>
      set((state) => ({
        cachedPlayer: smartMergeDecimalObject(
          state.cachedPlayer,
          newCachedPlayer ?? {}
        )
      }))
  };
});

export const usePlayer = <T>(selector: (state: PlayerState) => T): T =>
  usePlayerStore(useShallow(selector));

function smartMergeDecimalObject<T>(oldObj: T, newObj: Partial<T>): T {
  const result = { ...oldObj };

  for (const key in newObj) {
    if (!Object.prototype.hasOwnProperty.call(newObj, key)) continue;

    const k = key as keyof T;
    const oldVal = oldObj[k];
    const newVal = newObj[k];

    if (
      oldVal instanceof Decimal &&
      newVal instanceof Decimal &&
      !oldVal.equals(newVal)
    ) {
      result[k] = newVal as T[typeof k];
    } else if (
      !(oldVal instanceof Decimal && newVal instanceof Decimal) &&
      oldVal !== newVal
    ) {
      result[k] = newVal as T[typeof k];
    }
  }

  return result;
}
