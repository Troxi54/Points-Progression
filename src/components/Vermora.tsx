import { format, formatWithPlural } from "../format";
import { usePlayer } from "../player/playerStore";

function Vermora() {
  const { vermora, vermoraGain, vermoraEffect } = usePlayer((state) => ({
    vermora: state.player.vermora,
    vermoraGain: state.cachedPlayer.vermoraGain,
    vermoraEffect: state.cachedPlayer.vermoraEffect
  }));

  return (
    <div id="vermora-container">
      <p id="vermora-counter">
        Vermora: {format(vermora)}
        {vermoraGain.gt(0) && <> (+{format(vermoraGain)}/s)</>} -{" "}
        <span className="text-vermyros-effect">
          Effect: {formatWithPlural(vermoraEffect, "Ampliflux", "x ")}
        </span>
      </p>
    </div>
  );
}

export default Vermora;
