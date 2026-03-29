import Decimal from "break_eternity.js";
import { EffectFormulaContainer } from "../types";
import { hasUpgradeById } from "@game/upgrades/utils/has";
import createDecimal, { decimalSoftcap } from "@core/utils/decimal";
import { getCachedCurrencyProp } from "@game/currencies/utils/get";
import effectFormulas from "../effects";
import { isXagyrosStateActive } from "@game/features/xagyrosStates/utils/get";

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
  energyReactors: {
    energy({ player: { energyReactors } }) {
      return energyReactors;
    },
    cores({ player: { energyReactors } }) {
      return Decimal.pow(1.3, energyReactors.max(0).plus(1).log10());
    },
  },
  energy: {
    points({ player: { energy } }) {
      return Decimal.pow(1.75, energy.max(0).plus(1).log10());
    },
    xagoraDertoints(mergedPlayer) {
      return effectFormulas.energyXagora(mergedPlayer);
    },
    xagoraPoints(mergedPlayer) {
      return effectFormulas.energyXagora(mergedPlayer);
    },
    xagoraNullithResets(mergedPlayer) {
      return effectFormulas.energyXagora(mergedPlayer);
    },
    xagoraNux(mergedPlayer) {
      return effectFormulas.energyXagora(mergedPlayer);
    },
  },
  cores: {
    energyReactors({ player: { cores } }) {
      return Decimal.pow(4, cores.max(0).plus(1).log10());
    },
    score({ player: { cores } }) {
      return Decimal.pow(50, cores.max(0).plus(1).log("1e10000"));
    },
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
        .pow(hasUpgradeById(player, "level_5") ? 1.1 : 1)
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
  dertoints: {
    darkEnergy({ player: { dertoints } }) {
      return Decimal.plus(
        1,
        dertoints.multiply(100).max(0).plus(1).log10().dividedBy(2.5),
      );
    },
    xagoraDertoints: (mergedPlayer) =>
      effectFormulas.dertointXagora(mergedPlayer),
    xagoraPoints: (mergedPlayer) => effectFormulas.dertointXagora(mergedPlayer),
    xagoraNullithResets: (mergedPlayer) =>
      effectFormulas.dertointXagora(mergedPlayer),
    xagoraNux: (mergedPlayer) => effectFormulas.dertointXagora(mergedPlayer),
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
  score({ player: { score } }) {
    if (score.lessThanOrEqualTo(0)) return createDecimal(0);

    return Decimal.minus(
      1,
      Decimal.divide(
        1,
        Decimal.pow(2, score.max(0).plus(1).log10().dividedBy(200)),
      ),
    ).clamp(0, 1);
  },
  amplivoid({ player: { amplivoid } }) {
    return amplivoid.max(0).plus(1).pow(1.75);
  },
  xagytes: {
    xagoraDertoints: (mergedPlayer) =>
      effectFormulas.xagytesXagora(mergedPlayer),
    xagoraPoints: (mergedPlayer) => effectFormulas.xagytesXagora(mergedPlayer),
    xagoraNullithResets: (mergedPlayer) =>
      effectFormulas.xagytesXagora(mergedPlayer),
    xagoraNux: (mergedPlayer) => effectFormulas.xagytesXagora(mergedPlayer),
  },
  xagoraDertoints(mergedPlayer) {
    const {
      player: { xagoraDertoints },
    } = mergedPlayer;

    const value = Decimal.pow(4, xagoraDertoints.max(0).plus(1).log10());
    if (!isXagyrosStateActive(mergedPlayer, "dertoints"))
      return effectFormulas.xagyrosStateNotChosen(mergedPlayer, value);

    return value;
  },
  xagoraPoints(mergedPlayer) {
    const {
      player: { xagoraPoints },
    } = mergedPlayer;

    const value = Decimal.pow("1.71e9", xagoraPoints.max(0).plus(1).log10());
    if (!isXagyrosStateActive(mergedPlayer, "points"))
      return effectFormulas.xagyrosStateNotChosen(mergedPlayer, value);

    return value;
  },
  xagoraNullithResets(mergedPlayer) {
    const {
      player: { xagoraNullithResets },
    } = mergedPlayer;

    const value = Decimal.pow(1.05, xagoraNullithResets.max(0).plus(1).log10());
    if (!isXagyrosStateActive(mergedPlayer, "nullithResets"))
      return effectFormulas.xagyrosStateNotChosen(mergedPlayer, value);

    return value;
  },
  xagoraNux(mergedPlayer) {
    const {
      player: { xagoraNux },
    } = mergedPlayer;

    const value = Decimal.pow(1.03, xagoraNux.max(0).plus(1).log10());
    if (!isXagyrosStateActive(mergedPlayer, "nux"))
      return effectFormulas.xagyrosStateNotChosen(mergedPlayer, value);

    return value;
  },
} as const;

export default currencyEffectFormulas;
