import createDecimal from "@core/utils/decimal";
import { calculateCurrencyGain } from "@game/currencies/utils/calculate";
import formulas from "@game/formulas/data";
import { getRepeatableUpgradeLevel } from "@game/repeatableUpgrades/utils/get";
import { defineResetLayer } from "@game/resetLayers/utils/create";

const xagyrosResetLayer = defineResetLayer<"sliph">({
  id: "xagyros",
  goal: createDecimal("1e204"),
  currency: "dertoints",
  reset: (_, defaultMergedPlayer) => {
    const defaultPlayer = defaultMergedPlayer.player;

    return {
      player: {
        score: defaultPlayer.score,
        XP: defaultPlayer.XP,
        amplivoid: defaultPlayer.amplivoid,
        repeatableUpgrades: {
          amplivoid: getRepeatableUpgradeLevel(
            defaultMergedPlayer,
            "amplivoid",
          ),
        },
      },
    };
  },
  reward: (mergedPlayer) => {
    const xagyteGain = calculateCurrencyGain(mergedPlayer, "xagytes");

    return {
      player: {
        xagytes: formulas.xagytes(mergedPlayer, xagyteGain),
      },
    };
  },
});

export default xagyrosResetLayer;
