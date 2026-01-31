import { DynamicImportFeatureContainer } from "../hooks/createDynamicImport";
import { isDimension } from "@/game/dimensions/utils/compare";
import { AppState } from "./types";

const featureDependencies = {
  AutoTierButton: [
    () => import("@/ui/components/toggles/AutoTierButton"),
    (state) => state.resetLayer_reset_everPerformed
  ],
  TierUpgrades: [
    () => import("@/ui/components/upgrades/TierUpgrades"),
    (state) => state.resetLayer_reset_everPerformed
  ],
  Ampliflux: [
    () => import("@/ui/components/states/Ampliflux"),
    (state) => state.tier_3 || state.resetLayer_vermyros_everPerformed
  ],
  AmplifluxUpgrade: [
    () => import("@/ui/components/repeatableUpgrades/AmplifluxUpgrade"),
    (state) => state.tier_3 || state.resetLayer_vermyros_everPerformed
  ],
  TierUpgrades2: [
    () => import("@/ui/components/upgrades/TierUpgrades2"),
    (state) => state.tier_3 || state.resetLayer_vermyros_everPerformed
  ],
  VermyrosBar: [
    () => import("@/ui/components/progressBars/VermyrosBar"),
    (state) => state.tier_3 || state.resetLayer_vermyros_everPerformed
  ],
  AutoVermyrosButton: [
    () => import("@/ui/components/toggles/AutoVermyrosButton"),
    (state) => state.tier_4 || state.resetLayer_vermyros_everPerformed
  ],
  Vermora: [
    () => import("@/ui/components/states/Vermora"),
    (state) => state.tier_4 || state.resetLayer_vermyros_everPerformed
  ],
  Vermytes: [
    () => import("@/ui/components/states/Vermytes"),
    (state) => state.tier_4 || state.resetLayer_vermyros_everPerformed
  ],
  VermyrosUpgrades: [
    () => import("@/ui/components/upgrades/VermyrosUpgrades"),
    (state) => state.tier_4 || state.resetLayer_vermyros_everPerformed
  ],
  VermyteUpgrade: [
    () => import("@/ui/components/repeatableUpgrades/VermyteUpgrade"),
    (state) => state.resetLayer_vermyros_everPerformed
  ],
  VermyrosUpgrades2: [
    () => import("@/ui/components/upgrades/VermyrosUpgrades2"),
    (state) => state.vermyros_3 || state.resetLayer_nullith_everPerformed
  ],
  Amplivault: [
    () => import("@/ui/components/buttons/Amplivault"),
    (state) => state.vermyros_4 || state.resetLayer_nullith_everPerformed
  ],
  Softcapper: [
    () => import("@/ui/components/states/Softcapper"),
    (state) => state.resetLayer_vermyros_everPerformed
  ],
  EnergyReactors: [
    () => import("@/ui/components/states/EnergyReactors"),
    (state) => state.vermyros_7 || state.resetLayer_nullith_everPerformed
  ],
  Energy: [
    () => import("@/ui/components/states/Energy"),
    (state) => state.vermyros_7 || state.resetLayer_nullith_everPerformed
  ],
  CoreButton: [
    () => import("@/ui/components/buttons/CoreButton"),
    (state) => state.vermyros_7 || state.resetLayer_nullith_everPerformed
  ],
  Cores: [
    () => import("@/ui/components/states/Cores"),
    (state) => state.vermyros_8 || state.resetLayer_nullith_everPerformed
  ],
  CoreUpgrade: [
    () => import("@/ui/components/repeatableUpgrades/CoreUpgrade"),
    (state) => state.vermyros_8 || state.resetLayer_nullith_everPerformed
  ],
  VermyrosUpgrades3: [
    () => import("@/ui/components/upgrades/VermyrosUpgrades3"),
    (state) => state.vermyros_7 || state.resetLayer_nullith_everPerformed
  ],
  DarkEnergy: [
    () => import("@/ui/components/states/DarkEnergy"),
    (state) => state.vermyros_9 || state.resetLayer_nullith_everPerformed
  ],
  NullithBar: [
    () => import("@/ui/components/progressBars/NullithBar"),
    (state) => state.vermyros_9 || state.resetLayer_nullith_everPerformed
  ],
  AutoNullithButton: [
    () => import("@/ui/components/toggles/AutoNullithButton"),
    (state) => state.vermyros_10 || state.resetLayer_nullith_everPerformed
  ],
  NullithUpgrades: [
    () => import("@/ui/components/upgrades/NullithUpgrades"),
    (state) => state.vermyros_10 || state.resetLayer_nullith_everPerformed
  ],
  Nullifice: [
    () => import("@/ui/components/buttons/Nullifice"),
    (state) => state.nullith_3
  ],
  BreakAmplivault: [
    () => import("@/ui/components/buttons/BreakAmplivault"),
    (state) => state.nullith_3
  ],
  NullithUpgrades2: [
    () => import("@/ui/components/upgrades/NullithUpgrades2"),
    (state) => state.nullith_3
  ],
  Sliph: [
    () => import("@/ui/components/buttons/Sliph"),
    (state) => state.nullith_4 || isDimension(state.dimensionId, "sliph")
  ],
  SliphDimension: [
    () => import("./dimensions/sliph/index"),
    (state) => state.nullith_5 || isDimension(state.dimensionId, "sliph")
  ],
  LevelBar: [
    () => import("@/ui/components/progressBars/LevelBar"),
    (state) => state.resetLayer_mallirt_everPerformed
  ],
  AutoLevelButton: [
    () => import("@/ui/components/toggles/AutoLevelButton"),
    (state) => state.mallirt_4 || state.resetLayer_level_everPerformed
  ],
  XPState: [
    () => import("@/ui/components/states/XP"),
    (state) => state.mallirt_4 || state.resetLayer_level_everPerformed
  ],
  LevelUpgrades: [
    () => import("@/ui/components/upgrades/LevelUpgrades"),
    (state) => state.mallirt_4 || state.resetLayer_level_everPerformed
  ],
  Nuxar: [
    () => import("@/ui/components/buttons/Nuxar"),
    (state) => state.nullith_6
  ],
  NullithUpgrades3: [
    () => import("@/ui/components/upgrades/NullithUpgrades3"),
    (state) => state.nullith_5
  ],
  Nexus: [
    () => import("@/ui/components/buttons/Nexus"),
    (state) => state.nullith_7
  ],
  NullithUpgrades4: [
    () => import("@/ui/components/upgrades/NullithUpgrades4"),
    (state) => state.nullith_7
  ],
  Amplivoid: [
    () => import("@/ui/components/states/Amplivoid"),
    (state) => state.level_3
  ],
  AmplivoidUpgrade: [
    () => import("@/ui/components/repeatableUpgrades/AmplivoidUpgrade"),
    (state) => state.level_3
  ],
  LevelUpgrades2: [
    () => import("@/ui/components/upgrades/LevelUpgrades2"),
    (state) => state.level_3
  ]
} as const satisfies DynamicImportFeatureContainer<AppState>;

export default featureDependencies;
