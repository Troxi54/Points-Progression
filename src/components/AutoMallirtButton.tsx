import { usePlayer, usePlayerStore } from "../player/playerStore";

function AutoMallirtButton() {
  const autoMallirtEnabled = usePlayer(
    (state) => state.player.autoMallirtEnabled
  );

  function toggleAutoresetting() {
    const { player, setPlayer } = usePlayerStore.getState();
    if (!player.everMadeMallirt) return;
    setPlayer({
      autoMallirtEnabled: !player.autoMallirtEnabled
    });
  }

  return (
    <div className="auto-toggle">
      <button onClick={toggleAutoresetting}>
        <p>
          {autoMallirtEnabled
            ? "Auto Mallirt: enabled"
            : "Auto Mallirt: disabled"}
        </p>
      </button>
    </div>
  );
}

export default AutoMallirtButton;
