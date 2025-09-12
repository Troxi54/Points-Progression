import Decimal from "break_eternity.js";
import {
  BooleanKeys,
  CachedPlayer,
  DecimalKeys,
  MergedPlayer,
  PartialMergedPlayer,
  Player,
  Settings
} from "@player/playerTypes";
import { settings } from "@player/settings";
import { usePlayerStore } from "@player/playerStore";
import { cacheUpdates } from "@gameLoop/cacheUpdates";
import { mergePlayer } from "@player/playerUtils";
import { format } from "./format";

export interface Buyable {
  cost: DecimalKeys<CachedPlayer>;
  maxLevel?: DecimalKeys<Settings>;
  whatCosts: DecimalKeys<Player>;
  costScaling: DecimalKeys<Settings>;
  bulkName: DecimalKeys<CachedPlayer>;
  levelName: DecimalKeys<Player>;
  conditions?: (player: Player) => boolean;
  spendCurrency?: (player: Player) => boolean;
  cacheUpdate: (merged: MergedPlayer) => void;
}

type BuyableString = "point" | "ampliflux" | "vermyte" | "core" | "dertoint";

const buyables: Record<BuyableString, Buyable> = {
  point: {
    cost: "upgradeCost",
    whatCosts: "points",
    costScaling: "upgradeScaling",
    bulkName: "upgradeBulk",
    levelName: "upgradeLvl",
    conditions: (player) => !player.enteredAmplivault,
    spendCurrency: (player) => !player.boughtFirstResetUpgrade,
    cacheUpdate: cacheUpdates.pointUpgrade
  },
  ampliflux: {
    cost: "amplifluxUpgradeCost",
    whatCosts: "ampliflux",
    costScaling: "amplifluxUpgradeCostScaling",
    bulkName: "amplifluxUpgradeBulk",
    levelName: "amplifluxUpgradeLvl",
    conditions: (player) => player.boughtFourthTierUpgrade,
    spendCurrency: (player) => !player.boughtFifthTierUpgrade,
    cacheUpdate: cacheUpdates.amplifluxUpgrade
  },
  vermyte: {
    cost: "vermytesUpgradeCost",
    whatCosts: "vermytes",
    costScaling: "vermytesUpgradeCostScaling",
    bulkName: "vermytesUpgradeBulk",
    levelName: "vermytesUpgradeLvl",
    conditions: (player) => player.everMadeVermyros,
    spendCurrency: (player) => !player.boughtNinthVermyrosUpgrade,
    cacheUpdate: cacheUpdates.vermyteUpgrade
  },
  core: {
    cost: "coreUpgradeCost",
    maxLevel: "maxCoreUpgradeLevel",
    whatCosts: "cores",
    costScaling: "coreUpgradeCostScaling",
    bulkName: "coreUpgradeBulk",
    levelName: "coreUpgradeLvl",
    conditions: (player) => player.everMadeCoreReset,
    spendCurrency: (player) => !player.boughtFirstNullithUpgrade,
    cacheUpdate: cacheUpdates.coreUpgrade
  },
  dertoint: {
    cost: "dertointUpgradeCost",
    whatCosts: "dertoints",
    costScaling: "dertointUpgradeCostScaling",
    bulkName: "dertointUpgradeBulk",
    levelName: "dertointUpgradeLvl",
    conditions: (player) => player.enteredSliph,
    spendCurrency: (player) => !player.boughtFourthDertointUpgrade,
    cacheUpdate: cacheUpdates.dertointUpgrade
  }
} as const;

export function buyMaxBuyable(
  whatBuyable: BuyableString,
  justUpdateBulk: boolean = false,
  mergedPlayer?: MergedPlayer
): PartialMergedPlayer {
  const buyable = buyables[whatBuyable];

  const state = mergedPlayer || usePlayerStore.getState();
  const [player, cachedPlayer] = [
    { ...state.player },
    { ...state.cachedPlayer }
  ];

  const cost = cachedPlayer[buyable.cost];

  const levelName = buyable.levelName;
  const level = player[levelName];

  const maxLevel = buyable.maxLevel
    ? settings[buyable.maxLevel]
    : new Decimal(Infinity);
  const isMaxed = level.greaterThanOrEqualTo(maxLevel);

  const conditions = buyable.conditions || (() => true);
  const spendCurrency = buyable.spendCurrency || (() => true);
  const whatCosts = buyable.whatCosts;
  const currency = player[whatCosts];
  const costScaling = settings[buyable.costScaling];

  const bulkName = buyable.bulkName;
  if (currency.lessThan(cost) || !conditions(player))
    return { cachedPlayer: { [bulkName]: new Decimal(0) } };

  let bulk: Decimal;
  if (isMaxed) bulk = new Decimal(0);
  else {
    bulk = currency
      .dividedBy(cost)
      .log(costScaling)
      .floor()
      .plus(currency.greaterThanOrEqualTo(cost) ? 1 : 0);
    if (bulk.plus(level).greaterThan(maxLevel)) {
      bulk = maxLevel.minus(level);
    }
  }

  const array = { [bulkName]: bulk };

  if (
    currency.lessThan(cost) ||
    justUpdateBulk ||
    !conditions(player) ||
    isMaxed
  )
    return { cachedPlayer: array };

  const finalCost = cost.multiply(costScaling.pow(bulk.minus(1)));

  Object.assign(player, {
    [whatCosts]: spendCurrency(player) ? currency.minus(finalCost) : currency,
    [levelName]: level.plus(bulk)
  });
  cachedPlayer[bulkName] = new Decimal(0);

  buyable.cacheUpdate(mergePlayer(player, cachedPlayer));

  return {
    player: player,
    cachedPlayer: cachedPlayer
  };
}

export function buyBuyable(
  whatBuyable: BuyableString,
  mergedPlayer?: MergedPlayer
): PartialMergedPlayer {
  const buyable = buyables[whatBuyable];

  const state = mergedPlayer || usePlayerStore.getState();
  const [player, cachedPlayer] = [
    { ...state.player },
    { ...state.cachedPlayer }
  ];

  const cost = cachedPlayer[buyable.cost];

  const levelName = buyable.levelName;
  const level = player[levelName];

  const maxLevel = buyable.maxLevel
    ? settings[buyable.maxLevel]
    : new Decimal(Infinity);
  const isMaxed = level.greaterThanOrEqualTo(maxLevel);

  const conditions = buyable.conditions || (() => true);
  const spendCurrency = buyable.spendCurrency || (() => true);
  const whatCosts = buyable.whatCosts;
  const currency = player[whatCosts];

  if (currency.lessThan(cost) || !conditions(player) || isMaxed) return {};

  Object.assign(player, {
    [whatCosts]: spendCurrency(player) ? currency.minus(cost) : currency,
    [levelName]: player[levelName].plus(1)
  });

  buyable.cacheUpdate(mergePlayer(player, cachedPlayer));

  return {
    player: player,
    cachedPlayer: cachedPlayer
  };
}

export function automateUpgrade(
  mergedPlayer: MergedPlayer
): PartialMergedPlayer {
  return buyMaxBuyable(
    "point",
    !mergedPlayer.player.boughtSecondResetUpgrade,
    mergedPlayer
  );
}

export function automateAmplifluxUpgrade(
  mergedPlayer: MergedPlayer
): PartialMergedPlayer {
  return buyMaxBuyable(
    "ampliflux",
    !mergedPlayer.player.boughtSixthTierUpgrade,
    mergedPlayer
  );
}

export function automateVermyteUpgrade(
  mergedPlayer: MergedPlayer
): PartialMergedPlayer {
  return buyMaxBuyable(
    "vermyte",
    !mergedPlayer.player.boughtTenthVermyrosUpgrade,
    mergedPlayer
  );
}

export function automateCoreUpgrade(
  mergedPlayer: MergedPlayer
): PartialMergedPlayer {
  return buyMaxBuyable(
    "core",
    !mergedPlayer.player.boughtFourthNullithUpgrade,
    mergedPlayer
  );
}

export function automateDertointpgrade(
  mergedPlayer: MergedPlayer
): PartialMergedPlayer {
  return buyMaxBuyable(
    "dertoint",
    !mergedPlayer.player.boughtFourthMallirtUpgrade,
    mergedPlayer
  );
}

export interface Upgrade {
  id: number;
  name: string;
  cost: DecimalKeys<Settings>;
  currency: DecimalKeys<Player>;
  takesCurrency: (player: Player) => boolean;
  description: string | ((mergedPlayer: MergedPlayer) => string);
  isBoughtName: BooleanKeys<Player>;
  show: (player: Player) => boolean;
  previousUpgradeFromAnotherContainerBoughtName?: BooleanKeys<Player>;
}

type UpgradeContainer = Readonly<Upgrade>[];

export const upgrades: Record<string, UpgradeContainer> = {
  resetUpgrades: [
    {
      id: 1,
      name: "Reset upgrade 1",
      cost: "resetFirstUpgradeCost",
      currency: "points",
      takesCurrency: (player) =>
        !(
          player.boughtFirstTierUpgrade ||
          player.boughtFirstVermyrosUpgrade ||
          player.boughtFirstNullithUpgrade
        ),
      description: "Point Upgrade no longer takes Points",
      isBoughtName: "boughtFirstResetUpgrade",
      show: () => true
    },
    {
      id: 2,
      name: "Reset upgrade 2",
      cost: "resetSecondUpgradeCost",
      currency: "points",
      takesCurrency: (player) =>
        !(
          player.boughtFirstTierUpgrade ||
          player.boughtFirstVermyrosUpgrade ||
          player.boughtFirstNullithUpgrade
        ),
      description: "Automate Point Upgrade",
      isBoughtName: "boughtSecondResetUpgrade",
      show: (player) => player.boughtFirstResetUpgrade || player.everMadeTier
    }
  ],
  tierUpgrades: [
    {
      id: 3,
      name: "Tier upgrade 1",
      cost: "firstTierUpgradeCost",
      currency: "points",
      takesCurrency: (player) =>
        !(
          player.boughtFirstVermyrosUpgrade || player.boughtFirstNullithUpgrade
        ),
      description:
        "Reset upgrades no longer take Points and keep the first one",
      isBoughtName: "boughtFirstTierUpgrade",
      show: () => true
    },
    {
      id: 4,
      name: "Tier upgrade 2",
      cost: "secondTierUpgradeCost",
      currency: "points",
      takesCurrency: (player) =>
        !(
          player.boughtFirstVermyrosUpgrade || player.boughtFirstNullithUpgrade
        ),
      description: "Keep the second Reset upgrade",
      isBoughtName: "boughtSecondTierUpgrade",
      show: (player) => player.boughtFirstTierUpgrade || player.everMadeVermyros
    },
    {
      id: 5,
      name: "Tier upgrade 3",
      cost: "thirdTierUpgradeCost",
      currency: "points",
      takesCurrency: (player) =>
        !(
          player.boughtFirstVermyrosUpgrade || player.boughtFirstNullithUpgrade
        ),
      description:
        "Always have 10ms best reset run, disable auto reset and unlock offline Tier Resets",
      isBoughtName: "boughtThirdTierUpgrade",
      show: (player) =>
        player.boughtSecondTierUpgrade || player.everMadeVermyros
    },
    {
      id: 6,
      name: "Tier upgrade 4",
      cost: "fourthTierUpgradeCost",
      currency: "points",
      takesCurrency: (player) =>
        !(
          player.boughtFirstVermyrosUpgrade || player.boughtFirstNullithUpgrade
        ),
      description:
        "Automatically update Reset Best Points, remove the 'Auto Reset' toggle and unlock Ampliflux",
      isBoughtName: "boughtFourthTierUpgrade",
      show: (player) => player.boughtThirdTierUpgrade || player.everMadeVermyros
    }
  ],
  moreTierUpgrades: [
    {
      id: 7,
      name: "Tier upgrade 5",
      cost: "fifthTierUpgradeCost",
      currency: "points",
      takesCurrency: (player) =>
        !(
          player.boughtFirstVermyrosUpgrade || player.boughtFirstNullithUpgrade
        ),
      description: "Ampliflux upgrade no longer takes Ampliflux",
      isBoughtName: "boughtFifthTierUpgrade",
      show: () => true,
      previousUpgradeFromAnotherContainerBoughtName: "boughtFourthTierUpgrade"
    },
    {
      id: 8,
      name: "Tier upgrade 6",
      cost: "sixthTierUpgradeCost",
      currency: "points",
      takesCurrency: (player) =>
        !(
          player.boughtFirstVermyrosUpgrade || player.boughtFirstNullithUpgrade
        ),
      description: "Automate Ampliflux Upgrade",
      isBoughtName: "boughtSixthTierUpgrade",
      show: (player) => player.boughtFifthTierUpgrade || player.everMadeVermyros
    }
  ],
  vermyrosUpgrades: [
    {
      id: 9,
      name: "Vermyros upgrade 1",
      cost: "firstVermyrosUpgradeCost",
      currency: "vermytes",
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description:
        "Reset and Tier upgrades no longer take Points and unlock the Vermyte Upgrade",
      isBoughtName: "boughtFirstVermyrosUpgrade",
      show: () => true
    },
    {
      id: 10,
      name: "Vermyros upgrade 2",
      cost: "secondVermyrosUpgradeCost",
      currency: "points",
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description:
        "Keep 1st and 2nd Reset and Tier upgrades, generate 60 Tier Resets per second and replace the 'Auto Tier' toggle with the 'Auto Tier Up' toggle",
      isBoughtName: "boughtSecondVermyrosUpgrade",
      show: (player) =>
        player.boughtFirstVermyrosUpgrade || player.everMadeNullith
    },
    {
      id: 11,
      name: "Vermyros upgrade 3",
      cost: "thirdVermyrosUpgradeCost",
      currency: "points",
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description: "Keep 3-6 Tier upgrades",
      isBoughtName: "boughtThirdVermyrosUpgrade",
      show: (player) =>
        player.boughtSecondVermyrosUpgrade || player.everMadeNullith
    },
    {
      id: 12,
      name: "Vermyros upgrade 4",
      cost: "fourthVermyrosUpgradeCost",
      currency: "points",
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description:
        "Tier no longer resets anything and generate 0.1% of your Best Vermytes per second",
      isBoughtName: "boughtFourthVermyrosUpgrade",
      show: (player) =>
        player.boughtThirdVermyrosUpgrade || player.everMadeNullith
    }
  ],
  moreVermyrosUpgrades: [
    {
      id: 13,
      name: "Vermyros upgrade 5",
      cost: "fifthVermyrosUpgradeCost",
      currency: "points",
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description:
        "Unlock Amplivault and generate 1% of your Best Vermytes per second",
      isBoughtName: "boughtFifthVermyrosUpgrade",
      show: () => true,
      previousUpgradeFromAnotherContainerBoughtName:
        "boughtFourthVermyrosUpgrade"
    },
    {
      id: 14,
      name: "Vermyros upgrade 6",
      cost: "sixthVermyrosUpgradeCost",
      currency: "points",
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description: "Generate 10% of your Best Vermytes per second",
      isBoughtName: "boughtSixthVermyrosUpgrade",
      show: (player) =>
        player.boughtFifthVermyrosUpgrade || player.everMadeNullith
    },
    {
      id: 15,
      name: "Vermyros upgrade 7",
      cost: "seventhVermyrosUpgradeCost",
      currency: "points",
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description: "Generate 100% of your Best Vermytes per second",
      isBoughtName: "boughtSeventhVermyrosUpgrade",
      show: (player) =>
        player.boughtSixthVermyrosUpgrade || player.everMadeNullith
    },
    {
      id: 16,
      name: "Vermyros upgrade 8",
      cost: "eighthVermyrosUpgradeCost",
      currency: "points",
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description:
        "Automatically update Best Vermytes, remove the 'Auto Vermyros' toggle and unlock Energy",
      isBoughtName: "boughtEighthVermyrosUpgrade",
      show: (player) =>
        player.boughtSeventhVermyrosUpgrade || player.everMadeNullith
    }
  ],
  moreVermyrosUpgrades2: [
    {
      id: 17,
      name: "Vermyros upgrade 9",
      cost: "ninthVermyrosUpgradeCost",
      currency: "points",
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description: "Vermyte Upgrade no longer takes Vermytes",
      isBoughtName: "boughtNinthVermyrosUpgrade",
      show: () => true,
      previousUpgradeFromAnotherContainerBoughtName:
        "boughtEighthVermyrosUpgrade"
    },
    {
      id: 18,
      name: "Vermyros upgrade 10",
      cost: "tenthVermyrosUpgradeCost",
      currency: "points",
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description:
        "Automate Vermyte Upgrade and permanently unlock Dark Energy",
      isBoughtName: "boughtTenthVermyrosUpgrade",
      show: (player) =>
        player.boughtNinthVermyrosUpgrade || player.everMadeNullith
    }
  ],
  nullithUpgrades: [
    {
      id: 19,
      name: "Nullith upgrade 1",
      cost: "firstNullithUpgradeCost",
      currency: "points",
      takesCurrency: () => true,
      description:
        "Reset, Tier, Vermyros upgrades no longer take anything, and Core upgrade also no longer takes Cores",
      isBoughtName: "boughtFirstNullithUpgrade",
      show: () => true
    },
    {
      id: 20,
      name: "Nullith upgrade 2",
      cost: "secondNullithUpgradeCost",
      currency: "points",
      takesCurrency: () => true,
      description:
        "Keep all Reset and Tier upgrades, keep 1-4 Vermyros upgrades and converting Energy into Cores no longer resets Energy Reactors",
      isBoughtName: "boughtSecondNullithUpgrade",
      show: (player) => player.boughtFirstNullithUpgrade
    },
    {
      id: 21,
      name: "Nullith upgrade 3",
      cost: "thirdNullithUpgradeCost",
      currency: "points",
      takesCurrency: () => true,
      description:
        "Keep 5-8 Vermyros upgrades, keep Amplivault Level and generate 0.1% of Cores you could gain",
      isBoughtName: "boughtThirdNullithUpgrade",
      show: (player) => player.boughtSecondNullithUpgrade
    },
    {
      id: 22,
      name: "Nullith upgrade 4",
      cost: "fourthNullithUpgradeCost",
      currency: "points",
      takesCurrency: () => true,
      description:
        "Keep 9-10 Vermyros upgrades, automatically buy Core upgrade, generate 1% of Cores you could gain, unlock offline Nullith Resets and Nullifice",
      isBoughtName: "boughtFourthNullithUpgrade",
      show: (player) => player.boughtThirdNullithUpgrade
    }
  ],
  moreNullithUpgrades: [
    {
      id: 23,
      name: "Nullith upgrade 5",
      cost: "fifthNullithUpgradeCost",
      currency: "points",
      takesCurrency: () => true,
      description:
        "Unlock Sliph, Nullith no longer reset anything and generate 10% of Cores you could gain",
      isBoughtName: "boughtFifthNullithUpgrade",
      show: () => true,
      previousUpgradeFromAnotherContainerBoughtName:
        "boughtFourthNullithUpgrade"
    },
    {
      id: 24,
      name: "Nullith upgrade 6",
      cost: "sixthNullithUpgradeCost",
      currency: "points",
      takesCurrency: () => true,
      description: "Generate 100% of Cores you could gain",
      isBoughtName: "boughtSixthNullithUpgrade",
      show: (player) => player.boughtFifthNullithUpgrade
    }
  ],
  dertointUpgrades: [
    {
      id: 25,
      name: "Dertoint Upgrade 1",
      cost: "firstDertointUpgradeCost",
      currency: "dertoints",
      takesCurrency: () => true,
      description: (mergedPlayer) =>
        `Points boost Dertoints at a reduced rate${` (${format(
          mergedPlayer.cachedPlayer.firstDertointUpgradeEffect
        )}x)`}`,
      isBoughtName: "boughtFirstDertointUpgrade",
      show: () => true
    },
    {
      id: 26,
      name: "Dertoint Upgrade 2",
      cost: "secondDertointUpgradeCost",
      currency: "dertoints",
      takesCurrency: () => true,
      description: "The Nullion effect also applies to Tier Resets",
      isBoughtName: "boughtSecondDertointUpgrade",
      show: (player) => player.boughtFirstDertointUpgrade
    },
    {
      id: 27,
      name: "Dertoint Upgrade 3",
      cost: "thirdDertointUpgradeCost",
      currency: "dertoints",
      takesCurrency: () => true,
      description: "The Nullion effect also applies to Dertoints",
      isBoughtName: "boughtThirdDertointUpgrade",
      show: (player) => player.boughtSecondDertointUpgrade
    },
    {
      id: 28,
      name: "Dertoint Upgrade 4",
      cost: "fourthDertointUpgradeCost",
      currency: "dertoints",
      takesCurrency: () => true,
      description: "Dertoint Upgrade no longer takes Dertoints",
      isBoughtName: "boughtFourthDertointUpgrade",
      show: (player) => player.boughtThirdDertointUpgrade
    }
  ],
  mallirtUpgrades: [
    {
      id: 29,
      name: "Mallirt Upgrade 1",
      cost: "firstMallirtUpgradeCost",
      currency: "mallirtTotalDertoints",
      takesCurrency: () => true,
      description: "Keep 1-2 Dertoint upgrades",
      isBoughtName: "boughtFirstMallirtUpgrade",
      show: () => true
    },
    {
      id: 30,
      name: "Mallirt Upgrade 2",
      cost: "secondMallirtUpgradeCost",
      currency: "mallirtTotalDertoints",
      takesCurrency: () => true,
      description: "Keep 3-4 Dertoint upgrades",
      isBoughtName: "boughtSecondMallirtUpgrade",
      show: (player) => player.boughtFirstMallirtUpgrade
    },
    {
      id: 31,
      name: "Mallirt Upgrade 3",
      cost: "thirdMallirtUpgradeCost",
      currency: "mallirtTotalDertoints",
      takesCurrency: () => true,
      description: "Square Dark Energy effect",
      isBoughtName: "boughtThirdMallirtUpgrade",
      show: (player) => player.boughtSecondMallirtUpgrade
    },
    {
      id: 32,
      name: "Mallirt Upgrade 4",
      cost: "fourthMallirtUpgradeCost",
      currency: "mallirtTotalDertoints",
      takesCurrency: () => true,
      description:
        "Automate Dertoint Upgrade and square Dark Energy effect again",
      isBoughtName: "boughtFourthMallirtUpgrade",
      show: (player) => player.boughtThirdMallirtUpgrade
    }
  ]
} as const;
