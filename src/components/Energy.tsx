import { useContext } from "react";
import { playerContext } from "../playerUtils";
import { format } from "../format";

function Energy() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player } = context;
  return (
    <div id="energy-container">
      <p id="energy-counter">Energy: {format(player.energy)}{player.energyGain.gt(0) ? ` (+${format(player.energyGain)}/s)` : ''}{player.energyEffect.gt(1) && (<span className="energy-effect"> - Effect: {format(player.energyEffect)}x</span>)}</p>
    </div>
  );
}

export default Energy;