import type { PickByKeys, PickSetters } from "@core/types/pick";
import type { ResetLayerPlayerData } from "@game/resetLayers/playerData";
import type { CachedPlayer } from "./cached/types";
import type { MergedPlayer, PartialMergedPlayer } from "./merged/types";
import type { Player } from "./schemas";
import type { PlayerSetterName, PlayerState } from "./store/types";

export type PartialResetLayerPlayerData = Partial<ResetLayerPlayerData>;

export type PartialPlayer = Partial<Player>;

export type UsePlayerFieldsReturn<
  KP extends readonly (keyof Player)[] | undefined,
  KC extends readonly (keyof CachedPlayer)[] | undefined,
  S extends readonly PlayerSetterName[] | undefined,
> = PickByKeys<Player, KP> & PickByKeys<CachedPlayer, KC> & PickSetters<S>;

export type PlayerLike =
  Player | PartialPlayer | PartialMergedPlayer | PlayerState | undefined;

export type ValueGetter<T, P extends unknown[] = []> =
  T | ((mergedPlayer: MergedPlayer, ...args: P) => T);
export type BooleanGetter = ValueGetter<boolean>;

export type MinifiedPlayer = (Player[keyof Player] | null)[];
