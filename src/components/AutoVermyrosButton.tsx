import { useContext } from "react";
import { playerContext } from "../playerUtils";

function AutoVermyrosButton() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }
  const { player, setPlayer } = context;

  function toggleAutoresetting() {
    setPlayer(prev => {
      if (!prev.everMadeVermyros) return prev;
      return {
        ...prev,
        autoVermyrosEnabled: !prev.autoVermyrosEnabled
      }
    });
  }

  return (
    <div className="auto-toggle">
      <button onClick={toggleAutoresetting}>
        <p>{player.autoVermyrosEnabled ? 'Auto Vermyros: enabled' : 'Auto Vermyros: disabled'}</p>
      </button>
    </div>
  );
}

export default AutoVermyrosButton;