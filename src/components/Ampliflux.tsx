import { useContext } from "react";
import { playerContext } from "../playerUtils";
import { format } from "../format";

function Ampliflux() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }
  const { player } = context;

  return (
    <div id="ampliflux-container">
      <p id="ampliflux-counter">Ampliflux: {format(player.ampliflux)} {player.boughtFourthTierUpgrade ? <span>(+{format(player.amplifluxGain)}/s)</span> : ''} - <span className="ampliflux-effect">Effect: {format(player.amplifluxEffect)}x</span></p>
    </div>
  );
}

export default Ampliflux;