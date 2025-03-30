import { useContext } from "react";
import { playerContext, settings } from "../playerUtils";
import Decimal from "break_eternity.js";
import { format, formatLeftTime } from "../format";

function VermyrosBar() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player } = context;
  let progress = +Decimal.min(player.points.dividedBy(settings.vermyrosGoal), 1).multiply(100);
  const stable = player.stableProgressBars && player.approximateVermyrosResetsPerSecond.greaterThan(5);
  if (stable) progress = 100;
  const timeLeft = Decimal.max(settings.vermyrosGoal.minus(player.points).div(player.pointGain).multiply(1000), 0);
  return (
    <div className="progression-div">
      <p className="progression-info">Goal: {format(settings.vermyrosGoal)} - <span className="time">{stable ? 'Ready' : formatLeftTime(timeLeft)}</span>{player.everMadeVermyros && (<span>&emsp;|&emsp;Best vermytes: {format(player.bestVermytes)} - <span className="vermyros-effect">Effect: {format(player.vermytesBestEffect)}x vermora</span></span>)}</p>
      <div className="vermyros-bar-container">
        <div className="progression-bar-inner vermyros-bar" style={{width: `${100 - progress}%`}}></div>
      </div>
    </div>
  )
}

export default VermyrosBar;