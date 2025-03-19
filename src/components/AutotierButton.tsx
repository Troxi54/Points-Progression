import { useContext } from "react";
import { playerContext } from "../playerUtils";

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
        <p id="autoresetting-text">{player.autoTierEnabled ? player.boughtSecondVermyrosUpgrade ? 'Auto Tier Up: enabled' : 'Auto Tier: enabled'
                                                           : player.boughtSecondVermyrosUpgrade ? 'Auto Tier Up: disabled' : 'Auto Tier: disabled'}</p>
      </button>
    </div>
  );
}

export default AutotierButton;