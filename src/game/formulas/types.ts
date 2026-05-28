import type { CurrencyId } from "@game/currencies/types";
import type { DimensionId } from "@game/dimensions/types";
import type { MergedPlayer } from "@game/player/merged/types";
import type Decimal from "break_eternity.js";

export type Formula<T extends unknown[] = [], R = Decimal> = (
  mergedPlayer: MergedPlayer,
  ...args: T
) => R;

export type FormulaContainer = Record<string, Formula<any[], any>>;

export type LayerFormulaContainer = Partial<Record<DimensionId, Formula[]>>;

type GainFormula = Formula;
type GainFormulas =
  | GainFormula
  | {
      gain: GainFormula;
      postSoftcapGain?: (mergedPlayer: MergedPlayer, gain: Decimal) => Decimal;
      passiveGain?: (mergedPlayer: MergedPlayer, gain: Decimal) => Decimal;
    };

export type GainFormulaContainer = Partial<Record<CurrencyId, GainFormulas>>;

type EffectFormula = Formula;
type EffectFormulas =
  | EffectFormula
  | Partial<Record<CurrencyId, EffectFormula>>;

export type EffectFormulaContainer = Partial<
  Record<CurrencyId, EffectFormulas>
>;
