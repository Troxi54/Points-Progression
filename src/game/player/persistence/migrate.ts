import formulas from "@game/formulas/data";
import { getPlayerState } from "@/game/player/store/store";
import { getDefaultPlayer } from "@/game/player/default";
import { MergedPlayer } from "@/game/player/merged/types";
import { mergePlayer } from "@/game/player/merged/utils";
import { PartialPlayer, Player } from "@/game/player/types";
import { applyRepeatableUpgradeLevel } from "@/game/repeatableUpgrades/utils/apply";
import { applyResetLayerPlayerData } from "@/game/resetLayers/utils/apply";
import { applyUpgradeById } from "@/game/upgrades/utils/apply";
import createDecimal from "@/core/utils/decimal";
import { mergeObjects, objectEntries } from "@/core/utils/object";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Data = Record<
  string,
  (player: MergedPlayer, value: any) => PartialPlayer | undefined
>;
/* eslint-enable @typescript-eslint/no-explicit-any */

function parseFiniteTimestamp(value: unknown): number | null {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

function parseFiniteNonNegativeNumber(value: unknown): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return parsed;
}

const conversionData: Data = {
  upgradeLvl: ({ player }, value) =>
    applyRepeatableUpgradeLevel(player, "point", createDecimal(value)),
  startedRun: ({ player }, value) =>
    applyResetLayerPlayerData(player, "reset", {
      startedDate: parseFiniteTimestamp(value)
    }),
  bestRun: (mergedPlayer, value) => ({
    bestRun: formulas.firstResetLayerRun(mergedPlayer, value)
  }),
  everMadeRun: ({ player }, value) =>
    applyResetLayerPlayerData(player, "reset", { everPerformed: value }),
  autoresettingEnabled: ({ player }, value) =>
    applyResetLayerPlayerData(player, "reset", { autoEnabled: value }),
  approximateResetsPerSecond: ({ player }, value) =>
    applyResetLayerPlayerData(player, "reset", {
      resetsPerSecond: parseFiniteNonNegativeNumber(value)
    }),
  boughtFirstResetUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "reset_1", value),
  boughtSecondResetUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "reset_2", value),
  everMadeTier: ({ player }, value) =>
    applyResetLayerPlayerData(player, "tier", { everPerformed: value }),
  tierStartedDate: ({ player }, value) =>
    applyResetLayerPlayerData(player, "tier", {
      startedDate: parseFiniteTimestamp(value)
    }),
  autoTierEnabled: ({ player }, value) =>
    applyResetLayerPlayerData(player, "tier", { autoEnabled: value }),
  approximateTiersPerSecond: ({ player }, value) =>
    applyResetLayerPlayerData(player, "tier", {
      resetsPerSecond: parseFiniteNonNegativeNumber(value)
    }),
  boughtFirstTierUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "tier_1", value),
  boughtSecondTierUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "tier_2", value),
  boughtThirdTierUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "tier_3", value),
  boughtFourthTierUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "tier_4", value),
  amplifluxUpgradeLvl: ({ player }, value) =>
    applyRepeatableUpgradeLevel(player, "ampliflux", createDecimal(value)),
  boughtFifthTierUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "tier_5", value),
  boughtSixthTierUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "tier_6", value),
  everMadeVermyros: ({ player }, value) =>
    applyResetLayerPlayerData(player, "vermyros", { everPerformed: value }),
  vermyrosStartedDate: ({ player }, value) =>
    applyResetLayerPlayerData(player, "vermyros", {
      startedDate: parseFiniteTimestamp(value)
    }),
  autoVermyrosEnabled: ({ player }, value) =>
    applyResetLayerPlayerData(player, "vermyros", { autoEnabled: value }),
  approximateVermyrosResetsPerSecond: ({ player }, value) =>
    applyResetLayerPlayerData(player, "vermyros", {
      resetsPerSecond: parseFiniteNonNegativeNumber(value)
    }),
  vermytesUpgradeLvl: ({ player }, value) =>
    applyRepeatableUpgradeLevel(player, "vermyte", createDecimal(value)),
  boughtFirstVermyrosUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "vermyros_1", value),
  boughtSecondVermyrosUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "vermyros_2", value),
  boughtThirdVermyrosUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "vermyros_3", value),
  boughtFourthVermyrosUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "vermyros_4", value),
  boughtFifthVermyrosUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "vermyros_5", value),
  boughtSixthVermyrosUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "vermyros_6", value),
  boughtSeventhVermyrosUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "vermyros_7", value),
  boughtEighthVermyrosUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "vermyros_8", value),
  coreUpgradeLvl: ({ player }, value) =>
    applyRepeatableUpgradeLevel(player, "core", createDecimal(value)),
  boughtNinthVermyrosUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "vermyros_9", value),
  boughtTenthVermyrosUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "vermyros_10", value),
  everMadeNullith: ({ player }, value) =>
    applyResetLayerPlayerData(player, "nullith", { everPerformed: value }),
  nullithStartedDate: ({ player }, value) =>
    applyResetLayerPlayerData(player, "nullith", {
      startedDate: parseFiniteTimestamp(value)
    }),
  autoNullithEnabled: ({ player }, value) =>
    applyResetLayerPlayerData(player, "nullith", { autoEnabled: value }),
  approximateNullithResetsPerSecond: ({ player }, value) =>
    applyResetLayerPlayerData(player, "nullith", {
      resetsPerSecond: parseFiniteNonNegativeNumber(value)
    }),
  boughtFirstNullithUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "nullith_1", value),
  boughtSecondNullithUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "nullith_2", value),
  boughtThirdNullithUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "nullith_3", value),
  boughtFourthNullithUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "nullith_4", value),
  boughtFifthNullithUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "nullith_5", value),
  boughtSixthNullithUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "nullith_6", value),
  enteredSliph: (_, value) => ({ dimensionId: value ? "sliph" : "normal" }),
  dertointUpgradeLvl: ({ player }, value) =>
    applyRepeatableUpgradeLevel(player, "dertoint", createDecimal(value)),
  boughtFirstDertointUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "dertoint_1", value),
  boughtSecondDertointUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "dertoint_2", value),
  boughtThirdDertointUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "dertoint_3", value),
  boughtFourthDertointUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "dertoint_4", value),
  boughtFirstMallirtUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "mallirt_1", value),
  boughtSecondMallirtUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "mallirt_2", value),
  boughtThirdMallirtUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "mallirt_3", value),
  boughtFourthMallirtUpgrade: ({ player }, value) =>
    applyUpgradeById(player, "mallirt_4", value),
  everMadeMallirt: ({ player }, value) =>
    applyResetLayerPlayerData(player, "mallirt", { everPerformed: value }),
  mallirtStartedDate: ({ player }, value) =>
    applyResetLayerPlayerData(player, "mallirt", {
      startedDate: parseFiniteTimestamp(value)
    }),
  autoMallirtEnabled: ({ player }, value) =>
    applyResetLayerPlayerData(player, "mallirt", { autoEnabled: value }),
  approximateMallirtResetsPerSecond: ({ player }, value) =>
    applyResetLayerPlayerData(player, "mallirt", {
      resetsPerSecond: parseFiniteNonNegativeNumber(value)
    })
};

export function migratePlayer<T extends Player>(player: T): Player {
  let result = getDefaultPlayer();

  const { cachedPlayer } = getPlayerState();
  let mergedPlayer = mergePlayer(result, cachedPlayer);

  for (const [key, value] of objectEntries(player)) {
    const migrate = conversionData[key as string];

    if (!migrate || value === undefined) {
      result[key as keyof Player] = value as never;
      continue;
    }

    const migrated = migrate(mergedPlayer, value);

    if (!migrated) continue;

    result = mergeObjects(result, migrated);
    mergedPlayer = mergePlayer(result, cachedPlayer);
  }

  return result;
}
