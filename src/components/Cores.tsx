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
    <div className="bg-core-bg">
      <p id="core-counter">Cores: {format(player.cores)}{player.coresPerSecond.gt(0) && <> (+{format(player.coresPerSecond)}/s)</>}<span className="text-core-effect"> - Effect: {format(player.coreEffect)}x energy reactors</span></p>
    </div>
  );
}

export default Cores;