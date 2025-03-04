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
      <p>Time spent this run: {formatTime(Date.now() - player.startedRun)}</p>
    </div>
  )
}

export default TimeSpent;