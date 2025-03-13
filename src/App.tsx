import './App.css'
import GameLoop from './components/GameLoop';
import { playerContext } from './components/PlayerContext';
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
import DataButtons from './components/DataButtons';
import Ampliflux from './components/Ampliflux';
import AmplifluxUpgrade from './components/AmplifluxUpgrade';
import MoreTierUpgrades from './components/MoreTierUpgrade';

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
      <div className="layer first-layer">
        <GameLoop/>
        <DataButtons/>
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
              {player.boughtFourthTierUpgrade && (
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
    </>
  )
}

export default App;