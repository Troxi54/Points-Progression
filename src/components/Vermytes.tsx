import { format } from "../format";
import { usePlayer } from "../player/playerStore";

function Vermytes() {
  const {
    vermytes,
    boughtEighthVermyrosUpgrade,
    vermytesGain,
    vermytesPerSecond
  } = usePlayer((state) => ({
    vermytes: state.player.vermytes,
    boughtEighthVermyrosUpgrade: state.player.boughtEighthVermyrosUpgrade,
    vermytesGain: state.cachedPlayer.vermytesGain,
    vermytesPerSecond: state.cachedPlayer.vermytesPerSecond
  }));

  return (
    <div id="vermytes-container">
      <p id="vermytes-counter">
        Vermytes: {format(vermytes)}
        {vermytesGain.greaterThan(0) && !boughtEighthVermyrosUpgrade && (
          <span> (+{format(vermytesGain)})</span>
        )}
        {vermytesPerSecond.greaterThan(0) && (
          <span> (+{format(vermytesPerSecond)}/s)</span>
        )}
      </p>
    </div>
  );
}

export default Vermytes;
