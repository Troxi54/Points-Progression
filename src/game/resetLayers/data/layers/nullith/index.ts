import { calculateCurrencyGain } from "@game/currencies/utils/calculate";
import { getCurrencyEffectOn } from "@game/currencies/utils/get";
import { getRepeatableUpgradeLevel } from "@game/repeatableUpgrades/utils/get";
import { setResetLayerPlayerData } from "@game/resetLayers/utils/set";
import { defineResetLayer } from "@game/resetLayers/utils/create";
import { hasUpgradeById } from "@game/upgrades/utils/has";
import Decimal from "break_eternity.js";

const nullithResetLayer = defineResetLayer<"normal">({
  id: "nullith",
  goal: Decimal.pow(2, 1024),
  playerSelector: ({ mergedPlayer: { player, cachedPlayer } }) => ({
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

    const hasNullith_3 = hasUpgradeById(player, "nullith_3");

    return {
      player: {
        ...setResetLayerPlayerData(player, "vermyros", {
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
