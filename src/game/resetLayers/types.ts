import { CurrencyId } from "@/game/currencies/types";
import { DimensionId } from "@/game/dimensions/types";
import { PartialBut } from "@/core/types/partial";
import { CachedResetLayer } from "@/game/player/cached/types";
import { BooleanGetter, ResetLayerPlayerData } from "@/game/player/types";
import { PartialMergedPlayer } from "@/game/player/merged/types";
import { MergedPlayer } from "@/game/player/merged/types";
import Decimal from "break_eternity.js";
import { UsePlayerFn } from "@/ui/hooks/usePlayerTypes";

export interface ResetLayerIds {
  normal: "reset" | "tier" | "vermyros" | "nullith";
  sliph: "mallirt" | "level";
}

export type ResetLayerId = ResetLayerIds[keyof ResetLayerIds];

export interface ResetLayerData<T extends DimensionId = DimensionId> {
  id: ResetLayerIds[T];
  goal: Decimal;
  currency: CurrencyId;
  usePlayer: UsePlayerFn | null;
  reset: (
    mergedPlayer: MergedPlayer,
    defaultMergedPlayer: MergedPlayer,
    currentTime: number
  ) => PartialMergedPlayer;
  preventReset: BooleanGetter;
  canPerform: BooleanGetter;
  reward: (
    mergedPlayer: MergedPlayer,
    spentTime: number | null
  ) => PartialMergedPlayer;
}

export type PartialResetLayerData<T extends DimensionId = DimensionId> =
  PartialBut<ResetLayerData<T>, "id">;

export interface FullResetLayerData<
  T extends DimensionId = DimensionId
> extends ResetLayerData<T> {
  dimensionId: T;
}

export type DefaultResetLayerData = Omit<ResetLayerData, "id">;

export type ResetLayerDataContainer = {
  [K in DimensionId]: FullResetLayerData<K>[];
};

export type PartialResetLayerDataContainer = {
  [K in DimensionId]: PartialResetLayerData<K>[];
};

export type FlatResetLayerContainer = Record<ResetLayerId, FullResetLayerData>;

export type ResetLayerPlayerSelector<
  T extends ResetLayerId = ResetLayerId,
  P extends keyof ResetLayerPlayerData = keyof ResetLayerPlayerData
> = `resetLayer_${T}_${P}`;
export type ResetLayerCachedPlayerSelector<
  T extends ResetLayerId = ResetLayerId,
  P extends keyof CachedResetLayer = keyof CachedResetLayer
> = `cachedResetLayer_${T}_${P}`;

export type LayerNumber = number | null;

export type TimeSpentResetLayerData = [boolean, string, string][];
