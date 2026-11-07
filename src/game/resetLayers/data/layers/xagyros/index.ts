import createDecimal from "@core/utils/decimal";
import { objectAssign } from "@core/utils/object";
import { calculateCurrencyGain } from "@game/currencies/utils/calculate";
import formulas from "@game/formulas/data";
import { getRepeatableUpgradeLevel } from "@game/repeatableUpgrades/utils/get";
import { defineResetLayer } from "@game/resetLayers/utils/create";

const xagyrosResetLayer = defineResetLayer<"sliph">({
  id: "xagyros",
  goal: createDecimal("1e204"),
  currency: "dertoints",
  reset: ({ player }, defaultMergedPlayer) => {
    const defaultPlayer = defaultMergedPlayer.player;

    objectAssign(player, {
      score: defaultPlayer.score,
      XP: defaultPlayer.XP,
      amplivoid: defaultPlayer.amplivoid,
    });

    player.repeatableUpgrades.amplivoid = getRepeatableUpgradeLevel(
      defaultMergedPlayer,
      "amplivoid",
    );
  },
  reward: (mergedPlayer, sourceMergedPlayer) => {
    const { player } = mergedPlayer;

    const xagyteGain = calculateCurrencyGain(sourceMergedPlayer, "xagytes");

    player.xagytes = formulas.xagytes(mergedPlayer, xagyteGain);
  },
});

export default xagyrosResetLayer;
