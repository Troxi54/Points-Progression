import createDecimal, { decimalSoftcap } from "@/core/utils/decimal";
import { FormulaContainer } from "./types";
import Decimal from "break_eternity.js";
import { calculateRepeatableUpgradeEffect } from "@/game/repeatableUpgrades/utils/calculate";
import formulas from "./data";
import { hasNexusLevel } from "@/game/features/nexus/utils/has";

const effectFormulas = {
  firstResetLayerRun({ player }) {
    const { bestRun } = player;
    if (bestRun === null) return createDecimal(1);

    const GROWTH_POINT = createDecimal(7.2e6);

    return Decimal.plus(1, GROWTH_POINT.log(bestRun))
      .min(2)
      .times(
        bestRun.lessThanOrEqualTo(GROWTH_POINT)
          ? Decimal.pow(5, GROWTH_POINT.log10().minus(bestRun.log10()))
          : 1
      );
  },
  bestPointsOfRun(mergedPlayer) {
    const {
      player: { bestPointsOfRun }
    } = mergedPlayer;

    const coreUpgradeEffect = calculateRepeatableUpgradeEffect(
      mergedPlayer,
      "core"
    );

    return Decimal.plus(
      1,
      Decimal.max(bestPointsOfRun, 1e6).dividedBy(1e6).log10()
    )
      .pow(1.3)
      .pow(coreUpgradeEffect);
  },
  tier({ player }) {
    return Decimal.pow(3, player.tier);
  },
  bestVermytes({ player }) {
    return player.bestVermytes.pow(3);
  },
  amplivault({ player }) {
    return Decimal.pow(
      player.amplivaultBroken ? 1.5 : 2,
      player.amplivaultLevel
    );
  },
  firstDertointUpgrade({ player }) {
    return decimalSoftcap(
      Decimal.pow(
        1.15,
        player.points.dividedBy("e1000").max(0).plus(1).log("e5")
      ),
      1e12,
      0.7
    );
  },
  levelDertoint(mergedPlayer) {
    const level = formulas.level(mergedPlayer);
    return Decimal.pow(3, level);
  },
  firstResetLayerRunDertoints(mergedPlayer) {
    if (!hasNexusLevel(mergedPlayer, 2)) return createDecimal(1);

    return effectFormulas
      .firstResetLayerRun(mergedPlayer)
      .dividedBy(1000)
      .max(1);
  },
  bestPointsOfRunVermora(mergedPlayer) {
    if (!hasNexusLevel(mergedPlayer, 3)) return createDecimal(1);

    return effectFormulas.bestPointsOfRun(mergedPlayer).pow(0.75).max(1);
  },
  tierVermytes(mergedPlayer) {
    if (!hasNexusLevel(mergedPlayer, 4)) return createDecimal(1);

    const { player } = mergedPlayer;

    return Decimal.pow(1.7, player.tier.minus(350).max(0));
  },
  bestVermytesPoints(mergedPlayer) {
    if (!hasNexusLevel(mergedPlayer, 7)) return createDecimal(1);

    const { player } = mergedPlayer;

    return player.bestVermytes.pow(3.75);
  }
} as const satisfies FormulaContainer;

export default effectFormulas;
