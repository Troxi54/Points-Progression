import type { PlayerState } from "@game/player/store/types";
import type { Player } from "@game/player/types";

export interface UsePlayerOptions {
  useFormat: boolean;
}

export interface UsePlayerAdditionalSelector {
  exponentialNotation: Player["exponentialNotation"];
}

export type UsePlayerFieldsOptions<T> = Partial<UsePlayerOptions> & {
  additionalSelectors?: (state: PlayerState) => T;
};

export type PlayerSelectorFn = (state: PlayerState) => unknown;
