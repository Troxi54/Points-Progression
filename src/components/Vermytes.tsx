import { useContext } from "react";
import { format } from "../format";
import { playerContext } from "../playerUtils";

function Vermytes() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player } = context;

  return (
    <div id="vermytes-container">
      <p id="vermytes-counter">Vermytes: {format(player.vermytes)}{player.vermytesGain.greaterThan(0) && (<span> (+{format(player.vermytesGain)})</span>)}</p>
    </div>
  );
}

export default Vermytes;