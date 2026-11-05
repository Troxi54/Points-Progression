import type Decimal from "break_eternity.js";
import type { CurrencyId } from "./types";
import createDecimal from "@core/utils/decimal";

export function getDefaultCachedCurrencyEffect() {
  return createDecimal(1);
}

export function getDefaultCachedCurrency() {
  return {
    gain: createDecimal(0),
    passiveGain: createDecimal(0),
    effect: getDefaultCachedCurrencyEffect() as
      Decimal | Partial<Record<CurrencyId, Decimal>>,
  };
}

export type CachedCurrency = ReturnType<typeof getDefaultCachedCurrency>;
