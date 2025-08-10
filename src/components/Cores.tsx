import { format, formatWithPlural } from "../format";
import { usePlayer } from "../player/playerStore";

function Cores() {
  const { cores, coresPerSecond, coreEffect } = usePlayer((state) => ({
    cores: state.player.cores,
    coresPerSecond: state.cachedPlayer.coresPerSecond,
    coreEffect: state.cachedPlayer.coreEffect
  }));

  return (
    <div className="bg-core-bg">
      <p id="core-counter">
        Cores: {format(cores)}
        {coresPerSecond.gt(0) && <> (+{format(coresPerSecond)}/s)</>}
        <span className="text-core-effect">
          {" "}
          - Effect: {formatWithPlural(coreEffect, "Energy Reactors", "x ")}
        </span>
      </p>
    </div>
  );
}

export default Cores;
