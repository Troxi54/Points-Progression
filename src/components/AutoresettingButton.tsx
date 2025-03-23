import { useContext } from "react";
import { playerContext } from "../playerUtils";

function AutoresettingButton() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }
  const { player, setPlayer } = context;

  function toggleAutoresetting() {
    setPlayer(prev => {
      if (!prev.everMadeRun) return prev;
      return {
        ...prev,
        autoresettingEnabled: !prev.autoresettingEnabled
      }
    });
  }

  return (
    <div id="autoresetting-div">
      <button id="autoresetting-button" onClick={toggleAutoresetting}>
        <p id="autoresetting-text">{player.autoresettingEnabled ? 'Auto Reset: enabled' : 'Auto Reset: disabled'}</p>
      </button>
    </div>
  );
}

export default AutoresettingButton;