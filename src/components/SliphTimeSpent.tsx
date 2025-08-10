import { formatTime } from "../format";
import { usePlayer } from "../player/playerStore";

function SliphTimeSpent() {
  const { timeSinceHighestReset } = usePlayer((state) => ({
    timeSinceHighestReset: state.cachedPlayer.timeSinceHighestReset
  }));

  return (
    <div>
      <p>Time spent this run: {formatTime(timeSinceHighestReset)}</p>
    </div>
  );
}

export default SliphTimeSpent;
