import { CurrencyId } from "@/game/currencies/types";
import Decimal from "break_eternity.js";
import softcapperData from "../data";
import createDecimal, { decimalSoftcap } from "@/core/utils/decimal";
import { MergedPlayer } from "@/game/player/merged/types";
import { parseValueGetter } from "@/game/player/utils";

export function calculateSoftcappedGain(
  mergedPlayer: MergedPlayer,
  currencyId: CurrencyId,
  gain: Decimal
): Decimal {
  const softcappers = softcapperData[currencyId];
  if (!softcappers) return gain;

  for (const softcapper of Object.values(softcappers)) {
    const { mode } = softcapper;

    const startsAt = parseValueGetter(softcapper.startsAt, mergedPlayer);
    if (gain.lessThanOrEqualTo(startsAt)) break;

    const power = parseValueGetter(softcapper.power, mergedPlayer);
    gain = decimalSoftcap(gain, startsAt, power, mode);
  }

  return gain;
}

export function calculateSoftcapperLevel(
  mergedPlayer: MergedPlayer,
  currencyId: CurrencyId,
  currencyValue: Decimal
): Decimal {
  const softcappers = softcapperData[currencyId];
  if (!softcappers) return createDecimal(0);

  let result = createDecimal(0);

  for (const [index, softcapper] of softcappers.entries()) {
    const startsAt = parseValueGetter(softcapper.startsAt, mergedPlayer);
    if (currencyValue.lessThanOrEqualTo(startsAt)) break;

    result = createDecimal(index + 1);
  }

  return result;
}
