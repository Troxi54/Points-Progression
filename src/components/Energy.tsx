import { format } from "@/format";
import { usePlayer } from "@player/playerStore";

function Energy() {
  const { energy, energyGain, energyEffect } = usePlayer((state) => ({
    energy: state.player.energy,
    energyGain: state.cachedPlayer.energyGain,
    energyEffect: state.cachedPlayer.energyEffect
  }));

  return (
    <div className="bg-energy-bg">
      <p className="text-energy-counter">
        Energy: {format(energy)}
        {energyGain.gt(0) ? ` (+${format(energyGain)}/s)` : ""}
        <span className="text-energy-effect">
          {" "}
          - Effect: {format(energyEffect)}x
        </span>
      </p>
    </div>
  );
}

export default Energy;
