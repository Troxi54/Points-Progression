import type { EffectMode } from "@core/types/effect";
import type { Nil } from "@core/types/primitives";
import type { CachedPlayerLike } from "@game/player/cached/types";
import type { DecimalSource } from "break_eternity.js";
import type { ReactNode } from "react";
import type { CurrencyId } from "../types";
import { formatEffectOnCurrency } from "@core/format/effect";
import { formatWithPlural } from "@core/format/plural";
import { isNil } from "@core/utils/nil";
import { isObject } from "@core/utils/object";
import { capitalizeString } from "@core/utils/string";
import pluralize, { plural } from "pluralize";
import { getCurrencyData, getCurrencyEffectOn } from "./get";

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

export function formatCurrencyNameEmptylessPlural(
  currencyId: CurrencyId,
  value?: DecimalSource,
): string {
  const name = formatCurrencyNameEmptyless(currencyId);
  if (value === undefined) return plural(name);

  return pluralize(name, +value);
}

export function formatCurrencyEffect(
  cachedPlayerLike: CachedPlayerLike,
  currencyFrom: CurrencyId,
  effectOn: CurrencyId,
): ReactNode {
  const data = getCurrencyData(currencyFrom);
  const { affects } = data;

  let effectModeInCurrencyData: EffectMode | Nil = null;
  if (isObject(affects)) {
    effectModeInCurrencyData = affects[effectOn]?.mode;
  }

  const effectMode = effectModeInCurrencyData ?? data.effectMode;

  const effect = getCurrencyEffectOn(cachedPlayerLike, currencyFrom, effectOn);

  return formatEffectOnCurrency(effect, effectOn, effectMode);
}

export function formatCurrency(
  currencyValue: DecimalSource,
  currencyId: CurrencyId,
) {
  const formattedCurrency = formatCurrencyName(currencyId);
  return formatWithPlural(currencyValue, formattedCurrency);
}

export function pluralizeCurrency(
  currencyId: CurrencyId,
  value: DecimalSource,
) {
  const formattedCurrency = formatCurrencyName(currencyId);
  return pluralize(formattedCurrency, +value);
}
