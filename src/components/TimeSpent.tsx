import { useContext } from "react";
import { playerContext } from "./PlayerContext";
import { formatTime } from "../format";

function TimeSpent() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }
  
  const { player } = context;
  return (
    <div>
      <p>Time spent this run: {player.tierStartedDate === null ? formatTime(Date.now() - player.startedRun) : <><span>{formatTime(Date.now() - player.tierStartedDate)}</span> <span className="tier">(T)</span></>}</p>
    </div>
  )
}

export default TimeSpent;