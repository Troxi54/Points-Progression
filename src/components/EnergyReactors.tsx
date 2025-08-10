import { format } from "../format";
import { usePlayer } from "../player/playerStore";

function EnergyReactors() {
  const { energyReactors, energyReactorGain } = usePlayer((state) => ({
    energyReactors: state.player.energyReactors,
    energyReactorGain: state.cachedPlayer.energyReactorGain
  }));

  return (
    <div className="bg-energy-reactor-bg">
      <p className="text-energy-reactor-counter">
        Energy Reactors: {format(energyReactors)}
        {energyReactorGain.gt(0) ? ` (+${format(energyReactorGain)}/s)` : ""}
      </p>
    </div>
  );
}

export default EnergyReactors;
