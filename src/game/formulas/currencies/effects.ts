import Decimal from "break_eternity.js";
import { EffectFormulaContainer } from "../types";
import { hasUpgradeById } from "@/game/upgrades/utils/has";
import createDecimal, { decimalSoftcap } from "@/core/utils/decimal";
import { getCachedCurrencyProp } from "@/game/currencies/utils/get";

const currencyEffectFormulas: EffectFormulaContainer = {
  points({ player: { points } }) {
    const GROWTH_POINT = createDecimal("1e1200");

    if (points.lessThan(GROWTH_POINT)) return createDecimal(1);

    return Decimal.pow(2, points.dividedBy(GROWTH_POINT).log(1e100));
  },
  madeTierTimes: {
    points({ player: { madeTierTimes } }) {
      return decimalSoftcap(madeTierTimes, 1e6, 0.25).plus(1).pow(1.2);
    },
    dertoints({ player: { madeTierTimes } }) {
      return decimalSoftcap(madeTierTimes, 1e6, 0.1).plus(1).pow(1.05);
    },
  },
  ampliflux: {
    points({ player: { ampliflux } }) {
      return Decimal.pow(2, ampliflux.max(0).plus(1).log10());
    },
    madeTierTimes({ player: { ampliflux } }) {
      return Decimal.pow(1.125, ampliflux.max(0).plus(1).log10());
    },
  },
  vermytes({ player: { vermytes } }) {
    return Decimal.pow(1.075, vermytes.max(0).plus(1).log10());
  },
  vermora: {
    ampliflux({ player: { vermora } }) {
      return Decimal.pow(2, vermora.max(0).plus(1).log10());
    },
    amplivoid({ player: { vermora } }) {
      return Decimal.pow(1.075, vermora.max(0).plus(1).log10());
    },
  },
  energyReactors({ player: { energyReactors } }) {
    return energyReactors;
  },
  energy({ player: { energy } }) {
    return Decimal.pow(1.75, energy.max(0).plus(1).log10());
  },
  cores({ player: { cores } }) {
    return Decimal.pow(4, cores.max(0).plus(1).log10());
  },
  darkEnergy({ player }) {
    const preSquared = Decimal.pow(
      1.75,
      player.darkEnergy.max(0).plus(1).log10(),
    );

    if (!hasUpgradeById(player, "mallirt_3")) return preSquared;

    const preSquared2 = preSquared.pow(2);

    if (!hasUpgradeById(player, "mallirt_4")) return preSquared2;

    return preSquared2.pow(2);
  },
  madeNullithResets: {
    points({ player }) {
      const { madeNullithResets } = player;

      return Decimal.multiply(125, madeNullithResets.max(0).pow(3))
        .pow(hasUpgradeById(player, "level_5") ? 1.15 : 1)
        .round()
        .max(1);
    },
    vermytes({ player: { madeNullithResets } }) {
      return madeNullithResets.max(0).plus(1).pow(1.2);
    },
    energy({ player }) {
      const { madeNullithResets } = player;

      return madeNullithResets
        .max(0)
        .plus(1)
        .pow(0.75)
        .pow(hasUpgradeById(player, "level_6") ? 10 : 1);
    },
  },
  nullions({ player: { nullions } }) {
    const GROWTH_POINT = createDecimal(5e4);

    const softcappedNullions = decimalSoftcap(
      decimalSoftcap(nullions, 1e15, 0.5),
      1e12,
      0.5,
    );

    return Decimal.pow(
      3,
      softcappedNullions.dividedBy(GROWTH_POINT).max(0).plus(1).log10(),
    );
  },
  dertoints({ player: { dertoints } }) {
    return Decimal.plus(
      1,
      dertoints.multiply(100).max(0).plus(1).log10().dividedBy(2.5),
    );
  },
  mallirtTotalDertoints({ player: { mallirtTotalDertoints } }) {
    return Decimal.pow(
      3,
      mallirtTotalDertoints.dividedBy(133456).max(0).plus(1).log10(),
    );
  },
  cappergy({ player: { cappergy }, cachedPlayer }) {
    const gain = getCachedCurrencyProp(cachedPlayer, "cappergy", "passiveGain");

    const n = cappergy.plus(gain).max(0).plus(1);

    return Decimal.divide(
      1,
      n
        .log10()
        .plus(1)
        .pow(0.055)
        .multiply(Decimal.plus(1, n.log(1e10).dividedBy(35).max(0))),
    );
  },
  nux({ player: { nux } }) {
    if (nux.lessThan(1)) return createDecimal(1);

    return Decimal.pow(2.65, nux.log10().plus(1));
  },
  amplivoid({ player: { amplivoid } }) {
    return amplivoid.max(0).plus(1).pow(1.75);
  },
} as const;

export default currencyEffectFormulas;
