import createDecimal from "@core/utils/decimal";
import { calculateCurrencyGain } from "@game/currencies/utils/calculate";
import formulas from "@game/formulas/data";
import { defineResetLayer } from "@game/resetLayers/utils/create";

const levelResetLayer = defineResetLayer<"sliph">({
  id: "level",
  goal: createDecimal(1e25),
  currency: "dertoints",
  reset: ({ player }, defaultMergedPlayer) => {
    const defaultPlayer = defaultMergedPlayer.player;

    player.mallirtTotalDertoints = defaultPlayer.mallirtTotalDertoints;
  },
  reward: (mergedPlayer) => {
    const { player } = mergedPlayer;

    const scoreGain = calculateCurrencyGain(mergedPlayer, "score");

    player.score = formulas.score(mergedPlayer, scoreGain);
  },
});

export default levelResetLayer;
