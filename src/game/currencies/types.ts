import type { EffectMode } from "@core/types/effect";
import type { DecimalKeys } from "@core/types/keys";
import type { DimensionId } from "@game/dimensions/types";
import type { CachedCurrency } from "@game/player/cached/types";
import type { BooleanGetter, Player } from "@game/player/types";

export type CurrencyId = DecimalKeys<
  Pick<
    Player,
    | "points"
    | "madeTierTimes"
    | "ampliflux"
    | "vermytes"
    | "vermora"
    | "energyReactors"
    | "energy"
    | "cores"
    | "darkEnergy"
    | "madeNullithResets"
    | "nullions"
    | "dertoints"
    | "mallirtTotalDertoints"
    | "cappergy"
    | "score"
    | "XP"
    | "nux"
    | "amplivoid"
    | "xagytes"
    | "xagoraDertoints"
    | "xagoraPoints"
    | "xagoraNullithResets"
    | "xagoraNux"
    | "antiPoints"
    | "beneflux"
  >
>;

export interface CurrencyConfig<PE extends boolean = false> {
  dimensionId: DimensionId;
  layer: number | null;
  name: string | null | undefined;
  passiveGainWorks: BooleanGetter;
  affects:
    | Partial<
        Record<
          CurrencyId,
          PE extends true ? Partial<CurrencyEffectData> : CurrencyEffectData
        >
      >
    | CurrencyId
    | null;
  effectMode: EffectMode;
  effectWorks: BooleanGetter;
}

export interface CurrencyEffectData {
  mode?: EffectMode;
  works: BooleanGetter;
}

export type CurrencyContainerConfig = Record<CurrencyId, CurrencyConfig>;

export type PartialCurrencyConfig = Partial<CurrencyConfig<true>>;
export type PartialCurrencyContainerConfig = Record<
  CurrencyId,
  PartialCurrencyConfig
>;

export type CachedCurrencyPropSelection<
  C extends CurrencyId,
  P extends keyof CachedCurrency,
> = `cachedCurrency_${C}_${P}`;

export type CachedCurrencyEffectSelection<
  C extends CurrencyId,
  EC extends CurrencyId,
> = `cachedCurrency_${C}_effect_${EC}`;
