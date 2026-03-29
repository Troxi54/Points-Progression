import { defineResetLayer } from "@game/resetLayers/utils/create";
import createDecimal from "@core/utils/decimal";
import { calculateCurrencyGain } from "@game/currencies/utils/calculate";
import formulas from "@game/formulas/data";
import { applyResetLayerPlayerData } from "@game/resetLayers/utils/apply";
import { applyUpgradesById } from "@game/upgrades/utils/apply";
import { hasUpgradeById } from "@game/upgrades/utils/has";
import { getRepeatableUpgradeLevel } from "@game/repeatableUpgrades/utils/get";
import { getResetLayerPlayerDataProp } from "@game/resetLayers/utils/get";
import { mergeObjects } from "@core/utils/object";
import { hasNexusLevelSelection } from "@game/features/nexus/utils/selector";

const vermyrosResetLayer = defineResetLayer<"normal">({
  id: "vermyros",
  usePlayer: ({ mergedPlayer: { player, cachedPlayer } }) =>
    mergeObjects(
      {
        bestVermytes: player.bestVermytes,
        bestVermytesEffect: cachedPlayer.bestVermytesEffect,
      },
      hasNexusLevelSelection(player, 7, "7"),
    ),
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
});

export default vermyrosResetLayer;
