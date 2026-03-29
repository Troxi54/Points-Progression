import { calculateCurrencyGain } from "@game/currencies/utils/calculate";
import { getCurrencyEffectOn } from "@game/currencies/utils/get";
import { getRepeatableUpgradeLevel } from "@game/repeatableUpgrades/utils/get";
import { applyResetLayerPlayerData } from "@game/resetLayers/utils/apply";
import { defineResetLayer } from "@game/resetLayers/utils/create";
import { applyUpgradesById } from "@game/upgrades/utils/apply";
import { hasUpgradeById } from "@game/upgrades/utils/has";
import Decimal from "break_eternity.js";

const nullithResetLayer = defineResetLayer<"normal">({
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
          vermyte: getRepeatableUpgradeLevel(defaultMergedPlayer, "vermyte"),
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
});

export default nullithResetLayer;
