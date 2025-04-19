import { useContext } from "react";
import { playerContext } from "../playerUtils";

function AutoNullithButton() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }
  const { player, setPlayer } = context;

  function toggleAutoresetting() {
    setPlayer(prev => {
      if (!prev.everMadeNullith) return prev;
      return {
        ...prev,
        autoNullithEnabled: !prev.autoNullithEnabled
      }
    });
  }

  return (
    <div className="auto-toggle">
      <button onClick={toggleAutoresetting}>
        <p>{player.autoNullithEnabled ? 'Auto Nullith: enabled' : 'Auto Nullith: disabled'}</p>
      </button>
    </div>
  );
}

export default AutoNullithButton;