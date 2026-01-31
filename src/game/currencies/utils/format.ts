import { isNil } from "@/core/utils/nil";
import { CurrencyId } from "../types";
import { getCurrencyData, getCurrencyEffectFor } from "./get";
import { CachedPlayerLike } from "@/game/player/cached/types";
import { ReactNode } from "react";
import { formatEffectForCurrency } from "@/core/format/effect";
import { DecimalSource } from "break_eternity.js";
import { formatWithPlural } from "@/core/format/plural";
import pluralize from "pluralize";
import { capitalizeString } from "@/core/utils/string";

export function formatCurrencyName(currencyId: CurrencyId): string {
  const data = getCurrencyData(currencyId);
  const name = data?.name;

  if (data === undefined || name === undefined) {
    return capitalizeString(currencyId);
  }

  if (name === null) {
    return "";
  }

  return name;
}

export function formatCurrencyNameEmptyless(currencyId: CurrencyId): string {
  const data = getCurrencyData(currencyId);
  const name = data?.name;

  if (data === undefined || isNil(name)) {
    return capitalizeString(currencyId);
  }

  return name;
}

export function formatCurrencyEffect(
  cachedPlayerLike: CachedPlayerLike,
  currencyFrom: CurrencyId,
  currencyFor: CurrencyId
): ReactNode {
  const data = getCurrencyData(currencyFrom);
  const { effectMode } = data;

  const effect = getCurrencyEffectFor(
    cachedPlayerLike,
    currencyFrom,
    currencyFor
  );

  return formatEffectForCurrency(effect, currencyFor, effectMode);
}

export function formatCurrency(
  currencyValue: DecimalSource,
  currencyId: CurrencyId
) {
  const formattedCurrency = formatCurrencyName(currencyId);
  return formatWithPlural(currencyValue, formattedCurrency);
}

export function pluralizeCurrency(
  currencyId: CurrencyId,
  value: DecimalSource
) {
  const formattedCurrency = formatCurrencyName(currencyId);
  return pluralize(formattedCurrency, +value);
}
