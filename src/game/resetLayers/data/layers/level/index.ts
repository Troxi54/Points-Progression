import createDecimal from "@core/utils/decimal";
import { calculateCurrencyGain } from "@game/currencies/utils/calculate";
import formulas from "@game/formulas/data";
import { defineResetLayer } from "@game/resetLayers/utils/create";
import { applyUpgradesById } from "@game/upgrades/utils/apply";
import { hasUpgradeById } from "@game/upgrades/utils/has";

const levelResetLayer = defineResetLayer<"sliph">({
  id: "level",
  goal: createDecimal(1e25),
  currency: "dertoints",
  reset: ({ player }, defaultMergedPlayer) => {
    const defaultPlayer = defaultMergedPlayer.player;

    const hasLevel_1 = hasUpgradeById(player, "level_1");
    const hasLevel_2 = hasUpgradeById(player, "level_2");

    return {
      player: {
        mallirtTotalDertoints: defaultPlayer.mallirtTotalDertoints,
        ...applyUpgradesById(player, {
          dertoint_1: hasLevel_1,
          dertoint_2: hasLevel_1,
          dertoint_3: hasLevel_2,
          dertoint_4: hasLevel_2,
          mallirt_1: hasLevel_1,
          mallirt_2: hasLevel_2,
          mallirt_3: hasUpgradeById(player, "level_3"),
          mallirt_4: hasUpgradeById(player, "level_4"),
        }),
      },
    };
  },
  reward: (mergedPlayer) => {
    const scoreGain = calculateCurrencyGain(mergedPlayer, "score");

    return {
      player: {
        score: formulas.score(mergedPlayer, scoreGain),
      },
    };
  },
});

export default levelResetLayer;
