import { usePlayer, usePlayerStore } from "../player/playerStore";

function AutoresettingButton() {
  const autoresettingEnabled = usePlayer(
    (state) => state.player.autoresettingEnabled
  );

  function toggleAutoresetting() {
    const { player, setPlayer } = usePlayerStore.getState();
    if (!player.everMadeRun) return;
    setPlayer({
      autoresettingEnabled: !player.autoresettingEnabled
    });
  }

  return (
    <div className="auto-toggle">
      <button onClick={toggleAutoresetting}>
        <p>
          {autoresettingEnabled
            ? "Auto Reset: enabled"
            : "Auto Reset: disabled"}
        </p>
      </button>
    </div>
  );
}

export default AutoresettingButton;
