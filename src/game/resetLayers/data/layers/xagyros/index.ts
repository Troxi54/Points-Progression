import createDecimal from "@core/utils/decimal";
import { calculateCurrencyGain } from "@game/currencies/utils/calculate";
import formulas from "@game/formulas/data";
import { getRepeatableUpgradeLevel } from "@game/repeatableUpgrades/utils/get";
import { defineResetLayer } from "@game/resetLayers/utils/create";
import { applyUpgradesById } from "@game/upgrades/utils/apply";
import { hasUpgradeById } from "@game/upgrades/utils/has";

const xagyrosResetLayer = defineResetLayer<"sliph">({
  id: "xagyros",
  goal: createDecimal("1e205"),
  currency: "dertoints",
  reset: ({ player }, defaultMergedPlayer) => {
    const defaultPlayer = defaultMergedPlayer.player;

    const hasXagyros_1 = hasUpgradeById(player, "xagyros_1");
    const hasXagyros_2 = hasUpgradeById(player, "xagyros_2");
    const hasXagyros_3 = hasUpgradeById(player, "xagyros_3");
    const hasXagyros_4 = hasUpgradeById(player, "xagyros_4");

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
        ...applyUpgradesById(player, {
          dertoint_1: hasXagyros_1,
          dertoint_2: hasXagyros_1,
          dertoint_3: hasXagyros_1,
          dertoint_4: hasXagyros_1,
          mallirt_1: hasXagyros_1,
          mallirt_2: hasXagyros_1,
          mallirt_3: hasXagyros_1,
          mallirt_4: hasXagyros_1,
          level_1: hasXagyros_2,
          level_2: hasXagyros_2,
          level_3: hasXagyros_3,
          level_4: hasXagyros_3,
          level_5: hasXagyros_4,
          level_6: hasXagyros_4,
        }),
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
