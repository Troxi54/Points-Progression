import { useContext } from "react";
import { playerContext, settings } from "../playerUtils";
import { format, formatLeftTime, formatTime } from "../format";
import Decimal from "break_eternity.js";

function ProgressionBar() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player } = context;
  let progress = +Decimal.min(player.points.dividedBy(settings.finalGoal), 1).multiply(100);
  const stable = player.stableProgressBars && player.approximateResetsPerSecond.greaterThan(5);
  if (stable) progress = 100;
  const timeLeft = Decimal.max(settings.finalGoal.minus(player.points).div(player.pointGain).multiply(1000), 0);
  return (
    <div className="progression-div">
      <p className="progression-info">Goal: {format(settings.finalGoal)} - <span className="time">{stable ? 'Ready' :formatLeftTime(timeLeft)}</span>{player.everMadeRun && (<span>&emsp;|&emsp;Best run: {player.bestRun === null ? 'no' : formatTime(player.bestRun)} - <span className="effect">Effect: {format(player.runEffect)}x</span>&emsp;|&emsp;Best points: {format(player.bestPointsOfRun)} - <span className="effect">Effect: {format(player.bestPointsOfRunEffect)}x</span></span>)}</p>
      <div className="progression-bar" style={{width: `${progress}%`}}></div>
    </div>
  )
}

export default ProgressionBar;