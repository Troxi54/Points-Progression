import createDecimal from "@core/utils/decimal";
import { mergeObjects } from "@core/utils/object";
import { calculateCurrencyGain } from "@game/currencies/utils/calculate";
import { getCurrencyEffectOn } from "@game/currencies/utils/get";
import { hasNexusLevelSelection } from "@game/features/nexus/utils/selector";
import formulas from "@game/formulas/data";
import { applyResetLayerPlayerData } from "@game/resetLayers/utils/apply";
import { defineResetLayer } from "@game/resetLayers/utils/create";
import { applyUpgradesById } from "@game/upgrades/utils/apply";
import { hasUpgradeById } from "@game/upgrades/utils/has";
import { hasUpgradeSelectionById } from "@game/upgrades/utils/selector";

const tierResetLayer = defineResetLayer<"normal">({
  id: "tier",
  usePlayer: ({ mergedPlayer: { player, cachedPlayer } }) =>
    mergeObjects(
      {
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
      },
      hasNexusLevelSelection(player, 4, "4"),
    ),
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
    const tierResetGain = calculateCurrencyGain(mergedPlayer, "madeTierTimes");

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
});

export default tierResetLayer;
