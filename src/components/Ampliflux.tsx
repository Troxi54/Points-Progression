import { format } from "@/format";
import { usePlayer } from "@player/playerStore";

function Ampliflux() {
  const { ampliflux, amplifluxGain, amplifluxEffect } = usePlayer((state) => ({
    ampliflux: state.player.ampliflux,
    amplifluxGain: state.cachedPlayer.amplifluxGain,
    amplifluxEffect: state.cachedPlayer.amplifluxEffect
  }));

  return (
    <div className="bg-ampliflux-bg">
      <p className="text-ampliflux-counter">
        Ampliflux: {format(ampliflux)}{" "}
        {amplifluxGain.gt(0) ? <>(+{format(amplifluxGain)}/s)</> : ""} -{" "}
        <span className="text-ampliflux-effect">
          Effect: {format(amplifluxEffect)}x
        </span>
      </p>
    </div>
  );
}

export default Ampliflux;
