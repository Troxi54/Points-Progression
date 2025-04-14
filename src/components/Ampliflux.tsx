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
    <div className="bg-ampliflux-bg">
      <p className="text-ampliflux-counter">Ampliflux: {format(player.ampliflux)} {player.boughtFourthTierUpgrade ? <>(+{format(player.amplifluxGain)}/s)</> : ''} - <span className="text-ampliflux-effect">Effect: {format(player.amplifluxEffect)}x</span></p>
    </div>
  );
}

export default Ampliflux;