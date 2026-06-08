import type { EffectMode } from "@core/types/effect";
import type { CurrencyId } from "@game/currencies/types";
import type { DecimalSource } from "break_eternity.js";
import type { ReactNode } from "react";
import createDecimal from "@core/utils/decimal";
import {
  formatCurrencyName,
  formatCurrencyNameEmptyless,
} from "@game/currencies/utils/format";
import Pow from "@ui/components/base/Pow";
import symbols from "@ui/symbols";
import pluralize from "pluralize";
import { formatNumber } from "./number";
import Decimal from "break_eternity.js";

export function formatEffectSingular(
  effect: DecimalSource,
  affects: string,
  mode: EffectMode = "multiply",
) {
  const decimalEffect = createDecimal(effect);

  if (mode === "multiply") {
    const absEffect = decimalEffect.abs();
    const currency = affects && ` ${affects}`;

    if (absEffect.lessThan(1) && absEffect.greaterThan(0)) {
      return `${symbols.divide}${formatNumber(Decimal.divide(1, decimalEffect))}${currency}`;
    }

    return `${symbols.multiply}${formatNumber(decimalEffect)}${currency}`;
  }

  return (
    <>
      {affects}
      <Pow>{formatNumber(effect)}</Pow>
    </>
  );
}

export function formatEffect(
  effect: DecimalSource,
  affects: string,
  mode: EffectMode = "multiply",
): ReactNode {
  return formatEffectSingular(effect, pluralize(affects), mode);
}

export function formatEffectOnCurrency(
  effect: DecimalSource,
  affects: CurrencyId,
  mode: EffectMode = "multiply",
) {
  let currencyName = formatCurrencyName(affects);
  if (!currencyName && mode === "pow") {
    currencyName = formatCurrencyNameEmptyless(affects);
  }

  return formatEffect(effect, currencyName, mode);
}
