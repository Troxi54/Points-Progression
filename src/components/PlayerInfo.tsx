import { useContext } from "react";
import { format } from "../format";
import { playerContext } from "./PlayerContext";

function PlayerInfo() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player } = context;

  return (
    <div id="points-container">
      <p id="points-counter">Points: {format(player.points)} (+{format(player.pointGain)}/s)</p>
    </div>
  );
}

export default PlayerInfo;