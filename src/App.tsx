import GameLoop from './components/GameLoop';
import { playerContext } from "./playerUtils";
import PlayerInfo from './components/PlayerInfo';
import ProgressionBar from './components/ProgressionBar';
import ResetUpgrades from './components/ResetUpgrades';
import AutoresettingButton from './components/AutoresettingButton';
import TimeSpent from './components/TimeSpent';
import UpgradeButton from './components/UpgradeButton';
import TierBar from './components/TierBar';
import AutotierButton from './components/AutotierButton';
import TierUpgrades from './components/TierUpgrades';
import { useContext } from 'react';
import Ampliflux from './components/Ampliflux';
import AmplifluxUpgrade from './components/AmplifluxUpgrade';
import MoreTierUpgrades from './components/MoreTierUpgrades';
import VermyrosBar from './components/VermyrosBar';
import Vermora from './components/Vermora';
import Vermytes from './components/Vermytes';
import VermyrosUpgrades from './components/VermyrosUpgrades';
import VermyteUpgrade from './components/VermyteUpgrade';
import AutoVermyrosButton from './components/AutoVermyrosButton';
import Menu from './components/Menu';
import MoreVermyrosUpgrades from './components/MoreVermyrosUpgrades';
import Amplivault from './components/Amplivault';
import Softcapper from './components/Softcapper';
import EnergyReactors from './components/EnergyReactors';
import Energy from './components/Energy';
import CoreButton from './components/CoreButton';
import Cores from './components/Cores';
import CoreUpgrade from './components/CoreUpgrade';
import MoreVermyrosUpgrades2 from './components/MoreVermyrosUpgrades2';
import DarkEnergy from './components/DarkEnergy';
import NullithBar from './components/NullithBar';
import AutoNullithButton from './components/AutoNullithButton';
import NullithUpgrades from './components/NullithUpgrades';

function App() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div><h1>Loading...</h1></div>
    )
  }
  const { player } = context;
  return (
    <>
      <Menu/>
      <div className="size-full flex-col gap-20 overflow-y-auto pt-6 pb-12">
        <div className="layer">
          <GameLoop/>
          <TimeSpent/>
          <PlayerInfo/>
          <UpgradeButton/>
          <ProgressionBar/>
          {player.everMadeRun && (
            <>
              {!player.boughtFourthTierUpgrade && (
                <AutoresettingButton/>
              )}
              <ResetUpgrades/>
            </>
          )}
        </div>
        {player.everMadeRun && (
          <div className="layer">
            <TierBar/>
            {player.everMadeTier && (
              <>
                <AutotierButton/>
                <TierUpgrades/>
                {(player.boughtFourthTierUpgrade || player.everMadeVermyros) && (
                  <>
                    <Ampliflux/>
                    <AmplifluxUpgrade/>
                    <MoreTierUpgrades/>
                  </>
                )}
              </>
            )}
          </div>
        )}
        {(player.boughtFourthTierUpgrade || player.everMadeVermyros) && (
          <div className="layer">
            <VermyrosBar/>
            {player.everMadeVermyros && (
              <>
                {!player.boughtEighthVermyrosUpgrade && (<AutoVermyrosButton/>)}
                <Vermora/>
                <Vermytes/>
                <VermyrosUpgrades/>
                {(player.boughtFirstVermyrosUpgrade || player.everMadeNullith) && (
                  <VermyteUpgrade/>
                )}
                {(player.boughtFourthVermyrosUpgrade || player.everMadeNullith) && (
                  <MoreVermyrosUpgrades/>
                )}
                {(player.boughtFifthVermyrosUpgrade || player.everMadeNullith) && (
                  <Amplivault/>
                )}
              </>
            )}
            {player.bestSoftcapperLevel.greaterThanOrEqualTo(1) && (<Softcapper/>)}
            {(player.boughtEighthVermyrosUpgrade || player.everMadeNullith) && (
              <>
                <EnergyReactors/>
                <Energy/>
                <CoreButton/>
                {player.everMadeCoreReset && (
                  <>
                    <Cores/>
                    <CoreUpgrade/>
                  </>
                )}
                <MoreVermyrosUpgrades2/>
              </>
            )}
            {(player.everBoughtTenthVermyrosUpgrade || player.everMadeNullith) && (
              <>
                <DarkEnergy/>
              </>
            )}
          </div>
        )}
        {(player.everBoughtTenthVermyrosUpgrade || player.everMadeNullith) && (
          <div className="layer">
            <NullithBar/>
            {player.everMadeNullith && (
              <>
                <AutoNullithButton/>
                <NullithUpgrades/>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default App;