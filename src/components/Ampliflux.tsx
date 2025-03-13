import { useContext } from "react";
import { playerContext } from "./PlayerContext";
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
      <p id="ampliflux-counter">Ampliflux: {format(player.ampliflux)} (+{format(player.amplifluxGain)}/s) - <span className="ampliflux-effect">Effect: {format(player.amplifluxEffect)}x</span></p>
    </div>
  );
}

export default Ampliflux;