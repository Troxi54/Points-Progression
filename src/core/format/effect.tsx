import type { EffectMode } from "@core/types/effect";
import type { CurrencyId } from "@game/currencies/types";
import type { DecimalSource } from "break_eternity.js";
import type { ReactNode } from "react";
import createDecimal from "@core/utils/decimal";
import { formatCurrencyName } from "@game/currencies/utils/format";
import Pow from "@ui/components/base/Pow";
import symbols from "@ui/symbols";
import pluralize from "pluralize";
import { formatNumber } from "./number";
import { formatWithPlural } from "./plural";

export function formatEffectSingular(
  effect: DecimalSource,
  affects: string,
  mode: EffectMode = "multiply",
) {
  const decimalEffect = createDecimal(effect);

  if (mode === "multiply") {
    return symbols.multiply + formatWithPlural(decimalEffect, affects);
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
  const currencyName = formatCurrencyName(affects);
  return formatEffect(effect, currencyName, mode);
}
