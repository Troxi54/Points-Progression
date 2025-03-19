import { useContext } from "react";
import { format } from "../format";
import { playerContext } from "../playerUtils";

function Vermora() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player } = context;

  return (
    <div id="vermora-container">
      <p id="vermora-counter">Vermora: {format(player.vermora)} (+{format(player.vermoraGain)}/s) - <span className="vermyros-effect">Effect: {format(player.vermoraEffect)}x ampliflux</span></p>
    </div>
  );
}

export default Vermora;