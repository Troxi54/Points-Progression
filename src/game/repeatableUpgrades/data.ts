import Decimal from "break_eternity.js";
import { createRepeatableUpgradeContainer } from "./utils/create";
import { hasUpgradeById } from "@/game/upgrades/utils/has";
import { FlatRepeatableUpgradeContainer } from "./types";
import { objectEntries } from "@/core/utils/object";
import createDecimal from "@/core/utils/decimal";
import { everPerformed } from "@/game/resetLayers/utils/get";

const repeatableUpgrades = createRepeatableUpgradeContainer({
  normal: {
    point: {
      condition: ({ player }) => !player.enteredAmplivault,
      startCost: createDecimal(10),
      costScaling: createDecimal(1.2),
      currency: "points",
      spendCurrency: ({ player }) => !hasUpgradeById(player, "reset_1"),
      effectFormula: (lvl) => Decimal.pow(1.125, lvl),
      affects: "points",
      autobuy: ({ player }) => hasUpgradeById(player, "reset_2")
    },
    ampliflux: {
      condition: ({ player }) => hasUpgradeById(player, "tier_4"),
      startCost: createDecimal(10),
      costScaling: createDecimal(1.15),
      currency: "ampliflux",
      spendCurrency: ({ player }) => !hasUpgradeById(player, "tier_5"),
      effectFormula: (lvl) => Decimal.pow(1.1, lvl),
      affects: "ampliflux",
      autobuy: ({ player }) => hasUpgradeById(player, "tier_6")
    },
    vermyte: {
      condition: ({ player }) => everPerformed(player, "vermyros"),
      startCost: createDecimal(1),
      costScaling: createDecimal(2),
      currency: "vermytes",
      spendCurrency: ({ player }) => !hasUpgradeById(player, "vermyros_9"),
      effectFormula: (lvl) => Decimal.pow(3, lvl),
      affects: "points",
      autobuy: ({ player }) => hasUpgradeById(player, "vermyros_10")
    },
    core: {
      condition: ({ player }) => player.everMadeCoreReset,
      startCost: createDecimal(10),
      costScaling: createDecimal(10),
      currency: "cores",
      spendCurrency: ({ player }) => !hasUpgradeById(player, "nullith_1"),
      effectFormula: (lvl) => Decimal.pow(1.1, lvl),
      maxLevel: createDecimal(40),
      affects: "best points effect",
      autobuy: ({ player }) => hasUpgradeById(player, "nullith_4")
    }
  },
  sliph: {
    dertoint: {
      startCost: createDecimal(0.1),
      costScaling: createDecimal(10),
      currency: "dertoints",
      spendCurrency: ({ player }) => !hasUpgradeById(player, "dertoint_4"),
      effectFormula: (lvl) => Decimal.pow(2.35, lvl),
      affects: "dertoints",
      autobuy: ({ player }) => hasUpgradeById(player, "mallirt_4")
    },
    amplivoid: {
      startCost: createDecimal(10),
      costScaling: createDecimal(9),
      currency: "amplivoid",
      spendCurrency: ({ player }) => !hasUpgradeById(player, "level_5"),
      effectFormula: (lvl) => Decimal.pow(2, lvl),
      affects: "dertoints",
      autobuy: ({ player }) => hasUpgradeById(player, "level_6")
    }
  }
});

export default repeatableUpgrades;

export const flatRepeatableUpgrades = {} as FlatRepeatableUpgradeContainer;

function buildFlatRepeatableUpgrades() {
  for (const container of Object.values(repeatableUpgrades)) {
    for (const [key, upgrade] of objectEntries(container)) {
      flatRepeatableUpgrades[key] = upgrade;
    }
  }
}

buildFlatRepeatableUpgrades();
