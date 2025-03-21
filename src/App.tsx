import './App.css'
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

function App() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }
  const { player } = context;
  return (
    <>
      <Menu/>
      <div className="layers">
        <div className="layer first-layer">
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
          <div className="layer second-layer">
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
          <div className="layer third-layer">
            <VermyrosBar/>
            {player.everMadeVermyros && (
              <>
                <AutoVermyrosButton/>
                <Vermora/>
                <Vermytes/>
                <VermyrosUpgrades/>
                {player.boughtFirstVermyrosUpgrade && (
                  <VermyteUpgrade/>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default App;