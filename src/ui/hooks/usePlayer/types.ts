import type { PlayerState } from "@game/player/store/types";
import type { Player } from "@game/player/schemas";

export interface UsePlayerOptions {
  useFormat: boolean;
}

export interface UsePlayerAdditionalSelector {
  numberNotation: Player["numberNotation"];
}

export type UsePlayerFieldsOptions<T> = Partial<UsePlayerOptions> & {
  selector?: (state: PlayerState) => T;
};

export type PlayerSelectorFn = (state: PlayerState) => unknown;
