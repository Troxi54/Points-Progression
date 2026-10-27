import type { EffectMode } from "@core/types/effect";
import type { CachedPlayerLike } from "@game/player/cached/types";
import type { DecimalSource } from "break_eternity.js";
import type { ReactNode } from "react";
import type { CurrencyId } from "../types";
import { formatEffectOnCurrency } from "@core/format/effect";
import { formatWithPlural } from "@core/format/plural";
import { isObject } from "@core/utils/object";
import { capitalizeString } from "@core/utils/string";
import pluralize, { plural } from "pluralize";
import { getCurrencyConfig, getCurrencyEffectOn } from "./get";

export function formatCurrencyName(currencyId: CurrencyId): string {
  const config = getCurrencyConfig(currencyId);
  const name = config?.name;

  if (config === undefined || name === undefined) {
    return capitalizeString(currencyId);
  }

  if (name === null) {
    return "";
  }

  return name;
}

export function formatCurrencyNameEmptyless(currencyId: CurrencyId): string {
  const config = getCurrencyConfig(currencyId);
  const name = config?.name;

  if (config === undefined || name == null) {
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
  const config = getCurrencyConfig(currencyFrom);
  const { affects } = config;

  let effectModeInCurrencyConfig: EffectMode | null | undefined = null;
  if (isObject(affects)) {
    effectModeInCurrencyConfig = affects[effectOn]?.mode;
  }

  const effectMode = effectModeInCurrencyConfig ?? config.effectMode;

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
