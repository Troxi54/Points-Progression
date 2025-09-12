import Decimal from "break_eternity.js";
import { formulas } from "@/formulas";
import { usePlayerStore } from "@player/playerStore";
import { MergedPlayer } from "@player/playerTypes";
import { settings } from "@player/settings";

export const cacheUpdates = {
  mallirtEffect({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.mallirtEffect = formulas.getMallirtEffect(player);
  },
  firstDertointUpgradeEffect({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.firstDertointUpgradeEffect =
      formulas.getFirstDertointUpgradeEffect(player);
  },
  dertointEffect({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.dertointEffect = formulas.getDertointEffect(player);
  },
  dertointGain({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.dertointGain = formulas.getDertointGain(player, cachedPlayer);
  },
  nullionEffect({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.nullionEffect = formulas.getNullionEffect(player);
  },
  nullionGain({ cachedPlayer }: MergedPlayer) {
    cachedPlayer.nullionGain = formulas.getNullionGain(cachedPlayer);
  },
  nullionInput({ player, cachedPlayer }: MergedPlayer) {
    let result = new Decimal(0);

    const input = player.nullionInput;
    if (input.includes("%")) {
      let percent = Number(input.slice(0, -1));
      if (!isNaN(percent)) {
        percent = Math.max(Math.min(percent, 100), 0);
        result = player.madeNullithResets.multiply(percent / 100).floor();
      }
    } else {
      const decimal = new Decimal(input);
      if (!decimal.isNan() && decimal.greaterThanOrEqualTo(0)) {
        result = decimal;
      }
    }

    if (result.greaterThan(player.madeNullithResets)) {
      result = player.madeNullithResets;
    }

    cachedPlayer.nullionInputConverted = result;
  },
  nullithEffect({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.nullithResetsEffect =
      formulas.getNullithResetPointEffect(player);
    cachedPlayer.nullithResetsVermyteEffect =
      formulas.getNullithResetVermyteEffect(player);
    cachedPlayer.nullithResetsEnergyEffect =
      formulas.getNullithResetEnergyEffect(player);
  },
  nullithResetGain({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.nullithResetGain = formulas.getNullithResetGain(
      player,
      cachedPlayer
    );
  },
  darkEnergyGain({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.darkEnergyGain = formulas.getDarkEnergyPerSecond(
      player,
      cachedPlayer
    );
  },
  darkEnergyEffect({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.darkEnergyEffect = formulas.getDarkEnergyEffect(player);
  },
  coreEffect({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.coreEffect = formulas.getCoreEffect(player);
  },
  energyReactorGain({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.energyReactorGain = formulas.getEnergyReactorsPerSecond(
      player,
      cachedPlayer
    );
  },
  energyGain({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.energyGain = formulas.getEnergyPerSecond(player, cachedPlayer);
  },
  energyEffect({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.energyEffect = formulas.getEnergyEffect(player);
  },
  core({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.coreGain = formulas.getCoreGain(player);
    cachedPlayer.isCoreUpgradeMaxed =
      player.coreUpgradeLvl.greaterThanOrEqualTo(settings.maxCoreUpgradeLevel);
  },
  coreGeneration({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.coresPerSecond = formulas.getCoresPerSecond(
      player,
      cachedPlayer
    );
  },
  amplivault({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.amplivaultRequirement =
      formulas.getAmplivaultRequirement(player);
    cachedPlayer.amplivaultEffect = formulas.getAmplivaultEffect(player);
  },
  vermyteGain({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.vermytesGain = formulas.getVermyteGain(player, cachedPlayer);
  },
  vermytesBestEffect({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.vermytesBestEffect = formulas.getBestVermytesEffect(player);
  },
  vermyteGeneration({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.vermytesPerSecond = formulas.getVermytesPerSecond(player);
  },
  vermoraGain({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.vermoraGain = formulas.getVermoraGain(player, cachedPlayer);
  },
  vermoraEffect({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.vermoraEffect = formulas.getVermoraEffect(player);
  },
  tierResetGain({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.tierResetGain = formulas.getTierResetGain(
      player,
      cachedPlayer
    );
  },
  tier({ player, cachedPlayer }: MergedPlayer) {
    Object.assign(cachedPlayer, {
      tierRequirement: formulas.getTierRequirement(player),
      tierEffect: formulas.getTierEffect(player),
      tierTimesEffect: formulas.getTierTimesEffect(player)
    });
  },
  pointUpgrade({ player, cachedPlayer }: MergedPlayer) {
    Object.assign(cachedPlayer, {
      upgradeCost: settings.upgradeStartingCost.multiply(
        Decimal.pow(settings.upgradeScaling, player.upgradeLvl)
      ),
      upgradeEffect: settings.upgradeEffectScaling.pow(player.upgradeLvl)
    });
  },
  amplifluxUpgrade({ player, cachedPlayer }: MergedPlayer) {
    Object.assign(cachedPlayer, {
      amplifluxUpgradeCost: settings.amplifluxUpgradeStartingCost.multiply(
        Decimal.pow(
          settings.amplifluxUpgradeCostScaling,
          player.amplifluxUpgradeLvl
        )
      ),
      amplifluxUpgradeEffect: settings.amplifluxUpgradeEffectScaling.pow(
        player.amplifluxUpgradeLvl
      )
    });
  },
  vermyteUpgrade({ player, cachedPlayer }: MergedPlayer) {
    Object.assign(cachedPlayer, {
      vermytesUpgradeCost: settings.vermytesUpgradeStartingCost.multiply(
        Decimal.pow(
          settings.vermytesUpgradeCostScaling,
          player.vermytesUpgradeLvl
        )
      ),
      vermytesUpgradeEffect: settings.vermytesUpgradeEffectScaling.pow(
        player.vermytesUpgradeLvl
      )
    });
  },
  coreUpgrade({ player, cachedPlayer }: MergedPlayer) {
    Object.assign(cachedPlayer, {
      coreUpgradeCost: settings.coreUpgradeStartingCost.multiply(
        Decimal.pow(settings.coreUpgradeCostScaling, player.coreUpgradeLvl)
      ),
      coreUpgradeEffect: settings.coreUpgradeEffectScaling.pow(
        player.coreUpgradeLvl
      )
    });
  },
  dertointUpgrade({ player, cachedPlayer }: MergedPlayer) {
    Object.assign(cachedPlayer, {
      dertointUpgradeCost: settings.dertointUpgradeStartingCost.multiply(
        Decimal.pow(
          settings.dertointUpgradeCostScaling,
          player.dertointUpgradeLvl
        )
      ),
      dertointUpgradeEffect: settings.dertointUpgradeEffectScaling.pow(
        player.dertointUpgradeLvl
      )
    });
  },
  runEffect({ player, cachedPlayer }: MergedPlayer) {
    Object.assign(cachedPlayer, {
      runEffect: formulas.getRunEffect(player),
      bestPointsOfRunEffect: formulas.getBestPointsOfRunEffect(
        player,
        cachedPlayer
      )
    });
  },
  amplifluxGain({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.amplifluxGain = formulas.getAmplifluxGain(
      player,
      cachedPlayer
    );
  },
  amplifluxEffect({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.amplifluxEffect = formulas.getAmplifluxEffect(player);
  },
  pointGain({ player, cachedPlayer }: MergedPlayer) {
    cachedPlayer.pointGain = formulas.getPointsPerSecond(player, cachedPlayer);
  }
};

export function updateAllCache() {
  const { player, cachedPlayer, setCachedPlayer } = usePlayerStore.getState();

  const newCachedPlayer = { ...cachedPlayer };
  for (const update of Object.values(cacheUpdates)) {
    if (typeof update === "function")
      update({ player: player, cachedPlayer: newCachedPlayer });
  }

  setCachedPlayer(newCachedPlayer);
}
