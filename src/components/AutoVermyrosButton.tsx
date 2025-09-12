import { usePlayer, usePlayerStore } from "@player/playerStore";

function AutoVermyrosButton() {
  const autoVermyrosEnabled = usePlayer(
    (state) => state.player.autoVermyrosEnabled
  );

  function toggleAutoresetting() {
    const { player, setPlayer } = usePlayerStore.getState();
    if (!player.everMadeVermyros) return;
    setPlayer({
      autoVermyrosEnabled: !player.autoVermyrosEnabled
    });
  }

  return (
    <div className="auto-toggle" aria-label="Toggle Auto Vermyros">
      <button onClick={toggleAutoresetting}>
        <p>Auto Vermyros: {autoVermyrosEnabled ? "enabled" : "disabled"}</p>
      </button>
    </div>
  );
}

export default AutoVermyrosButton;
