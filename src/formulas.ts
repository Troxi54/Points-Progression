import Decimal from "break_eternity.js";
import { CachedPlayer, Player } from "@player/playerTypes";
import { settings } from "@player/settings";

const TWO_HOURS_IN_MS = 7.2e6;

function calculateGeneration(values: [boolean, number][]) {
  let multiplier = 0;
  for (const v of values) {
    if (!v[0]) continue;
    else {
      multiplier = v[1];
      break;
    }
  }
  return multiplier / 100;
}

function getOutsideSliphMultiplier(player: Player) {
  return +!player.enteredSliph;
}

function getSliphMultiplier(player: Player) {
  return +player.enteredSliph;
}

export const formulas = {
  getPointsPerSecond(player: Player, cachedPlayer: CachedPlayer) {
    const preSoftcap = cachedPlayer.upgradeEffect
      .multiply(cachedPlayer.runEffect)
      .multiply(cachedPlayer.bestPointsOfRunEffect)
      .multiply(cachedPlayer.tierEffect)
      .multiply(cachedPlayer.tierTimesEffect)
      .multiply(cachedPlayer.amplifluxEffect)
      .multiply(cachedPlayer.vermytesUpgradeEffect)
      .multiply(cachedPlayer.energyEffect)
      .multiply(cachedPlayer.nullithResetsEffect);

    let postSoftcap = preSoftcap;
    for (const softcapper of settings.softcappers) {
      if (postSoftcap.lt(softcapper[0])) break;
      postSoftcap = postSoftcap.softcap(softcapper[0], softcapper[1], "pow");
    }

    return postSoftcap.multiply(getOutsideSliphMultiplier(player));
  },
  getRunEffect(player: Player) {
    const bestRun = player.bestRun;
    return bestRun === null
      ? new Decimal(1)
      : Decimal.min(
          Decimal.plus(1, Math.log10(TWO_HOURS_IN_MS) / Math.log10(bestRun)),
          2
        ).times(
          bestRun <= TWO_HOURS_IN_MS
            ? Decimal.pow(5, Math.log10(TWO_HOURS_IN_MS) - Math.log10(bestRun))
            : 1
        );
  },
  getBestPointsOfRunEffect(player: Player, cachedPlayer: CachedPlayer) {
    return Decimal.plus(
      1,
      Decimal.max(player.bestPointsOfRun, 1e6).dividedBy(1e6).log10()
    )
      .pow(1.3)
      .pow(cachedPlayer.coreUpgradeEffect);
  },
  getTierRequirement(player: Player) {
    return settings.firstTierAt.multiply(settings.tierScaling.pow(player.tier));
  },
  getTierResetGain(player: Player, cachedPlayer: CachedPlayer) {
    return new Decimal(1)
      .multiply(
        player.boughtSecondDertointUpgrade ? cachedPlayer.nullionEffect : 1
      )
      .multiply(getOutsideSliphMultiplier(player));
  },
  getTierEffect(player: Player) {
    return Decimal.pow(3, player.tier);
  },
  getTierTimesEffect(player: Player) {
    return player.madeTierTimes.softcap(1e6, 0.25, "pow").plus(1).pow(1.2);
  },
  getAmplifluxGain(player: Player, cachedPlayer: CachedPlayer) {
    if (!player.boughtFourthTierUpgrade) return new Decimal(0);
    return cachedPlayer.amplifluxUpgradeEffect
      .multiply(cachedPlayer.vermoraEffect)
      .multiply(cachedPlayer.amplivaultEffect)
      .multiply(getOutsideSliphMultiplier(player));
  },
  getAmplifluxEffect(player: Player) {
    return Decimal.pow(2, player.ampliflux.max(0).plus(1).log10());
  },
  getVermyteGain(player: Player, cachedPlayer: CachedPlayer) {
    const enoughPoints = player.points.greaterThanOrEqualTo(
      settings.vermyrosGoal
    );

    if (!enoughPoints) return new Decimal(0);

    if (!player.everMadeVermyros) return new Decimal(1);

    return Decimal.pow(
      2,
      player.points.div(settings.vermyrosGoal).log("e6").max(0)
    ).multiply(cachedPlayer.nullithResetsVermyteEffect);
  },
  getVermytesPerSecond(player: Player) {
    const multiplier = calculateGeneration([
      [player.boughtSeventhVermyrosUpgrade, 100],
      [player.boughtSixthVermyrosUpgrade, 10],
      [player.boughtFifthVermyrosUpgrade, 1],
      [player.boughtFourthVermyrosUpgrade, 0.1]
    ]);

    return player.bestVermytes
      .multiply(multiplier)
      .multiply(getOutsideSliphMultiplier(player));
  },
  getBestVermytesEffect(player: Player) {
    return player.bestVermytes.pow(3);
  },
  getVermoraGain(player: Player, cachedPlayer: CachedPlayer) {
    return cachedPlayer.vermytesBestEffect.multiply(
      getOutsideSliphMultiplier(player)
    );
  },
  getVermoraEffect(player: Player) {
    return Decimal.pow(2, player.vermora.max(0).plus(1).log10());
  },
  getAmplivaultRequirement(player: Player) {
    return settings.amplivaultRequirementStartsAt.multiply(
      Decimal.pow(1000, player.amplivaultLevel)
    );
  },
  getAmplivaultEffect(player: Player) {
    return Decimal.pow(
      player.amplivaultBroken ? 1.5 : 2,
      player.amplivaultLevel
    );
  },
  getAmplivaultBulk(player: Player, cachedPlayer: CachedPlayer) {
    return player.points
      .dividedBy(cachedPlayer.amplivaultRequirement)
      .log(1000)
      .floor()
      .plus(1);
  },
  getEnergyReactorsPerSecond(player: Player, cachedPlayer: CachedPlayer) {
    if (!player.boughtEighthVermyrosUpgrade) return new Decimal(0);
    return new Decimal(0.1)
      .multiply(cachedPlayer.coreEffect)
      .multiply(cachedPlayer.darkEnergyEffect)
      .multiply(getOutsideSliphMultiplier(player));
  },
  getEnergyPerSecond(player: Player, cachedPlayer: CachedPlayer) {
    if (!player.boughtEighthVermyrosUpgrade) return new Decimal(0);
    return player.energyReactors
      .multiply(cachedPlayer.nullithResetsEnergyEffect)
      .multiply(getOutsideSliphMultiplier(player));
  },
  getEnergyEffect(player: Player) {
    return Decimal.pow(1.75, player.energy.max(0).plus(1).log10());
  },
  getCoreGain(player: Player) {
    return player.energy.greaterThanOrEqualTo(settings.coresAt)
      ? player.energy.dividedBy(settings.coresAt)
      : new Decimal(0);
  },
  getCoresPerSecond(player: Player, cachedPlayer: CachedPlayer) {
    const multiplier = calculateGeneration([
      [player.boughtSixthNullithUpgrade, 100],
      [player.boughtFifthNullithUpgrade, 10],
      [player.boughtFourthNullithUpgrade, 1],
      [player.boughtThirdNullithUpgrade, 0.1]
    ]);

    return cachedPlayer.coreGain
      .multiply(multiplier)
      .multiply(getOutsideSliphMultiplier(player));
  },
  getCoreEffect(player: Player) {
    return Decimal.pow(4, player.cores.max(0).plus(1).log10());
  },
  getDarkEnergyPerSecond(player: Player, cachedPlayer: CachedPlayer) {
    if (!player.boughtTenthVermyrosUpgrade && !player.everMadeNullith)
      return new Decimal(0);
    return Decimal.pow(
      2,
      player.points
        .dividedBy(settings.tenthVermyrosUpgradeCost)
        .max(0)
        .plus(1)
        .log(1e10)
    )
      .pow(cachedPlayer.dertointEffect)
      .max(1)
      .multiply(getOutsideSliphMultiplier(player));
  },
  getDarkEnergyEffect(player: Player) {
    const preSquared = Decimal.pow(
      1.75,
      player.darkEnergy.max(0).plus(1).log10()
    );

    if (!player.boughtThirdMallirtUpgrade) return preSquared;

    const preSquared2 = preSquared.pow(2);

    if (!player.boughtFourthMallirtUpgrade) return preSquared2;

    return preSquared2.pow(2);
  },
  getNullithResetGain(player: Player, cachedPlayer: CachedPlayer) {
    return cachedPlayer.nullionEffect.multiply(
      getOutsideSliphMultiplier(player)
    );
  },
  getNullithResetPointEffect(player: Player) {
    return player.madeNullithResets.gt(0)
      ? Decimal.multiply(125, player.madeNullithResets.pow(3)).round()
      : new Decimal(1);
  },
  getNullithResetVermyteEffect(player: Player) {
    return player.madeNullithResets.gt(0)
      ? player.madeNullithResets.plus(1).pow(1.2)
      : new Decimal(1);
  },
  getNullithResetEnergyEffect(player: Player) {
    return player.madeNullithResets.gt(0)
      ? player.madeNullithResets.plus(1).pow(0.75)
      : new Decimal(1);
  },
  getNullionGain(cachedPlayer: CachedPlayer) {
    return cachedPlayer.nullionInputConverted;
  },
  getNullionEffect(player: Player) {
    const GROWTH_POINT = new Decimal(1e5);
    const n = player.nullions;

    return Decimal.plus(
      1.1,
      n.dividedBy(GROWTH_POINT).max(0).plus(1).log10().dividedBy(8)
    )
      .min(3)
      .pow(n.max(0).plus(1).log10());
  },
  getDertointGain(player: Player, cachedPlayer: CachedPlayer) {
    return new Decimal(0.01)
      .multiply(cachedPlayer.dertointUpgradeEffect)
      .multiply(
        player.boughtFirstDertointUpgrade
          ? cachedPlayer.firstDertointUpgradeEffect
          : 1
      )
      .multiply(
        player.boughtThirdDertointUpgrade ? cachedPlayer.nullionEffect : 1
      )
      .multiply(cachedPlayer.mallirtEffect)
      .multiply(getSliphMultiplier(player));
  },
  getDertointEffect(player: Player) {
    return Decimal.plus(
      1,
      player.dertoints.multiply(100).max(0).plus(1).log10().dividedBy(2.5)
    );
  },
  getFirstDertointUpgradeEffect(player: Player) {
    return Decimal.pow(
      1.15,
      player.points.dividedBy("e1000").max(0).plus(1).log("e5")
    ).softcap(1e12, 0.7, "pow");
  },
  getMallirtEffect(player: Player) {
    return Decimal.pow(
      3,
      player.mallirtTotalDertoints.dividedBy(133456).max(0).plus(1).log10()
    );
  }
};
