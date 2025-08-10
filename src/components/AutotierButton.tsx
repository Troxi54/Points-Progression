import { usePlayer, usePlayerStore } from "../player/playerStore";

function AutotierButton() {
  const { autoTierEnabled, boughtSecondVermyrosUpgrade } = usePlayer(
    (state) => ({
      autoTierEnabled: state.player.autoTierEnabled,
      boughtSecondVermyrosUpgrade: state.player.boughtSecondVermyrosUpgrade
    })
  );

  function toggleAutoresetting() {
    const { player, setPlayer } = usePlayerStore.getState();
    if (!player.everMadeTier) return;
    setPlayer({
      autoTierEnabled: !player.autoTierEnabled
    });
  }

  return (
    <div className="auto-toggle">
      <button onClick={toggleAutoresetting}>
        <p>
          {autoTierEnabled
            ? boughtSecondVermyrosUpgrade
              ? "Auto Tier Up: enabled"
              : "Auto Tier: enabled"
            : boughtSecondVermyrosUpgrade
            ? "Auto Tier Up: disabled"
            : "Auto Tier: disabled"}
        </p>
      </button>
    </div>
  );
}

export default AutotierButton;
