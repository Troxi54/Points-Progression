import { useContext } from "react";
import { playerContext } from "../playerUtils";
import { format } from "../format";

function Cores() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player } = context;
  return (
    <div id="core-container">
      <p id="core-counter">Cores: {format(player.cores)}{player.coreEffect.greaterThan(1) && (<span className="core-effect"> - Effect: {format(player.coreEffect)}x energy reactors</span>)}</p>
    </div>
  );
}

export default Cores;