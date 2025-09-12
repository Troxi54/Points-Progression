import { usePlayer, usePlayerStore } from "@player/playerStore";

function AutoNullithButton() {
  const autoNullithEnabled = usePlayer(
    (state) => state.player.autoNullithEnabled
  );

  function toggleAutoresetting() {
    const { player, setPlayer } = usePlayerStore.getState();
    if (!player.everMadeNullith) return;
    setPlayer({
      autoNullithEnabled: !player.autoNullithEnabled
    });
  }

  return (
    <div className="auto-toggle">
      <button onClick={toggleAutoresetting} aria-label="Toggle Auto Nullith">
        <p>
          {autoNullithEnabled
            ? "Auto Nullith: enabled"
            : "Auto Nullith: disabled"}
        </p>
      </button>
    </div>
  );
}

export default AutoNullithButton;
