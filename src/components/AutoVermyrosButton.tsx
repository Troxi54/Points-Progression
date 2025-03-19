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
    setPlayer(prev => ({
      ...prev,
      autoVermyrosEnabled: !prev.autoVermyrosEnabled
    }));
  }

  return (
    <div id="autoresetting-div">
      <button id="autoresetting-button" onClick={toggleAutoresetting}>
        <p id="autoresetting-text">{player.autoVermyrosEnabled ? 'Auto Vermyros: enabled' : 'Auto Vermyros: disabled'}</p>
      </button>
    </div>
  );
}

export default AutoVermyrosButton;