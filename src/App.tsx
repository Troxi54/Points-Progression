import Points from "./components/Points";
import ProgressionBar from "./components/ProgressionBar";
import ResetUpgrades from "./components/ResetUpgrades";
import AutoresettingButton from "./components/AutoresettingButton";
import TimeSpent from "./components/TimeSpent";
import TierBar from "./components/TierBar";
import AutotierButton from "./components/AutotierButton";
import TierUpgrades from "./components/TierUpgrades";
import Ampliflux from "./components/Ampliflux";
import AmplifluxUpgrade from "./components/AmplifluxUpgrade";
import MoreTierUpgrades from "./components/MoreTierUpgrades";
import VermyrosBar from "./components/VermyrosBar";
import Vermora from "./components/Vermora";
import Vermytes from "./components/Vermytes";
import VermyrosUpgrades from "./components/VermyrosUpgrades";
import VermyteUpgrade from "./components/VermyteUpgrade";
import AutoVermyrosButton from "./components/AutoVermyrosButton";
import Menu from "./components/Menu";
import MoreVermyrosUpgrades from "./components/MoreVermyrosUpgrades";
import Amplivault from "./components/Amplivault";
import Softcapper from "./components/Softcapper";
import EnergyReactors from "./components/EnergyReactors";
import Energy from "./components/Energy";
import CoreButton from "./components/CoreButton";
import Cores from "./components/Cores";
import CoreUpgrade from "./components/CoreUpgrade";
import MoreVermyrosUpgrades2 from "./components/MoreVermyrosUpgrades2";
import DarkEnergy from "./components/DarkEnergy";
import NullithBar from "./components/NullithBar";
import AutoNullithButton from "./components/AutoNullithButton";
import NullithUpgrades from "./components/NullithUpgrades";
import { usePlayer } from "./player/playerStore";
import PointUpgrade from "./components/PointUpgrade";
import BreakAmplivault from "./components/BreakAmplivault";
import Nullifice from "./components/Nullifice";
import MoreNullithUpgrades from "./components/MoreNullithUpgrades";
import Sliph from "./components/Sliph";
import SliphDimension from "./components/SliphDimension";

function App() {
  const state = usePlayer((state) => ({
    everMadeRun: state.player.everMadeRun,
    boughtFourthTierUpgrade: state.player.boughtFourthTierUpgrade,
    everMadeTier: state.player.everMadeTier,
    everMadeVermyros: state.player.everMadeVermyros,
    everMadeNullith: state.player.everMadeNullith,
    boughtFirstVermyrosUpgrade: state.player.boughtFirstVermyrosUpgrade,
    boughtFourthVermyrosUpgrade: state.player.boughtFourthVermyrosUpgrade,
    boughtFifthVermyrosUpgrade: state.player.boughtFifthVermyrosUpgrade,
    boughtEighthVermyrosUpgrade: state.player.boughtEighthVermyrosUpgrade,
    boughtTenthVermyrosUpgrade: state.player.boughtTenthVermyrosUpgrade,
    bestSoftcapperLevel: state.player.bestSoftcapperLevel,
    everMadeCoreReset: state.player.everMadeCoreReset,
    boughtFourthNullithUpgrade: state.player.boughtFourthNullithUpgrade,
    boughtFifthNullithUpgrade: state.player.boughtFifthNullithUpgrade,
    enteredSliph: state.player.enteredSliph
  }));

  return (
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
                  {!state.boughtFourthTierUpgrade && <AutoresettingButton />}
                  <ResetUpgrades />
                </>
              )}
            </div>
            {state.everMadeRun && (
              <div className="layer">
                <TierBar />
                {state.everMadeTier && (
                  <>
                    <AutotierButton />
                    <TierUpgrades />
                    {(state.boughtFourthTierUpgrade ||
                      state.everMadeVermyros) && (
                      <>
                        <Ampliflux />
                        <AmplifluxUpgrade />
                        <MoreTierUpgrades />
                      </>
                    )}
                  </>
                )}
              </div>
            )}
            {(state.boughtFourthTierUpgrade || state.everMadeVermyros) && (
              <div className="layer">
                <VermyrosBar />
                {state.everMadeVermyros && (
                  <>
                    {!state.boughtEighthVermyrosUpgrade && (
                      <AutoVermyrosButton />
                    )}
                    <Vermora />
                    <Vermytes />
                    <VermyrosUpgrades />
                    {(state.boughtFirstVermyrosUpgrade ||
                      state.everMadeNullith) && <VermyteUpgrade />}
                    {(state.boughtFourthVermyrosUpgrade ||
                      state.everMadeNullith) && <MoreVermyrosUpgrades />}
                    {(state.boughtFifthVermyrosUpgrade ||
                      state.everMadeNullith) && <Amplivault />}
                  </>
                )}
                {state.bestSoftcapperLevel.greaterThanOrEqualTo(1) && (
                  <Softcapper />
                )}
                {(state.boughtEighthVermyrosUpgrade ||
                  state.everMadeNullith) && (
                  <>
                    <EnergyReactors />
                    <Energy />
                    <CoreButton />
                    {state.everMadeCoreReset && (
                      <>
                        <Cores />
                        <CoreUpgrade />
                      </>
                    )}
                    <MoreVermyrosUpgrades2 />
                  </>
                )}
                {(state.boughtTenthVermyrosUpgrade ||
                  state.everMadeNullith) && (
                  <>
                    <DarkEnergy />
                  </>
                )}
              </div>
            )}
          </>
        )}
        {state.enteredSliph && <SliphDimension />}
        {(state.boughtTenthVermyrosUpgrade || state.everMadeNullith) && (
          <div className="layer">
            {!state.enteredSliph && (
              <>
                <NullithBar />
                {state.everMadeNullith && (
                  <>
                    <AutoNullithButton />
                    <NullithUpgrades />
                    {state.boughtFourthNullithUpgrade && (
                      <>
                        <Nullifice />
                        <BreakAmplivault />
                        <MoreNullithUpgrades />
                      </>
                    )}
                  </>
                )}
              </>
            )}
            {((state.boughtFifthNullithUpgrade && state.everMadeNullith) ||
              state.enteredSliph) && <Sliph />}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
