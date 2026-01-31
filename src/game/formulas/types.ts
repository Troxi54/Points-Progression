import { CurrencyId } from "@/game/currencies/types";
import { DimensionId } from "@/game/dimensions/types";
import { MergedPlayer } from "@/game/player/merged/types";
import Decimal from "break_eternity.js";

export type Formula<T extends unknown[] = [], R = Decimal> = (
  mergedPlayer: MergedPlayer,
  ...args: T
) => R;

/* eslint-disable @typescript-eslint/no-explicit-any*/
/**`any` here doesn't make the code unsafe, I honestly don't know how would I allow other parameters without it.
 */
export type FormulaContainer = Record<string, Formula<any[], any>>;
/* eslint-enable @typescript-eslint/no-explicit-any*/

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
