import Decimal from "break_eternity.js";
import { Player, Settings } from "./components/PlayerContext";
import { settings } from "./playerUtils";

export function buyMax(updates: Player, justUpdateBulk: boolean = false) {
  const array = { upgradeBulk: updates.points.dividedBy(updates.upgradeCost).log(settings.upgradeScaling).floor().plus(updates.points.greaterThanOrEqualTo(updates.upgradeCost) ? 1 : 0)};
  if (updates.points.lessThan(updates.upgradeCost) || justUpdateBulk || updates.enteredAmplivault) return array;
  const finalCost = updates.upgradeCost.multiply(settings.upgradeScaling.pow(array.upgradeBulk.minus(1)));
  return {
    upgradeBulk: new Decimal(0),
    points: updates.boughtFirstResetUpgrade ? updates.points : updates.points.minus(finalCost),
    upgradeLvl: updates.upgradeLvl.plus(array.upgradeBulk)
  };
}

export function buyMaxAmpliflux(updates: Player, justUpdateBulk: boolean = false) {
  const array = { amplifluxUpgradeBulk: updates.ampliflux.dividedBy(updates.amplifluxUpgradeCost).log(settings.amplifluxUpgradeCostScaling).floor().plus(updates.ampliflux.greaterThanOrEqualTo(updates.amplifluxUpgradeCost) ? 1 : 0)};
  if (updates.ampliflux.lessThan(updates.amplifluxUpgradeCost) || !updates.boughtFourthTierUpgrade || justUpdateBulk) return array;
  const finalCost = updates.amplifluxUpgradeCost.multiply(settings.amplifluxUpgradeCostScaling.pow(array.amplifluxUpgradeBulk.minus(1)));
  return {
    amplifluxUpgradeBulk: new Decimal(0),
    ampliflux: updates.boughtFifthTierUpgrade ? updates.ampliflux : updates.ampliflux.minus(finalCost),
    amplifluxUpgradeLvl: updates.amplifluxUpgradeLvl.plus(array.amplifluxUpgradeBulk),
  };
}

export function buyMaxVermyte(updates: Player, justUpdateBulk: boolean = false) {
  const array = { vermytesUpgradeBulk: updates.vermytes.dividedBy(updates.vermytesUpgradeCost).log(settings.vermytesUpgradeCostScaling).floor().plus(updates.vermytes.greaterThanOrEqualTo(updates.vermytesUpgradeCost) ? 1 : 0)};
  if (updates.vermytes.lessThan(updates.vermytesUpgradeCost) || !updates.everMadeVermyros || justUpdateBulk) return array;
  const finalCost = updates.vermytesUpgradeCost.multiply(settings.vermytesUpgradeCostScaling.pow(array.vermytesUpgradeBulk.minus(1)));
  return {
    vermytesUpgradeBulk: new Decimal(0),
    vermytes: updates.boughtNinthVermyrosUpgrade ? updates.vermytes : updates.vermytes.minus(finalCost),
    vermytesUpgradeLvl: updates.vermytesUpgradeLvl.plus(array.vermytesUpgradeBulk)
  };
}

export function buyMaxCore(updates: Player, justUpdateBulk: boolean = false) {
  let bulk: Decimal;
  if (updates.isCoreUpgradeMaxed)
    bulk = new Decimal(0);
  else 
    bulk = updates.cores.dividedBy(updates.coreUpgradeCost).log(settings.coreUpgradeCostScaling).floor().plus(updates.cores.greaterThanOrEqualTo(updates.coreUpgradeCost) ? 1 : 0)
  const array = { coreUpgradeBulk: bulk };
  if (updates.cores.lessThan(updates.coreUpgradeCost) || !updates.everMadeCoreReset || justUpdateBulk || updates.isCoreUpgradeMaxed) return array;
  const finalCost = updates.coreUpgradeCost.multiply(settings.coreUpgradeCostScaling.pow(array.coreUpgradeBulk.minus(1)));
  return {
    coreUpgradeBulk: new Decimal(0),
    cores: updates.boughtFirstNullithUpgrade ? updates.cores : updates.cores.minus(finalCost),
    coreUpgradeLvl: updates.coreUpgradeLvl.plus(array.coreUpgradeBulk)
  };
}

type BooleanKeys<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never
}[keyof T];

type DecimalKeys<T> = {
  [K in keyof T]: T[K] extends Decimal ? K : never
}[keyof T];

export interface Upgrade {
  id: number,
  name: string,
  cost: DecimalKeys<Settings>,
  currency: DecimalKeys<Player>,
  takesCurrency: (player: Player) => boolean,
  description: string,
  isBoughtName: BooleanKeys<Player>,
  show: (player: Player) => boolean,
  previousUpgradeFromAnotherContainerBoughtName?: BooleanKeys<Player>
};

type UpgradeContainer = Upgrade[];

export const upgrades: Record<string, UpgradeContainer> = {
  resetUpgrades: [
    {
      id: 1,
      name: 'Reset upgrade 1',
      cost: 'resetFirstUpgradeCost',
      currency: 'points',
      takesCurrency: (player) => !(player.boughtFirstTierUpgrade || player.boughtFirstVermyrosUpgrade || player.boughtFirstNullithUpgrade),
      description: 'Upgrade no longer takes points',
      isBoughtName: 'boughtFirstResetUpgrade',
      show: () => true
    },
    {
      id: 2,
      name: 'Reset upgrade 2',
      cost: 'resetSecondUpgradeCost',
      currency: 'points',
      takesCurrency: (player) => !(player.boughtFirstTierUpgrade || player.boughtFirstVermyrosUpgrade || player.boughtFirstNullithUpgrade),
      description: 'Automate upgrade',
      isBoughtName: 'boughtSecondResetUpgrade',
      show: (player) => player.boughtFirstResetUpgrade || player.everMadeTier 
    }
  ],
  tierUpgrades: [
    {
      id: 3,
      name: 'Tier upgrade 1',
      cost: 'firstTierUpgradeCost',
      currency: 'points',
      takesCurrency: (player) => !(player.boughtFirstVermyrosUpgrade || player.boughtFirstNullithUpgrade),
      description: 'Reset upgrades no longer take points and keep the first one',
      isBoughtName: 'boughtFirstTierUpgrade',
      show: () => true
    },
    {
      id: 4,
      name: 'Tier upgrade 2',
      cost: 'secondTierUpgradeCost',
      currency: 'points',
      takesCurrency: (player) => !(player.boughtFirstVermyrosUpgrade || player.boughtFirstNullithUpgrade),
      description: 'Keep the second reset upgrade',
      isBoughtName: 'boughtSecondTierUpgrade',
      show: (player) => player.boughtFirstTierUpgrade || player.everMadeVermyros
    },
    {
      id: 5,
      name: 'Tier upgrade 3',
      cost: 'thirdTierUpgradeCost',
      currency: 'points',
      takesCurrency: (player) => !(player.boughtFirstVermyrosUpgrade || player.boughtFirstNullithUpgrade),
      description: 'Always have 10ms best reset run, disable auto reset and unlock offline tier resets',
      isBoughtName: 'boughtThirdTierUpgrade',
      show: (player) => player.boughtSecondTierUpgrade || player.everMadeVermyros
    },
    {
      id: 6,
      name: 'Tier upgrade 4',
      cost: 'fourthTierUpgradeCost',
      currency: 'points',
      takesCurrency: (player) => !(player.boughtFirstVermyrosUpgrade || player.boughtFirstNullithUpgrade),
      description: "Automatically update reset best points, remove the 'Auto Reset' toggle and unlock ampliflux",
      isBoughtName: 'boughtFourthTierUpgrade',
      show: (player) => player.boughtThirdTierUpgrade || player.everMadeVermyros
    }
  ],
  moreTierUpgrades: [
    {
      id: 7,
      name: 'Tier upgrade 5',
      cost: 'fifthTierUpgradeCost',
      currency: 'points',
      takesCurrency: (player) => !(player.boughtFirstVermyrosUpgrade || player.boughtFirstNullithUpgrade),
      description: "Ampliflux upgrade no longer takes ampliflux",
      isBoughtName: 'boughtFifthTierUpgrade',
      show: () => true,
      previousUpgradeFromAnotherContainerBoughtName: "boughtFourthTierUpgrade"
    },
    {
      id: 8,
      name: 'Tier upgrade 6',
      cost: 'sixthTierUpgradeCost',
      currency: 'points',
      takesCurrency: (player) => !(player.boughtFirstVermyrosUpgrade || player.boughtFirstNullithUpgrade),
      description: "Automate ampliflux upgrade",
      isBoughtName: 'boughtSixthTierUpgrade',
      show: (player) => player.boughtFifthTierUpgrade || player.everMadeVermyros
    }
  ],
  vermyrosUpgrades: [
    {
      id: 9,
      name: 'Vermyros upgrade 1',
      cost: 'firstVermyrosUpgradeCost',
      currency: 'vermytes',
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description: "Reset and Tier upgrades no longer take points and unlock the Vermyte Upgrade",
      isBoughtName: 'boughtFirstVermyrosUpgrade',
      show: () => true
    },
    {
      id: 10,
      name: 'Vermyros upgrade 2',
      cost: 'secondVermyrosUpgradeCost',
      currency: 'points',
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description: "Keep 1st and 2nd Reset and Tier upgrades, generate 60 tier resets per second and replace the 'Auto Tier' toggle with the 'Auto Tier Up' toggle",
      isBoughtName: 'boughtSecondVermyrosUpgrade',
      show: (player) => player.boughtFirstVermyrosUpgrade || player.everMadeNullith
    },
    {
      id: 11,
      name: 'Vermyros upgrade 3',
      cost: 'thirdVermyrosUpgradeCost',
      currency: 'points',
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description: "Keep 3-6 tier upgrades",
      isBoughtName: 'boughtThirdVermyrosUpgrade',
      show: (player) => player.boughtSecondVermyrosUpgrade || player.everMadeNullith
    },
    {
      id: 12,
      name: 'Vermyros upgrade 4',
      cost: 'fourthVermyrosUpgradeCost',
      currency: 'points',
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description: "Tier no longer resets anything and generate 0.1% of your best vermytes per second",
      isBoughtName: 'boughtFourthVermyrosUpgrade',
      show: (player) => player.boughtThirdVermyrosUpgrade || player.everMadeNullith
    }
  ],
  moreVermyrosUpgrades: [
    {
      id: 13,
      name: 'Vermyros upgrade 5',
      cost: 'fifthVermyrosUpgradeCost',
      currency: 'points',
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description: "Unlock the Amplivault and generate 1% of your best vermytes per second",
      isBoughtName: 'boughtFifthVermyrosUpgrade',
      show: () => true,
      previousUpgradeFromAnotherContainerBoughtName: "boughtFourthVermyrosUpgrade"
    },
    {
      id: 14,
      name: 'Vermyros upgrade 6',
      cost: 'sixthVermyrosUpgradeCost',
      currency: 'points',
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description: "Generate 10% of your best vermytes per second",
      isBoughtName: 'boughtSixthVermyrosUpgrade',
      show: (player) => player.boughtFifthVermyrosUpgrade || player.everMadeNullith
    },
    {
      id: 15,
      name: 'Vermyros upgrade 7',
      cost: 'seventhVermyrosUpgradeCost',
      currency: 'points',
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description: "Generate 100% of your best vermytes per second",
      isBoughtName: 'boughtSeventhVermyrosUpgrade',
      show: (player) => player.boughtSixthVermyrosUpgrade || player.everMadeNullith
    },
    {
      id: 16,
      name: 'Vermyros upgrade 8',
      cost: 'eighthVermyrosUpgradeCost',
      currency: 'points',
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description: "Automatically update best vermytes, remove the 'Auto Vermyros' toggle and unlock energy",
      isBoughtName: 'boughtEighthVermyrosUpgrade',
      show: (player) => player.boughtSeventhVermyrosUpgrade || player.everMadeNullith
    }
  ],
  moreVermyrosUpgrades2: [
    {
      id: 17,
      name: 'Vermyros upgrade 9',
      cost: 'ninthVermyrosUpgradeCost',
      currency: 'points',
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description: "Vermyte upgrade no longer takes vermytes",
      isBoughtName: 'boughtNinthVermyrosUpgrade',
      show: () => true,
      previousUpgradeFromAnotherContainerBoughtName: "boughtEighthVermyrosUpgrade"
    },
    {
      id: 18,
      name: 'Vermyros upgrade 10',
      cost: 'tenthVermyrosUpgradeCost',
      currency: 'points',
      takesCurrency: (player) => !player.boughtFirstNullithUpgrade,
      description: "Automate vermyte upgrade and permanently unlock dark energy",
      isBoughtName: 'boughtTenthVermyrosUpgrade',
      show: (player) => player.boughtNinthVermyrosUpgrade || player.everMadeNullith
    }
  ],
  nullithUpgrades: [
    {
      id: 19,
      name: 'Nullith upgrade 1',
      cost: 'firstNullithUpgradeCost',
      currency: 'points',
      takesCurrency: () => true,
      description: "Reset, Tier, Vermyros upgrades no longer take anything, and Core upgrade also no longer takes cores",
      isBoughtName: 'boughtFirstNullithUpgrade',
      show: () => true
    },
    {
      id: 20,
      name: 'Nullith upgrade 2',
      cost: 'secondNullithUpgradeCost',
      currency: 'points',
      takesCurrency: () => true,
      description: "Keep all Reset and Tier upgrades, keep 1-4 Vermyros upgrades and converting energy into cores no longer resets energy reactors",
      isBoughtName: 'boughtSecondNullithUpgrade',
      show: (player) => player.boughtFirstNullithUpgrade
    },
    {
      id: 21,
      name: 'Nullith upgrade 3',
      cost: 'thirdNullithUpgradeCost',
      currency: 'points',
      takesCurrency: () => true,
      description: "Keep 5-8 Vermyros upgrades, keep amplivault level and generate 0.1% of cores you could gain",
      isBoughtName: 'boughtThirdNullithUpgrade',
      show: (player) => player.boughtSecondNullithUpgrade
    },
    {
      id: 22,
      name: 'Nullith upgrade 4',
      cost: 'fourthNullithUpgradeCost',
      currency: 'points',
      takesCurrency: () => true,
      description: "Keep 9-10 Vermyros upgrades, automatically buy Core upgrade, generate 1% of cores you could gain and unlock offline nullith resets",
      isBoughtName: 'boughtFourthNullithUpgrade',
      show: (player) => player.boughtThirdNullithUpgrade
    }
  ]
} as const;