import './App.css'
import GameLoop from './components/GameLoop';
import { PlayerProvider } from './components/PlayerContext';
import PlayerInfo from './components/PlayerInfo';
import ProgressionBar from './components/ProgressionBar';
import StopAutoresettingButton from './components/StopAutoresettingButton';
import TimeSpent from './components/TimeSpent';
import UpgradeButton from './components/UpgradeButton';

function App() {
  return (
    <>
      <div className="game-container">
        <PlayerProvider>
          <GameLoop/>
          <TimeSpent/>
          <PlayerInfo/>
          <UpgradeButton/>
          <ProgressionBar/>
          <StopAutoresettingButton/>
        </PlayerProvider>
      </div>
    </>
  )
}

export default App;