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
    <div className="auto-toggle">
      <button onClick={toggleAutoresetting}>
        <p>{player.autoresettingEnabled ? 'Auto Reset: enabled' : 'Auto Reset: disabled'}</p>
      </button>
    </div>
  );
}

export default AutoresettingButton;