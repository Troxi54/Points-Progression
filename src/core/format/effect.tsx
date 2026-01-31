import { EffectMode } from "@/core/types/effect";
import createDecimal from "@/core/utils/decimal";
import { DecimalSource } from "break_eternity.js";
import { ReactNode } from "react";
import { formatWithPlural } from "./plural";
import { CurrencyId } from "@/game/currencies/types";
import { formatCurrencyName } from "@/game/currencies/utils/format";
import UISymbols from "@/app/UISymbols";
import { formatNumber } from "./number";
import Pow from "@/ui/components/base/Pow";
import pluralize from "pluralize";

export function formatEffectSingular(
  effect: DecimalSource,
  affects: string,
  mode: EffectMode = "multiply"
) {
  const decimalEffect = createDecimal(effect);

  if (mode === "multiply") {
    return UISymbols.multiply + formatWithPlural(decimalEffect, affects);
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
  mode: EffectMode = "multiply"
): ReactNode {
  return formatEffectSingular(effect, pluralize(affects), mode);
}

export function formatEffectForCurrency(
  effect: DecimalSource,
  affects: CurrencyId,
  mode: EffectMode = "multiply"
) {
  const currencyName = formatCurrencyName(affects);
  return formatEffect(effect, currencyName, mode);
}
