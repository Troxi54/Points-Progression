import createDecimal from "@core/utils/decimal";
import { calculateCurrencyGain } from "@game/currencies/utils/calculate";
import { getCurrencyEffectOn } from "@game/currencies/utils/get";
import { getRepeatableUpgradeLevel } from "@game/repeatableUpgrades/utils/get";
import { defineResetLayer } from "@game/resetLayers/utils/create";
import { applyUpgradesById } from "@game/upgrades/utils/apply";
import { hasUpgradeById } from "@game/upgrades/utils/has";

const mallirtResetLayer = defineResetLayer<"sliph">({
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
          dertoint: getRepeatableUpgradeLevel(defaultMergedPlayer, "dertoint"),
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
});

export default mallirtResetLayer;
