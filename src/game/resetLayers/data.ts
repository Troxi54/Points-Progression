import { FlatResetLayerContainer } from "./types";
import { createResetLayerDataContainer } from "./utils/create";
import { getRepeatableUpgradeLevel } from "@/game/repeatableUpgrades/utils/get";
import createDecimal from "@/core/utils/decimal";
import { hasUpgradeSelectionById } from "@/game/upgrades/utils/selector";
import { hasUpgradeById } from "@/game/upgrades/utils/has";
import { applyResetLayerPlayerData } from "./utils/apply";
import { applyUpgradesById } from "@/game/upgrades/utils/apply";
import formulas from "@game/formulas/data";
import { getCurrencyEffectOn } from "@/game/currencies/utils/get";
import { everPerformed, getResetLayerPlayerDataProp } from "./utils/get";
import Decimal from "break_eternity.js";
import { calculateCurrencyGain } from "@/game/currencies/utils/calculate";

const resetLayers = createResetLayerDataContainer({
  normal: [
    {
      id: "reset",
      goal: createDecimal(1e6),
      usePlayer: ({ mergedPlayer: { player, cachedPlayer } }) => ({
        bestRun: player.bestRun,
        bestPointsOfRun: player.bestPointsOfRun,
        runEffect: cachedPlayer.runEffect,
        bestPointsOfRunEffect: cachedPlayer.bestPointsOfRunEffect,
      }),
      reset: (_, defaultMergedPlayer) => {
        return {
          player: {
            points: defaultMergedPlayer.player.points,
            repeatableUpgrades: {
              point: getRepeatableUpgradeLevel(defaultMergedPlayer, "point"),
            },
          },
        };
      },
      reward: (mergedPlayer, spentTime) => {
        return {
          player: {
            bestRun: formulas.firstResetLayerRun(mergedPlayer, spentTime),
            bestPointsOfRun: formulas.bestPointsOfRun(mergedPlayer),
          },
        };
      },
    },
    {
      id: "tier",
      usePlayer: ({ mergedPlayer: { player, cachedPlayer } }) => ({
        tier: player.tier,
        madeTierTimes: player.madeTierTimes,
        tierRequirement: cachedPlayer.tierRequirement,
        tierEffect: cachedPlayer.tierEffect,
        tierTimesEffect: getCurrencyEffectOn(
          cachedPlayer,
          "madeTierTimes",
          "points",
        ),
        ...hasUpgradeSelectionById(player, "vermyros_2"),
      }),
      goal: createDecimal(1e25),
      canPerform: (mergedPlayer) => {
        const { player } = mergedPlayer;

        const tierRequirement = formulas.tierRequirement(mergedPlayer);

        return (
          !hasUpgradeById(player, "vermyros_2") ||
          player.points.greaterThanOrEqualTo(tierRequirement)
        );
      },
      reset: (mergedPlayer, defaultMergedPlayer) => {
        const { player } = mergedPlayer;

        const defaultPlayer = defaultMergedPlayer.player;

        const hasTier_3 = hasUpgradeById(player, "tier_3");

        return {
          player: {
            bestRun: defaultPlayer.bestRun,
            bestPointsOfRun: defaultPlayer.bestPointsOfRun,
            ...applyResetLayerPlayerData(player, "reset", {
              autoEnabled: !hasTier_3,
            }),
            ...applyUpgradesById(player, {
              reset_1: hasUpgradeById(player, "tier_1"),
              reset_2: hasUpgradeById(player, "tier_2"),
            }),
          },
        };
      },
      preventReset: ({ player }) => hasUpgradeById(player, "vermyros_4"),
      reward: (mergedPlayer) => {
        const { player } = mergedPlayer;

        const bulk = formulas.tierBulk(mergedPlayer);
        const tierResetGain = calculateCurrencyGain(
          mergedPlayer,
          "madeTierTimes",
        );

        const vermyros_4 = hasUpgradeById(mergedPlayer, "vermyros_4");

        return {
          player: {
            tier: player.tier.plus(bulk),
            ...(vermyros_4
              ? {}
              : { madeTierTimes: player.madeTierTimes.plus(tierResetGain) }),
          },
        };
      },
    },
    {
      id: "vermyros",
      usePlayer: ({ mergedPlayer: { player, cachedPlayer } }) => ({
        bestVermytes: player.bestVermytes,
        bestVermytesEffect: cachedPlayer.bestVermytesEffect,
      }),
      goal: createDecimal(1e84),
      reset: ({ player }, defaultMergedPlayer) => {
        const defaultPlayer = defaultMergedPlayer.player;

        const hasVermyros_2 = hasUpgradeById(player, "vermyros_2");
        const hasVermyros_3 = hasUpgradeById(player, "vermyros_3");

        return {
          player: {
            tier: defaultPlayer.tier,
            ampliflux: defaultPlayer.ampliflux,
            repeatableUpgrades: {
              ampliflux: getRepeatableUpgradeLevel(
                defaultMergedPlayer,
                "ampliflux",
              ),
            },
            ...applyUpgradesById(player, {
              reset_1: hasVermyros_2,
              reset_2: hasVermyros_2,
              tier_1: hasVermyros_2,
              tier_2: hasVermyros_2,
              tier_3: hasVermyros_3,
              tier_4: hasVermyros_3,
              tier_5: hasVermyros_3,
              tier_6: hasVermyros_3,
            }),
            ...applyResetLayerPlayerData(player, "reset", {
              autoEnabled: !hasVermyros_3,
            }),
            ...applyResetLayerPlayerData(player, "tier", {
              autoEnabled:
                getResetLayerPlayerDataProp(player, "tier", "autoEnabled") &&
                hasVermyros_2,
            }),
          },
        };
      },
      reward: (mergedPlayer) => {
        const { player } = mergedPlayer;

        const vermyteGain = calculateCurrencyGain(mergedPlayer, "vermytes");

        return {
          player: {
            vermytes: player.vermytes.plus(vermyteGain),
            bestVermytes: formulas.bestVermytes(mergedPlayer),
          },
        };
      },
    },
    {
      id: "nullith",
      goal: Decimal.pow(2, 1024),
      usePlayer: ({ mergedPlayer: { player, cachedPlayer } }) => ({
        madeNullithResets: player.madeNullithResets,
        nullithResetsPointEffect: getCurrencyEffectOn(
          cachedPlayer,
          "madeNullithResets",
          "points",
        ),
        nullithResetsVermyteEffect: getCurrencyEffectOn(
          cachedPlayer,
          "madeNullithResets",
          "vermytes",
        ),
        nullithResetsEnergyEffect: getCurrencyEffectOn(
          cachedPlayer,
          "madeNullithResets",
          "energy",
        ),
      }),
      reset: ({ player }, defaultMergedPlayer) => {
        const defaultPlayer = defaultMergedPlayer.player;

        const hasNullith_2 = hasUpgradeById(player, "nullith_2");
        const hasNullith_3 = hasUpgradeById(player, "nullith_3");
        const hasNullith_4 = hasUpgradeById(player, "nullith_4");

        return {
          player: {
            ...applyResetLayerPlayerData(player, "vermyros", {
              autoEnabled: true,
            }),
            vermytes: defaultPlayer.vermytes,
            bestVermytes: defaultPlayer.bestVermytes,
            vermora: defaultPlayer.vermora,
            repeatableUpgrades: {
              vermyte: getRepeatableUpgradeLevel(
                defaultMergedPlayer,
                "vermyte",
              ),
              core: getRepeatableUpgradeLevel(defaultMergedPlayer, "core"),
            },
            enteredAmplivault: false,
            amplivaultLevel: hasNullith_3
              ? player.amplivaultLevel
              : defaultPlayer.amplivaultLevel,
            energyReactors: defaultPlayer.energyReactors,
            energy: defaultPlayer.energy,
            cores: defaultPlayer.cores,
            ...applyUpgradesById(player, {
              reset_1: hasNullith_2,
              reset_2: hasNullith_2,
              tier_1: hasNullith_2,
              tier_2: hasNullith_2,
              tier_3: hasNullith_2,
              tier_4: hasNullith_2,
              tier_5: hasNullith_2,
              tier_6: hasNullith_2,
              vermyros_1: hasNullith_2,
              vermyros_2: hasNullith_2,
              vermyros_3: hasNullith_2,
              vermyros_4: hasNullith_2,
              vermyros_5: hasNullith_3,
              vermyros_6: hasNullith_3,
              vermyros_7: hasNullith_3,
              vermyros_8: hasNullith_3,
              vermyros_9: hasNullith_4,
              vermyros_10: hasNullith_4,
            }),
          },
        };
      },
      reward: (mergedPlayer) => {
        const { player } = mergedPlayer;

        const nullithResetGain = calculateCurrencyGain(
          mergedPlayer,
          "madeNullithResets",
        );

        return {
          player: {
            madeNullithResets: player.madeNullithResets.plus(nullithResetGain),
            reachedBreakAmplivault:
              player.reachedBreakAmplivault || player.enteredAmplivault,
          },
        };
      },
    },
  ],
  sliph: [
    {
      id: "mallirt",
      goal: createDecimal(1e6),
      currency: "dertoints",
      usePlayer: ({ mergedPlayer: { player, cachedPlayer } }) => ({
        mallirtTotalDertoints: player.mallirtTotalDertoints,
        mallirtTotalDertointsEffect: getCurrencyEffectOn(
          cachedPlayer,
          "mallirtTotalDertoints",
          "dertoints",
        ),
      }),
      reset: ({ player }, defaultMergedPlayer) => {
        const defaultPlayer = defaultMergedPlayer.player;

        const hasMallirt_1 = hasUpgradeById(player, "mallirt_1");
        const hasMallirt_2 = hasUpgradeById(player, "mallirt_2");

        return {
          player: {
            dertoints: defaultPlayer.dertoints,
            repeatableUpgrades: {
              dertoint: getRepeatableUpgradeLevel(
                defaultMergedPlayer,
                "dertoint",
              ),
            },
            ...applyUpgradesById(player, {
              dertoint_1: hasMallirt_1,
              dertoint_2: hasMallirt_1,
              dertoint_3: hasMallirt_2,
              dertoint_4: hasMallirt_2,
            }),
            cappergy: defaultPlayer.cappergy,
          },
        };
      },
      reward: (mergedPlayer) => {
        const { player } = mergedPlayer;

        const totalDertointsGain = calculateCurrencyGain(
          mergedPlayer,
          "mallirtTotalDertoints",
        );

        return {
          player: {
            mallirtTotalDertoints:
              player.mallirtTotalDertoints.plus(totalDertointsGain),
          },
        };
      },
    },
    {
      id: "level",
      goal: createDecimal(1e25),
      currency: "dertoints",
      reset: ({ player }, defaultMergedPlayer) => {
        const defaultPlayer = defaultMergedPlayer.player;

        return {
          player: {
            mallirtTotalDertoints: defaultPlayer.mallirtTotalDertoints,
            ...applyUpgradesById(player, {
              mallirt_1: hasUpgradeById(player, "level_1"),
              mallirt_2: hasUpgradeById(player, "level_2"),
              mallirt_3: hasUpgradeById(player, "level_3"),
              mallirt_4: hasUpgradeById(player, "level_4"),
            }),
          },
        };
      },
      reward: (mergedPlayer) => {
        const { player } = mergedPlayer;

        const scoreGain = calculateCurrencyGain(mergedPlayer, "score");

        return {
          player: {
            score: formulas.score(mergedPlayer, scoreGain),
            XP: everPerformed(mergedPlayer, "level")
              ? player.XP
              : player.XP.plus(scoreGain),
          },
        };
      },
    },
  ],
} as const);

export default resetLayers;

export const flatResetLayers = {} as FlatResetLayerContainer;

function buildFlatResetLayer() {
  for (const dimensionLayers of Object.values(resetLayers)) {
    for (const layer of dimensionLayers) {
      flatResetLayers[layer.id] = layer;
    }
  }
}

buildFlatResetLayer();
