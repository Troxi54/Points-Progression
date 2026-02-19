import { usePlayerStore } from "@/game/player/store/store";
import {
  PlayerSetterName,
  PlayerStoreSelectorGeneric,
} from "@/game/player/store/types";
import { PlayerState } from "@/game/player/store/types";
import { Player, UsePlayerFieldsReturn } from "@/game/player/types";
import { CachedPlayer } from "@/game/player/cached/types";
import {
  assignKey,
  isObject,
  mergeObjects,
  objectKeys,
} from "@/core/utils/object";
import {
  UsePlayerAdditionalSelector,
  UsePlayerFieldsOptions,
  UsePlayerOptions,
} from "./types";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { isDecimal } from "@/core/utils/decimal";

const usePlayerDefaultOptions: UsePlayerOptions = {
  useFormat: false,
};

function storeComparer<T, O>(a: T, b: O): boolean {
  const isAObject = isObject(a);
  const isBObject = isObject(b);

  if (!isAObject || !isBObject) {
    return Object.is(a, b);
  }

  if (isDecimal(a) && isDecimal(b)) {
    return a.equals(b);
  }

  const bothObjects = isAObject && isBObject;
  if (bothObjects) {
    const keysA = objectKeys(a);
    const keysB = objectKeys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    for (const keyA of keysA) {
      if (!(keyA in b)) return false;

      const valueA = a[keyA];
      const valueB = b[keyA as unknown as keyof typeof b];

      if (isDecimal(valueA) && isDecimal(valueB) && valueA.notEquals(valueB)) {
        return false;
      }

      const bothValuesAreObjects = isObject(valueA) && isObject(valueB);
      if (bothValuesAreObjects) continue;

      if (!Object.is(valueA, valueB)) {
        return false;
      }
    }
  }

  return true;
}

export function usePlayer<T>(
  selector: PlayerStoreSelectorGeneric<T>,
  options?: Partial<UsePlayerOptions>,
): T {
  const fullOptions = mergeObjects(usePlayerDefaultOptions, options);

  const fullSelector: PlayerStoreSelectorGeneric<T> = (state) => {
    const baseSelector = selector(state);
    const additionalSelector: UsePlayerAdditionalSelector = {
      exponentialNotation: state.mergedPlayer.player.exponentialNotation,
    };

    return fullOptions.useFormat
      ? mergeObjects(baseSelector, additionalSelector)
      : baseSelector;
  };

  return useStoreWithEqualityFn(usePlayerStore, fullSelector, storeComparer);
}

export function usePlayerFields<
  KP extends readonly (keyof Player)[] | undefined,
  KC extends readonly (keyof CachedPlayer)[] | undefined,
  S extends PlayerSetterName[] | undefined = undefined,
  O extends object = object,
>(
  fields: {
    player?: KP;
    cachedPlayer?: KC;
    setters?: S;
  },
  options?: UsePlayerFieldsOptions<O>,
): UsePlayerFieldsReturn<KP, KC, S> & O {
  const state = usePlayer((state) => {
    const playerState = {} as KP extends readonly (keyof Player)[]
      ? Pick<Player, KP[number]>
      : object;

    const cachedPlayerState = {} as KC extends readonly (keyof CachedPlayer)[]
      ? Pick<CachedPlayer, KC[number]>
      : object;

    fields.player?.forEach((field) => {
      assignKey(playerState, field, state.mergedPlayer.player[field]);
    });

    fields.cachedPlayer?.forEach((field) => {
      assignKey(
        cachedPlayerState,
        field,
        state.mergedPlayer.cachedPlayer[field],
      );
    });

    const mergedPlayer = mergeObjects(playerState, cachedPlayerState);

    const setterState = {} as S extends readonly PlayerSetterName[]
      ? { [K in S[number]]: PlayerState[K] }
      : object;
    fields.setters?.forEach((setter) =>
      assignKey(setterState, setter, state[setter]),
    );

    const baseState = mergeObjects(mergedPlayer, setterState);
    const fullState = mergeObjects(
      baseState,
      options?.additionalSelectors?.(state),
    );

    return fullState;
  }, options);

  return state;
}
