import createDecimal from "@core/utils/decimal";
import { mergeObjects, objectAssign } from "@core/utils/object";
import { calculateCurrencyGain } from "@game/currencies/utils/calculate";
import { hasNexusLevelSelection } from "@game/features/nexus/utils/selector";
import formulas from "@game/formulas/data";
import { getRepeatableUpgradeLevel } from "@game/repeatableUpgrades/utils/get";
import { defineResetLayer } from "@game/resetLayers/utils/create";
import { getResetLayerPlayerData } from "@game/resetLayers/utils/get";
import { setResetLayerPlayerData } from "@game/resetLayers/utils/set";
import { hasUpgradeById } from "@game/upgrades/utils/has";

const vermyrosResetLayer = defineResetLayer<"normal">({
  id: "vermyros",
  playerSelector: ({ mergedPlayer: { player, cachedPlayer } }) =>
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

    objectAssign(player, {
      tier: defaultPlayer.tier,
      ampliflux: defaultPlayer.ampliflux,
    });

    player.repeatableUpgrades.ampliflux = getRepeatableUpgradeLevel(
      defaultMergedPlayer,
      "ampliflux",
    );

    setResetLayerPlayerData(player, "reset", {
      autoEnabled: !hasVermyros_3,
    });

    setResetLayerPlayerData(player, "tier", {
      autoEnabled:
        getResetLayerPlayerData(player, "tier").autoEnabled && hasVermyros_2,
    });
  },
  reward: (mergedPlayer, sourceMergedPlayer) => {
    const { player } = mergedPlayer;

    const vermyteGain = calculateCurrencyGain(sourceMergedPlayer, "vermytes");

    objectAssign(player, {
      vermytes: player.vermytes.plus(vermyteGain),
      bestVermytes: formulas.bestVermytes(sourceMergedPlayer),
    });
  },
});

export default vermyrosResetLayer;
