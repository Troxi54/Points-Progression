import { hasOneOfUpgrades, hasUpgradeById } from "@/game/upgrades/utils/has";
import { createCurrencyDataContainer } from "./utils/create";
import { everPerformed } from "@/game/resetLayers/utils/get";
import { getCachedCurrencyProp } from "./utils/get";
import { hasNexusLevel } from "@/game/features/nexus/utils/has";

const currencyData = createCurrencyDataContainer({
  points: {
    layer: 1,
    name: null,
    affects: {
      madeNullithResets: {
        works: ({ player }) => hasNexusLevel(player, 1),
      },
    },
    passiveGainWorks: true,
  },
  madeTierTimes: {
    layer: 2,
    name: "Tier Reset",
    affects: {
      points: {},
      dertoints: {
        works: ({ player }) => hasNexusLevel(player, 5),
      },
    },
    passiveGainWorks: ({ player }) => hasUpgradeById(player, "vermyros_2"),
  },
  ampliflux: {
    layer: 2,
    affects: {
      points: {},
      madeTierTimes: {
        works: ({ player }) => hasNexusLevel(player, 6),
      },
    },
    passiveGainWorks: ({ player }) => hasUpgradeById(player, "tier_4"),
  },
  vermytes: {
    layer: 3,
    name: "Vermyte",
    affects: {
      score: {
        works: ({ player }) => hasNexusLevel(player, 9),
      },
    },
    passiveGainWorks: ({ player }) =>
      hasOneOfUpgrades(player, { vermyros: [4, 5, 6, 7] }),
  },
  vermora: {
    layer: 3,
    affects: {
      ampliflux: {},
      amplivoid: {
        works: ({ player }) => hasNexusLevel(player, 8),
      },
    },
    passiveGainWorks: ({ player }) => everPerformed(player, "vermyros"),
  },
  energyReactors: {
    layer: 3,
    name: "Energy Reactor",
    affects: "energy",
    passiveGainWorks: ({ player }) => hasUpgradeById(player, "vermyros_8"),
  },
  energy: {
    layer: 3,
    affects: "points",
    passiveGainWorks: ({ player }) => hasUpgradeById(player, "vermyros_8"),
  },
  cores: {
    layer: 3,
    name: "Core",
    affects: "energyReactors",
    passiveGainWorks: ({ player }) =>
      hasOneOfUpgrades(player, { nullith: [3, 4, 5, 6] }),
  },
  darkEnergy: {
    layer: 3,
    name: "Dark Energy",
    affects: "energyReactors",
    passiveGainWorks: ({ player }) =>
      hasUpgradeById(player, "vermyros_10") || everPerformed(player, "nullith"),
  },
  madeNullithResets: {
    layer: 4,
    name: "Nullith Reset",
    affects: { points: {}, vermytes: {}, energy: {} },
    effectMode: "multiply",
    passiveGainWorks: ({ player }) => hasUpgradeById(player, "nullith_5"),
  },
  nullions: {
    layer: 4,
    name: "Nullion",
    affects: "madeNullithResets",
    passiveGainWorks: ({ player }) =>
      hasOneOfUpgrades(player, { nullith: [7, 8, 9, 10] }),
  },
  dertoints: {
    dimensionId: "sliph",
    layer: 1,
    name: "Dertoint",
    affects: "darkEnergy",
    effectMode: "pow",
    passiveGainWorks: true,
  },
  mallirtTotalDertoints: {
    dimensionId: "sliph",
    layer: 1,
    name: "Total Dertoint",
    affects: "dertoints",
    passiveGainWorks: ({ player }) =>
      hasOneOfUpgrades(player, { level: [2, 3, 4, 5, 6] }),
  },
  cappergy: {
    dimensionId: "sliph",
    layer: 1,
    affects: "dertoints",
    effectMode: "pow",
    passiveGainWorks: ({ cachedPlayer }) =>
      getCachedCurrencyProp(cachedPlayer, "cappergy", "gain").greaterThan(0),
    effectWorks: false,
  },
  score: {
    dimensionId: "sliph",
    layer: 2,
    affects: "XP",
  },
  XP: {
    dimensionId: "sliph",
    layer: 2,
    passiveGainWorks: true,
  },
  nux: {
    layer: 4,
    affects: "madeNullithResets",
  },
  amplivoid: {
    dimensionId: "sliph",
    layer: 2,
    affects: "ampliflux",
    passiveGainWorks: ({ player }) => hasUpgradeById(player, "level_4"),
  },
});

export default currencyData;
