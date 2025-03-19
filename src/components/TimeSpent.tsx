import { useContext } from "react";
import { playerContext } from "../playerUtils";
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
      <p>Time spent this run: {player.vermyrosStartedDate === null ? player.tierStartedDate === null ? formatTime(Date.now() - player.startedRun) : <><span>{formatTime(Date.now() - player.tierStartedDate)}</span> <span className="tier">(T)</span></> : <><span>{formatTime(Date.now() - player.vermyrosStartedDate)}</span> <span className="vermyros">(V)</span></>}</p>
    </div>
  )
}

export default TimeSpent;