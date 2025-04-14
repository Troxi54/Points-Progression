import { useContext } from "react";
import { playerContext } from "../playerUtils";
import { format } from "../format";

function EnergyReactors() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player } = context;
  return (
    <div className="bg-energy-reactor-bg">
      <p className="text-energy-reactor-counter">Energy Reactors: {format(player.energyReactors)}{player.energyReactorGain.gt(0) ? ` (+${format(player.energyReactorGain)}/s)` : ''}</p>
    </div>
  );
}

export default EnergyReactors;