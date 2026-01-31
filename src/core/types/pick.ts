import { PlayerSetterName } from "@/game/player/store/types";
import { PlayerState } from "@/game/player/store/types";

export type PickByKeys<
  T,
  K extends readonly (keyof T)[] | undefined
> = K extends readonly (keyof T)[] ? Pick<T, K[number]> : object;

export type PickSetters<S extends readonly PlayerSetterName[] | undefined> =
  S extends readonly PlayerSetterName[]
    ? { [K in S[number]]: PlayerState[K] }
    : object;
