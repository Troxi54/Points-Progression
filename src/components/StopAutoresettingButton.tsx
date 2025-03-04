import { useContext } from "react";
import { playerContext } from "./PlayerContext";

function StopAutoresettingButton() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }
  const { player, setPlayer } = context;

  function toggleAutoresetting() {
    setPlayer(prev => ({
      ...prev,
      autoresettingEnabled: !prev.autoresettingEnabled
    }));
  }

  return (
    <div id="autoresetting-div" style={{display: player.everMadeRun ? '' : 'none'}}>
      <button id="autoresetting-button" onClick={toggleAutoresetting}>
        <p id="autoresetting-text">{player.autoresettingEnabled ? 'Disable autoresetting' : 'Enable autoresetting'}</p>
      </button>
    </div>
  );
}

export default StopAutoresettingButton;