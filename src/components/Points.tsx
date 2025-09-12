import { format } from "@/format";
import { usePlayer } from "@player/playerStore";

function Points() {
  const { points, pointGain } = usePlayer((state) => ({
    points: state.player.points,
    pointGain: state.cachedPlayer.pointGain
  }));

  return (
    <div>
      <p>
        Points: {format(points)}
        {pointGain.notEquals(0) && ` (+${format(pointGain)}/s)`}
      </p>
    </div>
  );
}

export default Points;
