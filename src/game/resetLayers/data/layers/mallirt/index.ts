import createDecimal from "@core/utils/decimal";
import { calculateCurrencyGain } from "@game/currencies/utils/calculate";
import { getCurrencyEffectOn } from "@game/currencies/utils/get";
import { getRepeatableUpgradeLevel } from "@game/repeatableUpgrades/utils/get";
import { defineResetLayer } from "@game/resetLayers/utils/create";

const mallirtResetLayer = defineResetLayer<"sliph">({
  id: "mallirt",
  goal: createDecimal(1e6),
  currency: "dertoints",
  playerSelector: ({ mergedPlayer: { player, cachedPlayer } }) => ({
    mallirtTotalDertoints: player.mallirtTotalDertoints,
    mallirtTotalDertointsEffect: getCurrencyEffectOn(
      cachedPlayer,
      "mallirtTotalDertoints",
      "dertoints",
    ),
  }),
  reset: (_, defaultMergedPlayer) => {
    const defaultPlayer = defaultMergedPlayer.player;

    return {
      player: {
        dertoints: defaultPlayer.dertoints,
        repeatableUpgrades: {
          dertoint: getRepeatableUpgradeLevel(defaultMergedPlayer, "dertoint"),
        },
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
