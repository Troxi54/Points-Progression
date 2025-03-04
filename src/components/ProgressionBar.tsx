import { useContext } from "react";
import { playerContext, settings } from "./PlayerContext";
import { format, formatTime } from "../format";

function ProgressionBar() {
  const context = useContext(playerContext);
    if (!context) {
      return (
        <div>Loading...</div>
      )
    }
  
    const { player } = context;
    const progress = Math.min(player.points / settings.finalGoal * 1, 1) * 100;
    return (
      <div id="progression-div">
        <p id="progression-info">Goal: {format(settings.finalGoal)}<span style={{display: player.everMadeRun ? '' : 'none'}}>&emsp;|&emsp;Best run: {formatTime(player.bestRun === null ? 0 : player.bestRun)} - <span id="progression-effect">Effect: {format(player.runEffect)}x</span></span></p>
        <div id="progression-bar" style={{width: `${progress}%`}}></div>
      </div>
    )
}

export default ProgressionBar;