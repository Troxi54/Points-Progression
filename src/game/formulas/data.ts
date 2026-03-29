import createDecimal from "@core/utils/decimal";
import { FormulaContainer } from "./types";
import { everPerformed, getResetLayerData } from "@game/resetLayers/utils/get";
import Decimal, { DecimalSource } from "break_eternity.js";
import amplivaultConfig from "@game/features/amplivault/config";
import { calculateBulk } from "@core/utils/level";
import { hasUpgradeById } from "@game/upgrades/utils/has";
import { calculateCurrencyGain } from "@game/currencies/utils/calculate";
import gameConfig from "@core/config/data";
import resetResetLayerConfig from "@game/resetLayers/data/layers/reset/config";
import tierResetLayerConfig from "@game/resetLayers/data/layers/tier/config";

const formulas = {
  bestPoints({ player }) {
    return player.bestPoints.max(player.points);
  },
  gameProgress({ player }) {
    return player.bestPoints.log(gameConfig.endgameAt).max(0);
  },
  firstResetLayerRunLimit() {
    return createDecimal(resetResetLayerConfig.bestRunLimit);
  },
  firstResetLayerRun(
    { player },
    run: DecimalSource | null,
    override: boolean = false,
  ): Decimal | null {
    const lowestLimit = formulas.firstResetLayerRunLimit();

    const hasTier_3 = hasUpgradeById(player, "tier_3");
    if (hasTier_3) return lowestLimit;

    if (run === null) return null;

    const runDecimal = createDecimal(run);
    if (runDecimal.isNan() || !runDecimal.isFinite()) {
      return null;
    }

    const { bestRun } = player;
    const newBestRun =
      bestRun && !override ? bestRun.min(runDecimal) : runDecimal;

    return newBestRun.clamp(lowestLimit, resetResetLayerConfig.worstRunLimit);
  },
  bestPointsOfRun({ player }) {
    const value = everPerformed(player, "reset")
      ? player.points
      : getResetLayerData("reset").goal;

    return player.bestPointsOfRun.max(value);
  },
  tierRequirement({ player }) {
    const firstTierAt = getResetLayerData("tier").goal;
    return firstTierAt.multiply(
      Decimal.pow(tierResetLayerConfig.requirementScaling, player.tier),
    );
  },
  tierBulk(mergedPlayer) {
    const {
      player: { points },
    } = mergedPlayer;
    const requirement = formulas.tierRequirement(mergedPlayer);

    return calculateBulk(
      points,
      requirement,
      tierResetLayerConfig.requirementScaling,
    );
  },
  bestVermytes(
    mergedPlayer,
    gain: Decimal = calculateCurrencyGain(mergedPlayer, "vermytes"),
  ) {
    return mergedPlayer.player.bestVermytes.max(gain);
  },
  amplivaultRequirement({ player }) {
    return amplivaultConfig.requirementStartsAt.multiply(
      Decimal.pow(amplivaultConfig.requirementScaling, player.amplivaultLevel),
    );
  },
  amplivaultBulk(mergedPlayer) {
    const {
      player: { points },
    } = mergedPlayer;
    const requirement = formulas.amplivaultRequirement(mergedPlayer);

    return calculateBulk(
      points,
      requirement,
      amplivaultConfig.requirementScaling,
    );
  },
  score(
    mergedPlayer,
    gain: Decimal = calculateCurrencyGain(mergedPlayer, "score"),
  ) {
    return mergedPlayer.player.score.max(gain);
  },
  level({ player: { XP } }) {
    return calculateBulk(XP, 1, 2);
  },
  XPForNextLevel(mergedPlayer) {
    const level = formulas.level(mergedPlayer);
    return Decimal.pow(2, level);
  },
  XPForThisLevel(mergedPlayer) {
    const level = formulas.level(mergedPlayer);
    if (level.lessThanOrEqualTo(0)) return createDecimal(0);

    return Decimal.pow(2, level.minus(1).max(0));
  },
  xagytes({ player: { xagytes } }, gain: Decimal) {
    return xagytes.max(gain);
  },
  xagora() {
    return createDecimal(1);
  },
  maxXagyrosStates() {
    return 1;
  },
} as const satisfies FormulaContainer;

export default formulas;
