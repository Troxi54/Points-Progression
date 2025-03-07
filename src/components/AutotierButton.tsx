import { useContext } from "react";
import { playerContext } from "./PlayerContext";

function AutotierButton() {
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
      autoTierEnabled: !prev.autoTierEnabled
    }));
  }

  return (
    <div id="autoresetting-div">
      <button id="autoresetting-button" onClick={toggleAutoresetting}>
        <p id="autoresetting-text">{player.autoTierEnabled ? 'Auto Tier: enabled' : 'Auto Tier: disabled'}</p>
      </button>
    </div>
  );
}

export default AutotierButton;