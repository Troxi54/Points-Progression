import { usePlayer } from "@player/playerStore";
import Decimal from "break_eternity.js";
import {
  createDynamicImport,
  DynamicImportFeatureContainer
} from "@/DynamicImport";

import Points from "@components/Points";
import PointUpgrade from "@components/PointUpgrade";
import ProgressionBar from "@components/ProgressionBar";
import ResetUpgrades from "@components/ResetUpgrades";
import AutoresettingButton from "@components/AutoresettingButton";
import TimeSpent from "@components/TimeSpent";
import TierBar from "@components/TierBar";
import Menu from "@components/Menu";
import LoadingMenu from "@components/LoadingMenu";

interface State {
  everMadeRun: boolean;
  boughtThirdTierUpgrade: boolean;
  boughtFourthTierUpgrade: boolean;
  everMadeTier: boolean;
  everMadeVermyros: boolean;
  everMadeNullith: boolean;
  boughtFirstVermyrosUpgrade: boolean;
  boughtThirdVermyrosUpgrade: boolean;
  boughtFourthVermyrosUpgrade: boolean;
  boughtFifthVermyrosUpgrade: boolean;
  boughtSeventhVermyrosUpgrade: boolean;
  boughtEighthVermyrosUpgrade: boolean;
  boughtNinthVermyrosUpgrade: boolean;
  boughtTenthVermyrosUpgrade: boolean;
  bestSoftcapperLevel: Decimal;
  everMadeCoreReset: boolean;
  boughtThirdNullithUpgrade: boolean;
  boughtFourthNullithUpgrade: boolean;
  boughtFifthNullithUpgrade: boolean;
  enteredSliph: boolean;
}

const featureDependencies = {
  AutotierButton: [
    () => import("@components/AutotierButton"),
    (state) => state.everMadeRun
  ],
  TierUpgrades: [
    () => import("@components/TierUpgrades"),
    (state) => state.everMadeRun
  ],
  Ampliflux: [
    () => import("@components/Ampliflux"),
    (state) => state.boughtThirdTierUpgrade || state.everMadeVermyros
  ],
  AmplifluxUpgrade: [
    () => import("@components/AmplifluxUpgrade"),
    (state) => state.boughtThirdTierUpgrade || state.everMadeVermyros
  ],
  MoreTierUpgrades: [
    () => import("@components/MoreTierUpgrades"),
    (state) => state.boughtThirdTierUpgrade || state.everMadeVermyros
  ],
  VermyrosBar: [
    () => import("@components/VermyrosBar"),
    (state) => state.boughtThirdTierUpgrade || state.everMadeVermyros
  ],
  AutoVermyrosButton: [
    () => import("@components/AutoVermyrosButton"),
    (state) => state.boughtFourthTierUpgrade || state.everMadeVermyros
  ],
  Vermora: [
    () => import("@components/Vermora"),
    (state) => state.boughtFourthTierUpgrade || state.everMadeVermyros
  ],
  Vermytes: [
    () => import("@components/Vermytes"),
    (state) => state.boughtFourthTierUpgrade || state.everMadeVermyros
  ],
  VermyrosUpgrades: [
    () => import("@components/VermyrosUpgrades"),
    (state) => state.boughtFourthTierUpgrade || state.everMadeVermyros
  ],
  VermyteUpgrade: [
    () => import("@components/VermyteUpgrade"),
    (state) => state.everMadeVermyros
  ],
  MoreVermyrosUpgrades: [
    () => import("@components/MoreVermyrosUpgrades"),
    (state) => state.boughtThirdVermyrosUpgrade || state.everMadeNullith
  ],
  Amplivault: [
    () => import("@components/Amplivault"),
    (state) => state.boughtFourthVermyrosUpgrade || state.everMadeNullith
  ],
  Softcapper: [
    () => import("@components/Softcapper"),
    (state) => state.everMadeVermyros
  ],
  EnergyReactors: [
    () => import("@components/EnergyReactors"),
    (state) => state.boughtSeventhVermyrosUpgrade || state.everMadeNullith
  ],
  Energy: [
    () => import("@components/Energy"),
    (state) => state.boughtSeventhVermyrosUpgrade || state.everMadeNullith
  ],
  CoreButton: [
    () => import("@components/CoreButton"),
    (state) => state.boughtSeventhVermyrosUpgrade || state.everMadeNullith
  ],
  Cores: [
    () => import("@components/Cores"),
    (state) => state.boughtEighthVermyrosUpgrade || state.everMadeNullith
  ],
  CoreUpgrade: [
    () => import("@components/CoreUpgrade"),
    (state) => state.boughtEighthVermyrosUpgrade || state.everMadeNullith
  ],
  MoreVermyrosUpgrades2: [
    () => import("@components/MoreVermyrosUpgrades2"),
    (state) => state.boughtSeventhVermyrosUpgrade || state.everMadeNullith
  ],
  DarkEnergy: [
    () => import("@components/DarkEnergy"),
    (state) => state.boughtNinthVermyrosUpgrade || state.everMadeNullith
  ],
  NullithBar: [
    () => import("@components/NullithBar"),
    (state) => state.boughtNinthVermyrosUpgrade || state.everMadeNullith
  ],
  AutoNullithButton: [
    () => import("@components/AutoNullithButton"),
    (state) => state.boughtTenthVermyrosUpgrade || state.everMadeNullith
  ],
  NullithUpgrades: [
    () => import("@components/NullithUpgrades"),
    (state) => state.boughtTenthVermyrosUpgrade || state.everMadeNullith
  ],
  Nullifice: [
    () => import("@components/Nullifice"),
    (state) => state.boughtThirdNullithUpgrade
  ],
  BreakAmplivault: [
    () => import("@components/BreakAmplivault"),
    (state) => state.boughtThirdNullithUpgrade
  ],
  MoreNullithUpgrades: [
    () => import("@components/MoreNullithUpgrades"),
    (state) => state.boughtThirdNullithUpgrade
  ],
  Sliph: [
    () => import("@components/Sliph"),
    (state) => state.boughtFourthNullithUpgrade || state.enteredSliph
  ],
  SliphDimension: [
    () => import("@components/SliphDimension"),
    (state) => state.boughtFifthNullithUpgrade || state.enteredSliph
  ]
} as const satisfies DynamicImportFeatureContainer<State>;

const dynamic = createDynamicImport<State>(featureDependencies);

function App() {
  const state: State = usePlayer((state) => ({
    everMadeRun: state.player.everMadeRun,
    boughtThirdTierUpgrade: state.player.boughtThirdTierUpgrade,
    boughtFourthTierUpgrade: state.player.boughtFourthTierUpgrade,
    everMadeTier: state.player.everMadeTier,
    everMadeVermyros: state.player.everMadeVermyros,
    everMadeNullith: state.player.everMadeNullith,
    boughtFirstVermyrosUpgrade: state.player.boughtFirstVermyrosUpgrade,
    boughtThirdVermyrosUpgrade: state.player.boughtThirdVermyrosUpgrade,
    boughtFourthVermyrosUpgrade: state.player.boughtFourthVermyrosUpgrade,
    boughtFifthVermyrosUpgrade: state.player.boughtFifthVermyrosUpgrade,
    boughtSeventhVermyrosUpgrade: state.player.boughtSeventhVermyrosUpgrade,
    boughtEighthVermyrosUpgrade: state.player.boughtEighthVermyrosUpgrade,
    boughtNinthVermyrosUpgrade: state.player.boughtNinthVermyrosUpgrade,
    boughtTenthVermyrosUpgrade: state.player.boughtTenthVermyrosUpgrade,
    bestSoftcapperLevel: state.player.bestSoftcapperLevel,
    everMadeCoreReset: state.player.everMadeCoreReset,
    boughtThirdNullithUpgrade: state.player.boughtThirdNullithUpgrade,
    boughtFourthNullithUpgrade: state.player.boughtFourthNullithUpgrade,
    boughtFifthNullithUpgrade: state.player.boughtFifthNullithUpgrade,
    enteredSliph: state.player.enteredSliph
  }));

  const { getComponent, firstComponentsLoaded } = dynamic(state);

  return (
    <LoadingMenu
      conditionForMainContent={firstComponentsLoaded}
      mainContent={
        <>
          <Menu />
          <div className="size-full flex-col gap-20 overflow-y-auto pt-[calc(8vmin+1.5rem)] pb-12">
            {!state.enteredSliph && (
              <>
                <div className="layer">
                  <TimeSpent />
                  <Points />
                  <PointUpgrade />
                  <ProgressionBar />
                  {state.everMadeRun && (
                    <>
                      {!state.boughtFourthTierUpgrade && (
                        <AutoresettingButton />
                      )}
                      <ResetUpgrades />
                    </>
                  )}
                </div>
                {state.everMadeRun && (
                  <div className="layer">
                    <TierBar />
                    {state.everMadeTier && (
                      <>
                        {getComponent("AutotierButton")}
                        {getComponent("TierUpgrades")}
                        {(state.boughtFourthTierUpgrade ||
                          state.everMadeVermyros) && (
                          <>
                            {getComponent("Ampliflux")}
                            {getComponent("AmplifluxUpgrade")}
                            {getComponent("MoreTierUpgrades")}
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}
                {(state.boughtFourthTierUpgrade || state.everMadeVermyros) && (
                  <div className="layer">
                    {getComponent("VermyrosBar")}
                    {state.everMadeVermyros && (
                      <>
                        {!state.boughtEighthVermyrosUpgrade &&
                          getComponent("AutoVermyrosButton")}
                        {getComponent("Vermora")}
                        {getComponent("Vermytes")}
                        {getComponent("VermyrosUpgrades")}
                        {(state.boughtFirstVermyrosUpgrade ||
                          state.everMadeNullith) &&
                          getComponent("VermyteUpgrade")}
                        {(state.boughtFourthVermyrosUpgrade ||
                          state.everMadeNullith) &&
                          getComponent("MoreVermyrosUpgrades")}
                        {(state.boughtFifthVermyrosUpgrade ||
                          state.everMadeNullith) &&
                          getComponent("Amplivault")}
                      </>
                    )}
                    {state.bestSoftcapperLevel.greaterThanOrEqualTo(1) &&
                      getComponent("Softcapper")}
                    {(state.boughtEighthVermyrosUpgrade ||
                      state.everMadeNullith) && (
                      <>
                        {getComponent("EnergyReactors")}
                        {getComponent("Energy")}
                        {getComponent("CoreButton")}
                        {state.everMadeCoreReset && (
                          <>
                            {getComponent("Cores")}
                            {getComponent("CoreUpgrade")}
                          </>
                        )}
                        {getComponent("MoreVermyrosUpgrades2")}
                      </>
                    )}
                    {(state.boughtTenthVermyrosUpgrade ||
                      state.everMadeNullith) && (
                      <>{getComponent("DarkEnergy")}</>
                    )}
                  </div>
                )}
              </>
            )}
            {state.enteredSliph && getComponent("SliphDimension")}
            {(state.boughtTenthVermyrosUpgrade || state.everMadeNullith) && (
              <div className="layer">
                {!state.enteredSliph && (
                  <>
                    {getComponent("NullithBar")}
                    {state.everMadeNullith && (
                      <>
                        {getComponent("AutoNullithButton")}
                        {getComponent("NullithUpgrades")}
                        {state.boughtFourthNullithUpgrade && (
                          <>
                            {getComponent("Nullifice")}
                            {getComponent("BreakAmplivault")}
                            {getComponent("MoreNullithUpgrades")}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
                {((state.boughtFifthNullithUpgrade && state.everMadeNullith) ||
                  state.enteredSliph) &&
                  getComponent("Sliph")}
              </div>
            )}
          </div>
        </>
      }
    />
  );
}

export default App;
