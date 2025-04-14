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
    setPlayer(prev => {
      if (!prev.everMadeTier) return prev;
      return {
        ...prev,
        autoTierEnabled: !prev.autoTierEnabled
      }
    });
  }

  return (
    <div className="auto-toggle">
      <button onClick={toggleAutoresetting}>
        <p>{player.autoTierEnabled ? player.boughtSecondVermyrosUpgrade ? 'Auto Tier Up: enabled' : 'Auto Tier: enabled'
                                                           : player.boughtSecondVermyrosUpgrade ? 'Auto Tier Up: disabled' : 'Auto Tier: disabled'}</p>
      </button>
    </div>
  );
}

export default AutotierButton;