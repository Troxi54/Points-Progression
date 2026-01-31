import resetLayerConfig from "@/game/resetLayers/config";
import { GainFormulaContainer } from "../types";
import createDecimal from "@/core/utils/decimal";
import {
  canPerform,
  everPerformed,
  getResetLayerData,
} from "@/game/resetLayers/utils/get";
import Decimal from "break_eternity.js";
import { calculateGeneration } from "../utils/calculate";
import { hasUpgradeById } from "@/game/upgrades/utils/has";
import currencyConfig from "@/game/currencies/config";
import {
  getCachedCurrencyProp,
  getCurrencyEffectFor,
} from "@/game/currencies/utils/get";
import cappergyConfig from "@/game/features/cappergy/config";
import nuxarConfig from "@/game/features/nuxar/config";
import { calculateCurrencyGain } from "@/game/currencies/utils/calculate";

const currencyGainFormulas: GainFormulaContainer = {
  points: {
    gain({ cachedPlayer }) {
      return cachedPlayer.runEffect
        .multiply(cachedPlayer.bestPointsOfRunEffect)
        .multiply(cachedPlayer.tierEffect)
        .multiply(cachedPlayer.bestVermytesPointsEffect);
    },
  },
  madeTierTimes: {
    gain: ({ player, cachedPlayer }) => {
      const nullionEffect = hasUpgradeById(player, "dertoint_2")
        ? getCurrencyEffectFor(cachedPlayer, "nullions", "madeNullithResets")
        : 1;
      return createDecimal(1).multiply(nullionEffect);
    },
    passiveGain: (_, gain) => {
      return gain.multiply(resetLayerConfig.maxResetsPerSecond);
    },
  },
  ampliflux: {
    gain({ cachedPlayer }) {
      return cachedPlayer.amplivaultEffect;
    },
  },
  vermytes: {
    gain(mergedPlayer) {
      if (!canPerform(mergedPlayer, "vermyros")) return createDecimal(0);

      const { player, cachedPlayer } = mergedPlayer;
      if (!everPerformed(player, "vermyros")) return createDecimal(1);

      const { points } = player;
      const { goal } = getResetLayerData("vermyros");

      return Decimal.pow(2, points.dividedBy(goal).log("1e6").max(0)).multiply(
        cachedPlayer.tierVermyteEffect,
      );
    },
    passiveGain({ player }) {
      const multiplier = calculateGeneration([
        [hasUpgradeById(player, "vermyros_7"), 100],
        [hasUpgradeById(player, "vermyros_6"), 10],
        [hasUpgradeById(player, "vermyros_5"), 1],
        [hasUpgradeById(player, "vermyros_4"), 0.1],
      ]);
      return player.bestVermytes.multiply(multiplier);
    },
  },
  vermora: {
    gain({ cachedPlayer }) {
      return cachedPlayer.bestVermytesEffect.multiply(
        cachedPlayer.bestPointsOfRunVermoraEffect,
      );
    },
  },
  energyReactors() {
    return createDecimal(1);
  },
  energy() {
    return createDecimal(1);
  },
  cores: {
    gain({ player }) {
      const { energy } = player;
      const { coresAt } = currencyConfig;

      return energy.greaterThanOrEqualTo(coresAt)
        ? energy.dividedBy(coresAt)
        : createDecimal(0);
    },
    passiveGain({ player }, gain) {
      const multiplier = calculateGeneration([
        [hasUpgradeById(player, "nullith_6"), 100],
        [hasUpgradeById(player, "nullith_5"), 10],
        [hasUpgradeById(player, "nullith_4"), 1],
        [hasUpgradeById(player, "nullith_3"), 0.1],
      ]);

      return gain.multiply(multiplier);
    },
  },
  darkEnergy: {
    gain({ player }) {
      return Decimal.pow(
        2,
        player.points.dividedBy(1e250).max(0).plus(1).log(1e10),
      ).max(1);
    },
  },
  madeNullithResets: {
    gain() {
      return createDecimal(1);
    },
    passiveGain: (_, gain) => {
      return gain.multiply(resetLayerConfig.maxResetsPerSecond);
    },
  },
  nullions: {
    gain: ({ cachedPlayer }) => {
      return cachedPlayer.nullionInputConverted;
    },
    passiveGain: ({ player, cachedPlayer }) => {
      const nullithGain = getCachedCurrencyProp(
        cachedPlayer,
        "madeNullithResets",
        "passiveGain",
      );

      const multiplier = calculateGeneration([
        [hasUpgradeById(player, "nullith_10"), 1],
        [hasUpgradeById(player, "nullith_9"), 0.1],
        [hasUpgradeById(player, "nullith_8"), 0.01],
        [hasUpgradeById(player, "nullith_7"), 0.001],
      ]);

      return nullithGain.multiply(multiplier);
    },
  },
  dertoints: {
    gain({ player, cachedPlayer }) {
      const nullionEffect = getCurrencyEffectFor(
        cachedPlayer,
        "nullions",
        "madeNullithResets",
      );

      return createDecimal(0.01)
        .multiply(
          hasUpgradeById(player, "dertoint_1")
            ? cachedPlayer.firstDertointUpgradeEffect
            : 1,
        )
        .multiply(hasUpgradeById(player, "dertoint_3") ? nullionEffect : 1)
        .multiply(cachedPlayer.levelDertointEffect)
        .multiply(cachedPlayer.runDertointEffect);
    },
  },
  mallirtTotalDertoints: {
    gain: (mergedPlayer) => {
      const { player } = mergedPlayer;

      if (!canPerform(mergedPlayer, "mallirt")) return createDecimal(0);
      if (!everPerformed(player, "mallirt"))
        return getResetLayerData("mallirt").goal;

      return player.dertoints;
    },
    passiveGain: ({ player }, gain) => {
      const multiplier = calculateGeneration([
        [hasUpgradeById(player, "level_6"), 100],
        [hasUpgradeById(player, "level_5"), 10],
        [hasUpgradeById(player, "level_4"), 1],
        [hasUpgradeById(player, "level_3"), 0.1],
        [hasUpgradeById(player, "level_2"), 0.01],
      ]);

      return gain.multiply(multiplier);
    },
  },
  cappergy(mergedPlayer) {
    const { player } = mergedPlayer;

    const dertointGain = calculateCurrencyGain(mergedPlayer, "dertoints");

    const value = player.dertoints.plus(dertointGain);

    if (value.lessThan(cappergyConfig.startEarningAt)) return createDecimal(0);

    return Decimal.pow(
      3.5,
      value.dividedBy(cappergyConfig.startEarningAt).max(1).log10(),
    );
  },
  XP: {
    gain(mergedPlayer) {
      if (!canPerform(mergedPlayer, "level")) return createDecimal(0);

      const { player } = mergedPlayer;
      if (!everPerformed(player, "level")) return createDecimal(1);

      const { dertoints } = player;
      const { goal } = getResetLayerData("level");

      return Decimal.pow(2, dertoints.dividedBy(goal).log(100).max(0));
    },
  },
  nux({ player: { nullions } }) {
    const { requirement } = nuxarConfig;

    if (nullions.lessThan(requirement)) return createDecimal(0);

    return nullions.dividedBy(requirement).pow(0.9);
  },
  amplivoid: {
    gain({ player: { ampliflux } }) {
      return Decimal.pow(1.6, ampliflux.dividedBy("1e1075").max(1).log(1e10));
    },
  },
} as const satisfies GainFormulaContainer;

export default currencyGainFormulas;
